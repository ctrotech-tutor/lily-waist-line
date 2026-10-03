import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAppUrl } from "@/lib/utils/app-url";
import { isAllowedImageType } from "@/lib/utils/file-validation";
import { expireReservationForOrder } from "@/lib/services/inventory-reservations";
import { isReservationExpired } from "@/lib/services/reservation-policy";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const PAYMENT_PROOF_BUCKET = "payment-proofs";

function getAllowedOrigins(): Set<string> {
  const origins = new Set(["http://localhost:3000", "https://www.lilywaistline.com"]);
  try {
    origins.add(new URL(getAppUrl()).origin);
  } catch {
    // An invalid configured app URL should not disable the local development origin.
  }
  return origins;
}

function validateOrigin(request: NextRequest): boolean {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get("origin");

  if (origin) {
    try {
      return allowedOrigins.has(new URL(origin).origin);
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (!referer) return false;
  try {
    return allowedOrigins.has(new URL(referer).origin);
  } catch {
    return false;
  }
}

function isOrderClosed(order: {
  paymentStatus: string;
  fulfillmentStatus: string;
  inventoryReleasedAt: Date | null;
  inventoryCommittedAt: Date | null;
}) {
  return order.paymentStatus !== "PENDING"
    || order.fulfillmentStatus !== "PENDING"
    || order.inventoryReleasedAt !== null
    || order.inventoryCommittedAt !== null;
}

export async function POST(request: NextRequest) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const fileValue = formData.get("file");
    const orderIdValue = formData.get("orderId");
    const transactionRefValue = formData.get("transactionRef");

    if (!(fileValue instanceof File)) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }
    if (typeof orderIdValue !== "string" || !orderIdValue.trim()) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const file = fileValue;
    const orderId = orderIdValue.trim();
    const transactionRef = typeof transactionRefValue === "string"
      ? transactionRefValue.trim().slice(0, 200) || null
      : null;

    if (!isAllowedImageType(file.type, file.name)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPEG, and WebP images are allowed." },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    const ownedOrder = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
      select: { id: true },
    });
    if (!ownedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Expiry and upload both use conditional order updates, so only one can win
    // if a request lands at the 24-hour boundary.
    const wasExpired = await expireReservationForOrder(orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        paymentRecipient: true,
        reservationExpiresAt: true,
        inventoryReleasedAt: true,
        inventoryCommittedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (wasExpired) {
      return NextResponse.json(
        { error: "The 24-hour payment-proof window has expired. Please place a new order." },
        { status: 410 },
      );
    }
    if (!order.paymentRecipient) {
      return NextResponse.json(
        { error: "Payment details for this order need support confirmation before proof can be submitted." },
        { status: 409 },
      );
    }
    if (isOrderClosed(order)) {
      return NextResponse.json(
        { error: "This order is closed and can no longer accept payment proof." },
        { status: 409 },
      );
    }
    if (isReservationExpired(order.reservationExpiresAt, new Date())) {
      return NextResponse.json(
        { error: "The 24-hour payment-proof window has expired. Please place a new order." },
        { status: 410 },
      );
    }

    const existingPendingProof = await prisma.paymentProof.findFirst({
      where: { orderId, status: "PENDING" },
      select: { id: true },
    });
    if (existingPendingProof) {
      return NextResponse.json(
        { error: "A payment proof is already pending review. Please wait for admin verification." },
        { status: 409 },
      );
    }

    const extensionByType: Record<string, string> = {
      "image/png": "png",
      "image/x-png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/webp": "webp",
    };
    const fileExt = extensionByType[file.type]
      || (file.name.toLowerCase().endsWith(".png") ? "png" : null);

    if (!fileExt) {
      return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
    }

    const fileName = `payment-proof-${crypto.randomUUID()}.${fileExt}`;
    const storagePath = `orders/${orderId}/payment-proof/${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(PAYMENT_PROOF_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file. Please try again." },
        { status: 500 },
      );
    }

    let paymentProof;
    try {
      paymentProof = await prisma.$transaction(async (tx) => {
        const now = new Date();
        const reservation = await tx.order.updateMany({
          where: {
            id: orderId,
            userId: user.id,
            paymentStatus: "PENDING",
            fulfillmentStatus: "PENDING",
            inventoryReleasedAt: null,
            inventoryCommittedAt: null,
            OR: [
              { reservationExpiresAt: null },
              { reservationExpiresAt: { gt: now } },
            ],
          },
          data: { reservationExpiresAt: null },
        });

        if (reservation.count !== 1) {
          throw new Error("ORDER_CLOSED_OR_EXPIRED");
        }

        const existing = await tx.paymentProof.findFirst({
          where: { orderId, status: "PENDING" },
          select: { id: true },
        });
        if (existing) throw new Error("PENDING_PROOF_EXISTS");

        return tx.paymentProof.create({
          data: {
            orderId,
            imageUrl: storagePath,
            transactionRef,
            status: "PENDING",
          },
        });
      });
    } catch (error) {
      const { error: cleanupError } = await supabaseAdmin.storage
        .from(PAYMENT_PROOF_BUCKET)
        .remove([storagePath]);
      if (cleanupError) console.error("Failed to remove orphaned proof upload:", cleanupError);

      if (error instanceof Error && error.message === "PENDING_PROOF_EXISTS") {
        return NextResponse.json(
          { error: "A payment proof is already pending review. Please wait for admin verification." },
          { status: 409 },
        );
      }
      if (error instanceof Error && error.message === "ORDER_CLOSED_OR_EXPIRED") {
        await expireReservationForOrder(orderId);
        return NextResponse.json(
          { error: "This order is closed or its payment-proof window has expired." },
          { status: 409 },
        );
      }
      throw error;
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(PAYMENT_PROOF_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    if (signedUrlError) {
      console.error("Failed to create signed URL:", signedUrlError);
    }

    return NextResponse.json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: {
        id: paymentProof.id,
        transactionRef: paymentProof.transactionRef,
        status: paymentProof.status,
        uploadedAt: paymentProof.uploadedAt,
        adminViewUrl: signedUrlData?.signedUrl || null,
      },
    });
  } catch (error) {
    console.error("Payment proof upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = new URL(request.url).searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const [userInfo, order] = await Promise.all([
      prisma.user.findUnique({ where: { id: user.id }, select: { role: true } }),
      prisma.order.findUnique({ where: { id: orderId }, select: { userId: true } }),
    ]);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = userInfo?.role === "ADMIN";
    const isOwner = order.userId === user.id;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await expireReservationForOrder(orderId);

    const paymentProofs = await prisma.paymentProof.findMany({
      where: { orderId },
      orderBy: { uploadedAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        transactionRef: true,
        status: true,
        uploadedAt: true,
      },
    });

    if (isAdmin) {
      const proofsWithUrls = await Promise.all(
        paymentProofs.map(async (proof) => {
          const { data: signedUrlData } = await supabase.storage
            .from(PAYMENT_PROOF_BUCKET)
            .createSignedUrl(proof.imageUrl, 60 * 60);
          return { ...proof, viewUrl: signedUrlData?.signedUrl || null };
        }),
      );
      return NextResponse.json({ success: true, data: proofsWithUrls });
    }

    return NextResponse.json({ success: true, data: paymentProofs });
  } catch (error) {
    console.error("Get payment proofs error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
