import { mysqlTable, timestamp, varchar, text } from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { bookingPassengers, bookings } from "./bookings";

export const tickets = mysqlTable("tickets", {
  passengerId: varchar("passenger_id", { length: 32 })
    .notNull()
    .references(() => bookingPassengers.id),
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.ticket)),
  bookingId: varchar("booking_id", { length: 32 })
    .notNull()
    .references(() => bookings.id),
  status: varchar("status", { length: 16 }).notNull().default("valid"),
  qrPayload: text("qr_payload").notNull(),
  usedAt: timestamp("used_at"),
});
