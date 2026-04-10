import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "mysql",
});
