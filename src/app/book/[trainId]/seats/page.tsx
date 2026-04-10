import { and, sql, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { trainStops, stations, coaches, trains, seats } from "~/db/schema";
import { ProgressBar } from "~/components/booking/progress-bar";
import { Header } from "~/components/layout/header";
import { formatTime } from "~/lib/format";
import { db } from "~/db";

import { SeatSelector } from "./_components/seat-selector";

export default async function SeatsPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ passengers?: string; class?: string; date?: string; from?: string; to?: string; }>;
  params: Promise<{ trainId: string }>;
}) {
  const { trainId } = await params;
  const { passengers: paxStr, class: cabinClass, date, from, to } = await searchParams;

  const passengers = parseInt(paxStr ?? "1", 10);

  if (!from || !to || !date || !cabinClass) {
    notFound();
  }

  // train, route stops, and seat data are all independent — fetch in parallel
  const [[train], [originStop], [destStop], coachesWithSeats] =
    await Promise.all([
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
          status: sql<string>`
            CASE
              WHEN ${seats.status} = 'held' AND ${seats.holdUntil} < NOW() THEN 'available'
              ELSE ${seats.status}
            END
          `,
          coachNumber: coaches.coachNumber,
          seatNumber: seats.seatNumber,
          coachId: coaches.id,
          seatId: seats.id,
        })
        .from(coaches)
        .innerJoin(seats, eq(seats.coachId, coaches.id))
        .where(and(eq(coaches.trainId, trainId), eq(coaches.class, cabinClass)))
        .orderBy(coaches.coachNumber, seats.seatNumber),
    ]);

  if (!train || !originStop || !destStop) notFound();

  // group into coaches
  const coachMap = new Map<
    string,
    { seats: { seatNumber: number; status: string; id: string; }[]; coachNumber: string; }
  >();

  for (const row of coachesWithSeats) {
    if (!coachMap.has(row.coachId)) {
      coachMap.set(row.coachId, { coachNumber: row.coachNumber, seats: [] });
    }
    coachMap.get(row.coachId)!.seats.push({
      seatNumber: row.seatNumber,
      status: row.status,
      id: row.seatId,
    });
  }

  const coachList = Array.from(coachMap.entries()).map(([id, data]) => ({
    id,
    ...data,
  }));

  const searchParamsString = new URLSearchParams({
    passengers: String(passengers),
    class: cabinClass,
    date,
    from,
    to,
  }).toString();

  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <ProgressBar currentStep={1} />

          <div className="mt-6 mb-8">
            <h1 className="font-heading text-[32px] text-primary">
              Pick your seats
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

          <SeatSelector
            searchParams={searchParamsString}
            maxSelectable={passengers}
            cabinClass={cabinClass}
            coaches={coachList}
            trainId={trainId}
          />
        </div>
      </main>
    </>
  );
}
