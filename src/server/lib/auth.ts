import { expo } from "@better-auth/expo";
import { TodoistApi } from "@doist/todoist-api-typescript";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { oAuthProxy } from "better-auth/plugins/oauth-proxy";

import { db } from "@/lib/db";
import { syncGoogleCalendarLists } from "@/lib/google-cal";
import { syncTodoistTaskLists } from "@/lib/todoist-task";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

const TODOIST_READ_SCOPE = "data:read";

async function syncLinkedAccountSources(userId: string, providerId: string) {
  if (providerId === "google") {
    await syncGoogleCalendarLists(userId);
    return;
  }

  if (providerId === "todoist") {
    await syncTodoistTaskLists(userId);
  }
}

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId: string;
  googleClientSecret: string;
  todoistClientId: string;
  todoistClientSecret: string;
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
      }),
      expo(),
      genericOAuth({
        config: [
          {
            providerId: "todoist",
            authorizationUrl: "https://todoist.com/oauth/authorize",
            tokenUrl: "https://todoist.com/oauth/access_token",
            clientId: options.todoistClientId,
            clientSecret: options.todoistClientSecret,
            scopes: [TODOIST_READ_SCOPE],
            // Todoist expects scopes as a comma-separated string.
            authorizationUrlParams: {
              scope: TODOIST_READ_SCOPE,
            },
            getUserInfo: async (tokens) => {
              if (!tokens.accessToken) {
                throw new Error("Todoist access token is missing");
              }

              const todoistApi = new TodoistApi(tokens.accessToken);
              const user = await todoistApi.getUser();

              return {
                id: user.id,
                email: user.email,
                name: user.fullName,
                image:
                  user.avatarMedium ??
                  user.avatarBig ??
                  user.avatarSmall ??
                  undefined,
                emailVerified: true,
              };
            },
          },
        ],
      }),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      google: {
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.baseUrl}/api/auth/callback/google`,
        accessType: "offline",
        prompt: "consent",
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
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
    account: {
      skipStateCookieCheck: true,
      accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
      },
    },
    databaseHooks: {
      account: {
        create: {
          after: async (account) => {
            await syncLinkedAccountSources(account.userId, account.providerId);
          },
        },
        update: {
          after: async (account) => {
            await syncLinkedAccountSources(account.userId, account.providerId);
          },
        },
      },
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
  todoistClientId: process.env.TODOIST_CLIENT_ID!,
  todoistClientSecret: process.env.TODOIST_CLIENT_SECRET!,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
