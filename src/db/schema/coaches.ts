import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { trains } from "./trains";

export const coaches = mysqlTable("coaches", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.coach)),
  trainId: varchar("train_id", { length: 32 })
    .notNull()
    .references(() => trains.id),
  coachNumber: varchar("coach_number", { length: 8 }).notNull(),
  class: varchar("class", { length: 16 }).notNull(),
  totalSeats: int("total_seats").notNull(),
});
