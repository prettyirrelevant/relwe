import { mysqlTable, timestamp, boolean, varchar, text } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  emailVerified: boolean("email_verified").notNull().default(false),
  ninVerified: boolean("nin_verified").notNull().default(false),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  id: varchar("id", { length: 64 }).primaryKey(),
  phone: varchar("phone", { length: 32 }),
  nin: varchar("nin", { length: 16 }),
  name: text("name").notNull(),
  image: text("image"),
});

export const session = mysqlTable("session", {
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  id: varchar("id", { length: 64 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const account = mysqlTable("account", {
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => user.id),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  id: varchar("id", { length: 64 }).primaryKey(),
  providerId: text("provider_id").notNull(),
  accountId: text("account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  password: text("password"),
  idToken: text("id_token"),
  scope: text("scope"),
});

export const verification = mysqlTable("verification", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  id: varchar("id", { length: 64 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
});
