import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { oAuthProxy } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { nextCookies } from "better-auth/next-js";

const deploymentBaseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : undefined);

const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;

const developmentBaseURL = {
  allowedHosts: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.*.*:3000",
    "10.*.*.*:3000",
    "172.*.*.*:3000",
  ],
  fallback: "http://localhost:3000",
  protocol: "http" as const,
};

export const auth = betterAuth({
  baseURL: deploymentBaseURL ?? developmentBaseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [
    "app://",
    "app://*",
    "exp://",
    "exp://*",
    "expo://",
    "expo://*",
  ],
  onAPIError: {
    onError(error, ctx) {
      console.error("BETTER AUTH API ERROR", error, ctx);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    oAuthProxy(
      deploymentBaseURL
        ? {
            productionURL: deploymentBaseURL,
          }
        : undefined,
    ),
    expo(),
    nextCookies(),
  ],
  secret: authSecret,
});
