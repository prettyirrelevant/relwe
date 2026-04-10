import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { verifyPayload } from "~/lib/tickets";
import { tickets } from "~/db/schema";
import { db } from "~/db";

export async function GET(request: NextRequest) {
  const data = request.nextUrl.searchParams.get("data");

  if (!data) {
    return NextResponse.json({ error: "Missing data parameter", valid: false }, { status: 400 });
  }

  const result = verifyPayload(data);

  if (!result.valid) {
    return NextResponse.json({ error: "Invalid ticket signature", valid: false });
  }

  // find the ticket in DB
  const [ticket] = await db
    .select()
    .from(tickets)
    .where(eq(tickets.qrPayload, data))
    .limit(1);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found", valid: false });
  }

  if (ticket.status === "used") {
    return NextResponse.json({
      error: "Ticket already used",
      passenger: result.payload,
      usedAt: ticket.usedAt,
      valid: false,
    });
  }

  if (ticket.status === "cancelled") {
    return NextResponse.json({ error: "Ticket cancelled", valid: false });
  }

  // mark as used
  await db
    .update(tickets)
    .set({ usedAt: new Date(), status: "used" })
    .where(eq(tickets.id, ticket.id));

  return NextResponse.json({
    passenger: result.payload,
    valid: true,
  });
}
