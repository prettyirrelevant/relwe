import { mysqlTable, varchar, float, time, int } from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { stations } from "./stations";

export const trains = mysqlTable("trains", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.train)),
  direction: varchar("direction", { length: 32 }).notNull(),
  code: varchar("code", { length: 16 }).notNull().unique(),
  // bitmask of days the train runs on
  // bit 0 = Sunday, bit 1 = Monday, ..., bit 6 = Saturday
  // 127 = daily, 62 = weekdays (Mon-Fri), 65 = weekends (Sat+Sun)
  runsOnDays: int("runs_on_days").notNull().default(127),
  name: varchar("name", { length: 128 }).notNull(),
  type: varchar("type", { length: 16 }).notNull(),
});

export const trainStops = mysqlTable("train_stops", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.trainStop)),
  stationId: varchar("station_id", { length: 32 })
    .notNull()
    .references(() => stations.id),
  trainId: varchar("train_id", { length: 32 })
    .notNull()
    .references(() => trains.id),
  departureTime: time("departure_time", { fsp: 0 }).notNull(),
  arrivalTime: time("arrival_time", { fsp: 0 }).notNull(),
  distanceKm: float("distance_km").notNull(),
  sequence: int("sequence").notNull(),
});
