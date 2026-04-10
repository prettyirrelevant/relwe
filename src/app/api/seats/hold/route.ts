import { NextResponse, NextRequest } from "next/server";
import { and, eq, lt, or } from "drizzle-orm";
import { headers } from "next/headers";

import { validateBookable } from "~/lib/train-availability";
import { HOLD_DURATION_MS } from "~/lib/constants";
import { seats } from "~/db/schema";
import { auth } from "~/lib/auth";
import { db } from "~/db";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fromStationId, travelDate, sessionId, trainId, seatId } =
    (await request.json()) as {
      fromStationId: string;
      travelDate: string;
      sessionId: string;
      trainId: string;
      seatId: string;
    };

  if (!seatId || !sessionId || !trainId || !fromStationId || !travelDate) {
    return NextResponse.json(
      {
        error:
          "Missing required parameters: seatId, sessionId, trainId, fromStationId, and travelDate.",
      },
      { status: 400 },
    );
  }

  const validationError = await validateBookable({
    fromStationId,
    travelDate,
    trainId,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const holdUntil = new Date(Date.now() + HOLD_DURATION_MS);
  const now = new Date();

  // atomic hold: only update if available or hold expired
  const result = await db
    .update(seats)
    .set({
      holdBy: sessionId,
      status: "held",
      holdUntil,
    })
    .where(
      and(
        eq(seats.id, seatId),
        or(
          eq(seats.status, "available"),
          and(eq(seats.status, "held"), lt(seats.holdUntil, now)),
        ),
      ),
    );

  if ((result.rowsAffected ?? 0) === 0) {
    return NextResponse.json(
      { error: "Seat is no longer available" },
      { status: 409 },
    );
  }

  return NextResponse.json({
    holdUntil: holdUntil.toISOString(),
    held: true,
    seatId,
  });
}
