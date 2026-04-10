import {
  mysqlTable,
  timestamp,
  boolean,
  varchar,
  date,
  int,
} from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

import { stations } from "./stations";
import { trains } from "./trains";
import { seats } from "./seats";

export const bookings = mysqlTable("bookings", {
  destinationStationId: varchar("destination_station_id", { length: 32 })
    .notNull()
    .references(() => stations.id),
  originStationId: varchar("origin_station_id", { length: 32 })
    .notNull()
    .references(() => stations.id),
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.booking)),
  paymentStatus: varchar("payment_status", { length: 16 })
    .notNull()
    .default("pending"),
  trainId: varchar("train_id", { length: 32 })
    .notNull()
    .references(() => trains.id),
  paymentTxSignature: varchar("payment_tx_signature", { length: 128 }),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  solanaReference: varchar("solana_reference", { length: 128 }),
  travelDate: date("travel_date", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 64 }).notNull(),
  totalAmountKobo: int("total_amount_kobo").notNull(),
  class: varchar("class", { length: 16 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const bookingPassengers = mysqlTable("booking_passengers", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.bookingPassenger)),
  bookingId: varchar("booking_id", { length: 32 })
    .notNull()
    .references(() => bookings.id),
  seatId: varchar("seat_id", { length: 32 })
    .notNull()
    .references(() => seats.id),
  passengerType: varchar("passenger_type", { length: 8 }).notNull(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  isSelf: boolean("is_self").notNull().default(false),
  nin: varchar("nin", { length: 16 }).notNull(),
});
