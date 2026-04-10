import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";

import { bookingPassengers, bookings, seats } from "~/db/schema";
import { validateBookable } from "~/lib/train-availability";
import { RESERVATION_DURATION_MS } from "~/lib/constants";
import { getBookingWalletAddress } from "~/lib/solana";
import { ID_PREFIXES, prefixedId } from "~/lib/id";
import { auth } from "~/lib/auth";
import { db } from "~/db";

interface PassengerInput {
  passengerType: "adult" | "minor";
  fullName: string;
  isSelf: boolean;
  seatId: string;
  nin: string;
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    destinationStationId: string;
    passengers: PassengerInput[];
    originStationId: string;
    totalAmountKobo: number;
    travelDate: string;
    trainId: string;
    class: string;
  };

  const validationError = await validateBookable({
    fromStationId: body.originStationId,
    travelDate: body.travelDate,
    trainId: body.trainId,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const datePart = body.travelDate.replace(/-/g, "");
  const shortId = prefixedId("").slice(1, 5).toUpperCase();
  const reference = `RLW-${datePart}-${shortId}`;

  const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);
  const bookingId = prefixedId(ID_PREFIXES.booking);
  const walletAddress = getBookingWalletAddress(bookingId);

  await db.insert(bookings).values({
    destinationStationId: body.destinationStationId,
    originStationId: body.originStationId,
    totalAmountKobo: body.totalAmountKobo,
    solanaReference: walletAddress,
    travelDate: body.travelDate,
    paymentStatus: "pending",
    userId: session.user.id,
    trainId: body.trainId,
    class: body.class,
    id: bookingId,
    expiresAt,
    reference,
  });

  // passenger insert and seat reservation are independent — run in parallel
  await Promise.all([
    db.insert(bookingPassengers).values(
      body.passengers.map((p) => ({
        id: prefixedId(ID_PREFIXES.bookingPassenger),
        passengerType: p.passengerType,
        fullName: p.fullName,
        isSelf: p.isSelf,
        seatId: p.seatId,
        nin: p.nin,
        bookingId,
      })),
    ),
    db
      .update(seats)
      .set({
        holdUntil: expiresAt,
        status: "reserved",
        bookingId,
      })
      .where(inArray(seats.id, body.passengers.map((p) => p.seatId))),
  ]);

  const cngnAmount = body.totalAmountKobo / 100;

  return NextResponse.json({
    expiresAt: expiresAt.toISOString(),
    walletAddress,
    cngnAmount,
    bookingId,
    reference,
  });
}
