import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { trainStops, stations, coaches, pricing, trains, seats } from "~/db/schema";
import { ProgressBar } from "~/components/booking/progress-bar";
import { Header } from "~/components/layout/header";
import { formatTime } from "~/lib/format";
import { auth } from "~/lib/auth";
import { db } from "~/db";

import { CheckoutView } from "./_components/checkout-view";

export default async function CheckoutPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    passengers?: string;
    class?: string;
    seats?: string;
    date?: string;
    from?: string;
    to?: string;
  }>;
  params: Promise<{ trainId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/");

  const { trainId } = await params;
  const sp = await searchParams;
  const { seats: seatIdsParam, class: cabinClass, date, from, to } = sp;

  if (!from || !to || !date || !cabinClass || !seatIdsParam) notFound();

  const seatIds = seatIdsParam.split(",");

  // all six queries are independent — fetch in parallel
  const [
    [train],
    [originStop],
    [destStop],
    selectedSeats,
    [price],
    [minorPrice],
  ] = await Promise.all([
    db.select().from(trains).where(eq(trains.id, trainId)).limit(1),
    db
      .select({
        departureTime: trainStops.departureTime,
        stationArea: stations.area,
        stationName: stations.name,
      })
      .from(trainStops)
      .innerJoin(stations, eq(stations.id, trainStops.stationId))
      .where(and(eq(trainStops.trainId, trainId), eq(trainStops.stationId, from)))
      .limit(1),
    db
      .select({
        arrivalTime: trainStops.arrivalTime,
        stationArea: stations.area,
        stationName: stations.name,
      })
      .from(trainStops)
      .innerJoin(stations, eq(stations.id, trainStops.stationId))
      .where(and(eq(trainStops.trainId, trainId), eq(trainStops.stationId, to)))
      .limit(1),
    db
      .select({
        coachNumber: coaches.coachNumber,
        seatNumber: seats.seatNumber,
        seatId: seats.id,
      })
      .from(seats)
      .innerJoin(coaches, eq(coaches.id, seats.coachId))
      .where(and(eq(coaches.trainId, trainId), eq(coaches.class, cabinClass))),
    db
      .select()
      .from(pricing)
      .where(
        and(
          eq(pricing.originStationId, from),
          eq(pricing.destinationStationId, to),
          eq(pricing.class, cabinClass),
          eq(pricing.passengerType, "adult"),
        ),
      )
      .limit(1),
    db
      .select()
      .from(pricing)
      .where(
        and(
          eq(pricing.originStationId, from),
          eq(pricing.destinationStationId, to),
          eq(pricing.class, cabinClass),
          eq(pricing.passengerType, "minor"),
        ),
      )
      .limit(1),
  ]);

  if (!train || !originStop || !destStop) notFound();

  const filteredSeats = selectedSeats.filter((s) => seatIds.includes(s.seatId));
  const pricePerAdultKobo = price?.amountKobo ?? 0;
  const pricePerMinorKobo = minorPrice?.amountKobo ?? pricePerAdultKobo;

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
          <ProgressBar currentStep={2} />

          <div className="mt-6 mb-8">
            <h1 className="font-heading text-[32px] text-primary">
              Book & pay
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-text-secondary">
                {originStop.stationArea} → {destStop.stationArea}
              </span>
              <span className="text-muted">·</span>
              <span className="text-muted text-sm">{train.code}</span>
              <span className="text-muted">·</span>
              <span className="text-text-secondary tabular-nums">
                {formatTime(originStop.departureTime)} — {formatTime(destStop.arrivalTime)}
              </span>
              <span className="text-muted">·</span>
              <span className="text-text-secondary">
                {new Date(date).toLocaleDateString("en-NG", { weekday: "short", year: "numeric", day: "numeric", month: "short" })}
              </span>
            </div>
          </div>

          <CheckoutView
            user={{
              phone: (session.user as Record<string, unknown>).phone as string ?? "",
              nin: (session.user as Record<string, unknown>).nin as string ?? "",
              name: session.user.name,
            }}
            pricePerAdultKobo={pricePerAdultKobo}
            pricePerMinorKobo={pricePerMinorKobo}
            destinationStationId={to}
            cabinClass={cabinClass}
            originStationId={from}
            seats={filteredSeats}
            trainId={trainId}
            travelDate={date}
          />
        </div>
      </main>
    </>
  );
}
