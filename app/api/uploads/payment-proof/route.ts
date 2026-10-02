import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/utils/app-url";
import { isAllowedImageType } from "@/lib/utils/file-validation";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_ORIGINS = ["http://localhost:3000", getAppUrl()];

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin || referer;
  if (!source) return false;
  return ALLOWED_ORIGINS.some((o) => source.startsWith(o));
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
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;
    const transactionRef = formData.get("transactionRef") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    if (!isAllowedImageType(file.type, file.name)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PNG, JPEG, and WebP images are allowed.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty." }, { status: 400 });
    }

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, userId: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        {
          error:
            "Access denied. You can only upload payment proofs for your own orders.",
        },
        { status: 403 },
      );
    }

    // Upload to storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extMap: Record<string, string> = {
      "image/png": "png",
      "image/x-png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    };
    const fileExt = extMap[file.type] || (file.name.endsWith('.png') ? 'png' : null);

    if (!fileExt) {
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400 },
      );
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `payment-proof-${timestamp}-${randomString}.${fileExt}`;

    const storagePath = `orders/${orderId}/payment-proof/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
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

    // Atomic check + create to prevent duplicate pending proofs
    const paymentProof = await prisma.$transaction(async (tx) => {
      const existing = await tx.paymentProof.findFirst({
        where: { orderId, status: "PENDING" },
        select: { id: true },
      });

      if (existing) {
        throw new Error("CONFLICT");
      }

      return tx.paymentProof.create({
        data: {
          orderId,
          imageUrl: storagePath,
          transactionRef: transactionRef?.trim() || null,
          status: "PENDING",
        },
      });
    });

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("payment-proofs")
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
    if (error instanceof Error && error.message === "CONFLICT") {
      return NextResponse.json(
        {
          error:
            "A payment proof is already pending review. Please wait for admin verification before uploading another proof.",
        },
        { status: 409 },
      );
    }
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

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAdmin = userInfo?.role === "ADMIN";
    const isOwner = order.userId === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

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
        paymentProofs.map(
          async (proof: {
            imageUrl: string;
            transactionRef: string | null;
            status: string;
            id: string;
            uploadedAt: Date;
          }) => {
            const { data: signedUrlData } = await supabase.storage
              .from("payment-proofs")
              .createSignedUrl(proof.imageUrl, 60 * 60);

            return {
              ...proof,
              viewUrl: signedUrlData?.signedUrl || null,
            };
          },
        ),
      );

      return NextResponse.json({
        success: true,
        data: proofsWithUrls,
      });
    }

    return NextResponse.json({
      success: true,
      data: paymentProofs,
    });
  } catch (error) {
    console.error("Get payment proofs error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
