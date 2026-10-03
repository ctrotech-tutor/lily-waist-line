import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { serverEnv } from "@/lib/env";
import { releaseExpiredInventoryReservations } from "@/lib/services/inventory-reservations";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const secret = serverEnv.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Inventory expiry job is not configured" },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await releaseExpiredInventoryReservations(new Date(), 250);

    if (result.releasedOrders > 0) {
      revalidatePath("/");
      revalidatePath("/shop");
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Expired inventory release failed:", error);
    return NextResponse.json(
      { error: "Failed to release expired inventory reservations" },
      { status: 500 },
    );
  }
}
