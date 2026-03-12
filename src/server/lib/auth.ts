// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { db } from "@/lib/db";
// import * as schema from "@/lib/db/schema";
// import { oAuthProxy } from "better-auth/plugins";
// import { expo } from "@better-auth/expo";
// import { nextCookies } from "better-auth/next-js";

// const deploymentBaseURL =
//   process.env.BETTER_AUTH_URL ??
//   (process.env.VERCEL_ENV === "production"
//     ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//     : process.env.VERCEL_ENV === "preview"
//       ? `https://${process.env.VERCEL_URL}`
//       : undefined);

// const authSecret =
//   process.env.BETTER_AUTH_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;

// const developmentBaseURL = {
//   allowedHosts: [
//     "localhost:3000",
//     "127.0.0.1:3000",
//     "192.168.*.*:3000",
//     "10.*.*.*:3000",
//     "172.*.*.*:3000",
//   ],
//   fallback: "http://localhost:3000",
//   protocol: "http" as const,
// };

// export const auth = betterAuth({
//   baseURL: deploymentBaseURL ?? developmentBaseURL,
//   database: drizzleAdapter(db, {
//     provider: "pg",
//     schema,
//   }),
//   trustedOrigins: [
//     "app://",
//     "app://*",
//     "exp://",
//     "exp://*",
//     "expo://",
//     "expo://*",
//   ],
//   onAPIError: {
//     onError(error, ctx) {
//       console.error("BETTER AUTH API ERROR", error, ctx);
//     },
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       redirectURI: deploymentBaseURL
//         ? `${deploymentBaseURL}/api/auth/callback/google`
//         : "http://localhost:3000/api/auth/callback/google",
//     },
//   },
//   plugins: [
//     oAuthProxy(
//       deploymentBaseURL
//         ? {
//             productionURL: deploymentBaseURL,
//           }
//         : undefined,
//     ),
//     expo(),
//     nextCookies(),
//   ],
//   secret: authSecret,
//   advanced: {
//     cookies: {
//       state: {
//         attributes: {
//           sameSite: "none",
//           secure: true,
//         },
//       },
//     },
//   },
// });

import { expo } from "@better-auth/expo";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
        currentURL: "app://",
      }),
      expo(),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/google`,
      },
    },
    trustedOrigins: [
      "app://",
      "exp://",
      "https://*.exp.direct",
      "http://localhost:*",
      options.productionUrl,
      options.baseUrl,
    ],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
    advanced: {
      cookies: {
        state: {
          attributes: {
            sameSite: "none",
            secure: true,
          },
        },
      },
    },
    account: {
      skipStateCookieCheck: true,
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

const baseUrl =
  process.env.VERCEL_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "peek-snowy.vercel.app"}`,
  secret: process.env.BETTER_AUTH_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
