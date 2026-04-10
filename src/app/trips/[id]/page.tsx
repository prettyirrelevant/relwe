import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import {
  bookingPassengers,
  bookings,
  stations,
  coaches,
  tickets,
  trains,
  seats,
} from "~/db/schema";
import { CABIN_CLASS_DISPLAY, type CabinClass } from "~/lib/constants";
import { PrintButton } from "~/components/booking/print-button";
import { TicketCard } from "~/components/booking/ticket-card";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { generateQRCode } from "~/lib/tickets";
import { Badge } from "~/components/ui/badge";
import { auth } from "~/lib/auth";
import { db } from "~/db";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/trips");

  const { id } = await params;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, session.user.id)))
    .limit(1);

  if (!booking) notFound();

  // fetch all related data in parallel - no dependencies between these
  const [[train], [origin], [destination], passengers, ticketList] =
    await Promise.all([
      db
        .select()
        .from(trains)
        .where(eq(trains.id, booking.trainId))
        .limit(1),
      db
        .select({ area: stations.area, name: stations.name })
        .from(stations)
        .where(eq(stations.id, booking.originStationId))
        .limit(1),
      db
        .select({ area: stations.area, name: stations.name })
        .from(stations)
        .where(eq(stations.id, booking.destinationStationId))
        .limit(1),
      db
        .select({
          passengerType: bookingPassengers.passengerType,
          fullName: bookingPassengers.fullName,
          passengerId: bookingPassengers.id,
          coachNumber: coaches.coachNumber,
          seatNumber: seats.seatNumber,
        })
        .from(bookingPassengers)
        .innerJoin(seats, eq(seats.id, bookingPassengers.seatId))
        .innerJoin(coaches, eq(coaches.id, seats.coachId))
        .where(eq(bookingPassengers.bookingId, id)),
      db.select().from(tickets).where(eq(tickets.bookingId, id)),
    ]);

  // generate QR codes for each passenger's ticket
  const passengerTickets = await Promise.all(
    passengers.map(async (p) => {
      const ticket = ticketList.find((t) => t.passengerId === p.passengerId);
      const qrDataUrl = ticket ? await generateQRCode(ticket.qrPayload) : "";
      return { ...p, qrDataUrl };
    }),
  );

  const statusVariant =
    booking.paymentStatus === "confirmed"
      ? ("success" as const)
      : booking.paymentStatus === "pending"
        ? ("warning" as const)
        : ("error" as const);

  const formattedDate = new Date(booking.travelDate).toLocaleDateString(
    "en-NG",
    { weekday: "long", year: "numeric", day: "numeric", month: "long" },
  );

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
          {/* header */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted uppercase tracking-wider">
              Booking reference
            </p>
            <Badge variant={statusVariant}>{booking.paymentStatus}</Badge>
          </div>
          <h1 className="font-heading text-3xl text-primary mb-10">
            {booking.reference}
          </h1>

          {/* trip summary */}
          <section className="border border-border rounded-2xl p-8 bg-surface-raised mb-8">
            <h2 className="text-xs text-muted uppercase tracking-wider mb-5">
              Trip details
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Train
                </p>
                <p className="text-text font-medium">{train?.name ?? ""}</p>
                <p className="text-xs text-muted mt-0.5">{train?.code ?? ""}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Class
                </p>
                <p className="text-text font-medium">
                  {CABIN_CLASS_DISPLAY[booking.class as CabinClass]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Route
                </p>
                <p className="text-text font-medium">
                  {origin?.area} → {destination?.area}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-text font-medium">{formattedDate}</p>
              </div>
            </div>
            <div className="border-t border-border mt-6 pt-5 flex items-center justify-between">
              <span className="text-muted text-sm">Total paid</span>
              <span className="font-heading text-xl text-primary">
                ₦{(booking.totalAmountKobo / 100).toLocaleString("en-NG")}
              </span>
            </div>
          </section>

          {/* tickets */}
          {booking.paymentStatus === "confirmed" && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xs text-muted uppercase tracking-wider">
                    Your tickets
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Show the QR code at the station
                  </p>
                </div>
                <PrintButton />
              </div>
              <div className="flex flex-col gap-4">
                {passengerTickets.map((p) => (
                  <TicketCard
                    passengerType={p.passengerType}
                    bookingRef={booking.reference}
                    coachNumber={p.coachNumber}
                    seatNumber={p.seatNumber}
                    qrDataUrl={p.qrDataUrl}
                    fullName={p.fullName}
                    key={p.passengerId}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
