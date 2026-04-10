import {
  uniqueIndex,
  mysqlTable,
  varchar,
  int,
} from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { stations } from "./stations";

export const pricing = mysqlTable(
  "pricing",
  {
    destinationStationId: varchar("destination_station_id", { length: 32 })
      .notNull()
      .references(() => stations.id),
    originStationId: varchar("origin_station_id", { length: 32 })
      .notNull()
      .references(() => stations.id),
    id: varchar("id", { length: 32 })
      .primaryKey()
      .$defaultFn(() => prefixedId(ID_PREFIXES.pricing)),
    passengerType: varchar("passenger_type", { length: 8 }).notNull(),
    class: varchar("class", { length: 16 }).notNull(),
    amountKobo: int("amount_kobo").notNull(),
  },
  (table) => [
    uniqueIndex("pricing_route_class_type_uniq").on(
      table.originStationId,
      table.destinationStationId,
      table.class,
      table.passengerType,
    ),
  ],
);
