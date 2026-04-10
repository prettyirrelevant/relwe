import { NextResponse, NextRequest } from "next/server";
import { and, eq, lt, or } from "drizzle-orm";
import { headers } from "next/headers";

import { HOLD_DURATION_MS } from "~/lib/constants";
import { seats } from "~/db/schema";
import { auth } from "~/lib/auth";
import { db } from "~/db";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { sessionId, seatId } = (await request.json()) as {
    sessionId: string;
    seatId: string;
  };

  if (!seatId || !sessionId) {
    return NextResponse.json(
      { error: "seatId and sessionId are required" },
      { status: 400 },
    );
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
