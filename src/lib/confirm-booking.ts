import { eq } from "drizzle-orm";

import {
  bookingPassengers,
  bookings,
  coaches,
  tickets,
  seats,
} from "~/db/schema";
import { db } from "~/db";

import { signPayload } from "./tickets";

/**
 * Generate signed QR ticket payloads for all passengers in a booking.
 * Called after payment is confirmed.
 */
export async function confirmBooking(bookingId: string) {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking || booking.paymentStatus !== "confirmed") return;

  const passengers = await db
    .select({
      fullName: bookingPassengers.fullName,
      passengerId: bookingPassengers.id,
      coachNumber: coaches.coachNumber,
      seatNumber: seats.seatNumber,
    })
    .from(bookingPassengers)
    .innerJoin(seats, eq(seats.id, bookingPassengers.seatId))
    .innerJoin(coaches, eq(coaches.id, seats.coachId))
    .where(eq(bookingPassengers.bookingId, bookingId));

  for (const passenger of passengers) {
    const signed = signPayload({
      route: `${booking.originStationId} → ${booking.destinationStationId}`,
      seat: String(passenger.seatNumber),
      passengerName: passenger.fullName,
      bookingRef: booking.reference,
      coach: passenger.coachNumber,
      date: booking.travelDate,
    });

    await db.insert(tickets).values({
      passengerId: passenger.passengerId,
      bookingId: booking.id,
      qrPayload: signed,
    });
  }
}
