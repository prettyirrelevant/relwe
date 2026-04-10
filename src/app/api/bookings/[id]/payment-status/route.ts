import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { after } from "next/server";

import { confirmBooking } from "~/lib/confirm-booking";
import { bookings, seats } from "~/db/schema";
import { checkPayment } from "~/lib/solana";
import { auth } from "~/lib/auth";
import { db } from "~/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, session.user.id)))
    .limit(1);

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.paymentStatus === "confirmed") {
    return NextResponse.json({ status: "confirmed" });
  }

  // check expiry
  if (new Date() > booking.expiresAt) {
    if (booking.paymentStatus !== "expired") {
      // booking + seat updates are independent — run in parallel
      await Promise.all([
        db
          .update(bookings)
          .set({ paymentStatus: "expired" })
          .where(eq(bookings.id, id)),
        db
          .update(seats)
          .set({
            status: "available",
            bookingId: null,
            holdUntil: null,
            holdBy: null,
          })
          .where(eq(seats.bookingId, id)),
      ]);
    }
    return NextResponse.json({ status: "expired" });
  }

  // check cNGN balance on the derived wallet
  try {
    const { paid } = await checkPayment(id, booking.totalAmountKobo);

    if (paid) {
      // mark booking confirmed + flip seats to booked, in parallel
      await Promise.all([
        db
          .update(bookings)
          .set({ paymentStatus: "confirmed" })
          .where(eq(bookings.id, id)),
        db
          .update(seats)
          .set({ status: "booked", holdUntil: null })
          .where(eq(seats.bookingId, id)),
      ]);

      // generate ticket QR payloads after the response is sent
      after(async () => {
        try {
          await confirmBooking(id);
        } catch {
          // ticket generation failure shouldn't affect the user response
        }
      });

      return NextResponse.json({ status: "confirmed" });
    }
  } catch {
    // RPC error, return pending
  }

  return NextResponse.json({ status: "pending" });
}
