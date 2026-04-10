import { NextResponse, NextRequest } from "next/server";
import { and, sql, eq } from "drizzle-orm";

import { trainStops, stations, coaches, trains, seats } from "~/db/schema";
import { db } from "~/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (!from || !to || !date) {
    return NextResponse.json(
      { error: "from, to, and date are required" },
      { status: 400 },
    );
  }

  // find trains that stop at both origin and destination stations
  // where origin comes before destination in sequence
  const matchingTrains = await db
    .select({
      trainDirection: trains.direction,
      trainCode: trains.code,
      trainName: trains.name,
      trainType: trains.type,
      trainId: trains.id,
    })
    .from(trains)
    .where(
      sql`EXISTS (
        SELECT 1 FROM ${trainStops} ts1
        JOIN ${trainStops} ts2 ON ts1.train_id = ts2.train_id
        WHERE ts1.train_id = ${trains.id}
          AND ts1.station_id = ${from}
          AND ts2.station_id = ${to}
          AND ts1.sequence < ts2.sequence
      )`,
    );

  if (matchingTrains.length === 0) {
    return NextResponse.json({ trains: [] });
  }

  // get stops and availability for each matching train
  const result = await Promise.all(
    matchingTrains.map(async (train) => {
      // get origin and destination stops for this train
      const [originStop, destStop] = await Promise.all([
        db
          .select({
            departureTime: trainStops.departureTime,
            stationArea: stations.area,
            stationName: stations.name,
          })
          .from(trainStops)
          .innerJoin(stations, eq(stations.id, trainStops.stationId))
          .where(
            and(
              eq(trainStops.trainId, train.trainId),
              eq(trainStops.stationId, from),
            ),
          )
          .limit(1),
        db
          .select({
            arrivalTime: trainStops.arrivalTime,
            stationArea: stations.area,
            stationName: stations.name,
          })
          .from(trainStops)
          .innerJoin(stations, eq(stations.id, trainStops.stationId))
          .where(
            and(
              eq(trainStops.trainId, train.trainId),
              eq(trainStops.stationId, to),
            ),
          )
          .limit(1),
      ]);

      if (!originStop[0] || !destStop[0]) return null;

      // get seat availability per class
      const availability = await db
        .select({
          available: sql<number>`count(case when ${seats.status} = 'available' and (${seats.holdUntil} is null or ${seats.holdUntil} < now()) then 1 end)::int`,
          total: sql<number>`count(${seats.id})::int`,
          class: coaches.class,
        })
        .from(coaches)
        .innerJoin(seats, eq(seats.coachId, coaches.id))
        .where(eq(coaches.trainId, train.trainId))
        .groupBy(coaches.class);

      return {
        origin: {
          departureTime: originStop[0].departureTime,
          area: originStop[0].stationArea,
          name: originStop[0].stationName,
        },
        destination: {
          arrivalTime: destStop[0].arrivalTime,
          area: destStop[0].stationArea,
          name: destStop[0].stationName,
        },
        classes: availability.map((a) => ({
          availableSeats: a.available,
          totalSeats: a.total,
          class: a.class,
        })),
        code: train.trainCode,
        name: train.trainName,
        type: train.trainType,
        id: train.trainId,
      };
    }),
  );

  return NextResponse.json({
    trains: result.filter(Boolean),
  });
}
