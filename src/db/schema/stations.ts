import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

import { ID_PREFIXES, prefixedId } from "~/lib/id";

export const stations = mysqlTable("stations", {
  id: varchar("id", { length: 32 })
    .primaryKey()
    .$defaultFn(() => prefixedId(ID_PREFIXES.station)),
  code: varchar("code", { length: 8 }).notNull().unique(),
  area: varchar("area", { length: 128 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  position: int("position").notNull(),
});
