import { and, sql, eq } from "drizzle-orm";

import { trainStops, stations, coaches, trains, seats } from "~/db/schema";
import { db } from "~/db";

export interface TrainResult {
  classes: { availableSeats: number; totalSeats: number; class: string; }[];
  destination: { arrivalTime: string; area: string; name: string; };
  origin: { departureTime: string; area: string; name: string; };
  code: string;
  name: string;
  type: string;
  id: string;
}

export async function searchTrains(
  from: string,
  to: string,
): Promise<TrainResult[]> {
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

  if (matchingTrains.length === 0) return [];

  const results = await Promise.all(
    matchingTrains.map(async (train) => {
      // origin stop, destination stop, and availability are all independent
      const [originStop, destStop, availability] = await Promise.all([
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
        db
          .select({
            available: sql<number>`CAST(SUM(CASE WHEN ${seats.status} = 'available' AND (${seats.holdUntil} IS NULL OR ${seats.holdUntil} < NOW()) THEN 1 ELSE 0 END) AS SIGNED)`,
            total: sql<number>`CAST(COUNT(${seats.id}) AS SIGNED)`,
            class: coaches.class,
          })
          .from(coaches)
          .innerJoin(seats, eq(seats.coachId, coaches.id))
          .where(eq(coaches.trainId, train.trainId))
          .groupBy(coaches.class),
      ]);

      if (!originStop[0] || !destStop[0]) return null;

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

  return results.filter((r): r is TrainResult => r !== null);
}
