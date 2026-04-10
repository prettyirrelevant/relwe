import { NextResponse, NextRequest } from "next/server";
import { sql, eq } from "drizzle-orm";

import { coaches, seats } from "~/db/schema";
import { db } from "~/db";

export async function GET(request: NextRequest) {
  const trainId = request.nextUrl.searchParams.get("trainId");
  const cabinClass = request.nextUrl.searchParams.get("class");

  if (!trainId || !cabinClass) {
    return NextResponse.json(
      { error: "trainId and class are required" },
      { status: 400 },
    );
  }

  const result = await db
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
    .where(eq(coaches.trainId, trainId))
    .orderBy(coaches.coachNumber, seats.seatNumber);

  // group by coach
  const coachMap = new Map<
    string,
    { seats: { seatNumber: number; status: string; id: string; }[]; coachNumber: string; }
  >();

  for (const row of result) {
    if (!coachMap.has(row.coachId)) {
      coachMap.set(row.coachId, { coachNumber: row.coachNumber, seats: [] });
    }
    coachMap.get(row.coachId)!.seats.push({
      seatNumber: row.seatNumber,
      status: row.status,
      id: row.seatId,
    });
  }

  return NextResponse.json({
    coaches: Array.from(coachMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    })),
  });
}
