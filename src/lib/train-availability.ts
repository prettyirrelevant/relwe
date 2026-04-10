import { and, eq } from "drizzle-orm";

import { trainStops, coaches, trains, seats } from "~/db/schema";
import { db } from "~/db";

import { dayBitForDate } from "./constants";

interface TrainContext {
  fromStationId: string;
  travelDate: string;
  trainId: string;
}

/**
 * Check whether a train can still be booked for a given travel date.
 * Validates:
 * - the date isn't in the past
 * - the train runs on that day-of-week
 * - if the date is today, the departure from the origin station hasn't passed
 *
 * Returns null on success, or an error string on failure.
 */
export async function validateBookable({
  fromStationId,
  travelDate,
  trainId,
}: TrainContext): Promise<string | null> {
  const today = new Date().toISOString().split("T")[0];
  if (travelDate < today) {
    return "Travel date is in the past.";
  }

  const [train] = await db
    .select({ runsOnDays: trains.runsOnDays })
    .from(trains)
    .where(eq(trains.id, trainId))
    .limit(1);

  if (!train) {
    return "Train not found.";
  }

  const dayBit = dayBitForDate(new Date(travelDate));
  if ((train.runsOnDays & dayBit) === 0) {
    return "Train does not run on this day.";
  }

  if (travelDate === today) {
    const [stop] = await db
      .select({ departureTime: trainStops.departureTime })
      .from(trainStops)
      .where(
        and(
          eq(trainStops.trainId, trainId),
          eq(trainStops.stationId, fromStationId),
        ),
      )
      .limit(1);

    if (!stop) {
      return "Train doesn't stop at the origin station.";
    }

    const nowHHMM = new Date().toTimeString().slice(0, 5);
    if (stop.departureTime.slice(0, 5) <= nowHHMM) {
      return "Train has already departed.";
    }
  }

  return null;
}

/**
 * Look up the trainId for a seat by joining through coaches.
 */
export async function getSeatTrainId(
  seatId: string,
): Promise<string | null> {
  const [row] = await db
    .select({ trainId: coaches.trainId })
    .from(seats)
    .innerJoin(coaches, eq(coaches.id, seats.coachId))
    .where(eq(seats.id, seatId))
    .limit(1);

  return row?.trainId ?? null;
}
