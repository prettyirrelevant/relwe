import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";

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
      { error: "Missing required parameters: seatId and sessionId." },
      { status: 400 },
    );
  }

  await db.execute(sql`
    UPDATE ${seats}
    SET status = 'available',
        hold_by = NULL,
        hold_until = NULL
    WHERE id = ${seatId}
      AND hold_by = ${sessionId}
      AND status = 'held'
  `);

  return NextResponse.json({ released: true });
}
