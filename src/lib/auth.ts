import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

import { db } from "~/db";

export const auth = betterAuth({
  user: {
    additionalFields: {
      ninVerified: {
        defaultValue: false,
        required: false,
        type: "boolean",
        input: false,
      },
      phone: {
        required: false,
        type: "string",
        input: true,
      },
      nin: {
        required: false,
        type: "string",
        input: true,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
