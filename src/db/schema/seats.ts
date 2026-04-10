import {
  uniqueIndex,
  mysqlTable,
  timestamp,
  varchar,
  index,
  int,
} from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { coaches } from "./coaches";

export const seats = mysqlTable(
  "seats",
  {
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => prefixedId(ID_PREFIXES.seat)),
    coachId: varchar("coach_id", { length: 32 })
      .notNull()
      .references(() => coaches.id),
    status: varchar("status", { length: 16 }).notNull().default("available"),
    bookingId: varchar("booking_id", { length: 32 }),
    holdBy: varchar("hold_by", { length: 128 }),
    seatNumber: int("seat_number").notNull(),
    holdUntil: timestamp("hold_until"),
  },
  (table) => [
    uniqueIndex("seats_coach_seat_uniq").on(table.coachId, table.seatNumber),
    index("seats_coach_status_idx").on(table.coachId, table.status),
  ],
);
