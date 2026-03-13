import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import React from "react";
import { Platform } from "react-native";
import superjson from "superjson";

import { authClient } from "@/utils/auth";
import { getBaseUrl } from "@/utils/base-url";
import type { AppRouter } from "../../../server/lib/trpc/root";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (Platform.OS === "web") {
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }

  return makeQueryClient();
}

function getTrpcUrl() {
  return `${getBaseUrl()}/api/trpc`;
}

export function TRPCReactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(() => getQueryClient());
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            __DEV__ ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: getTrpcUrl(),
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", Platform.OS);

            const cookieStore = authClient as typeof authClient & {
              getCookie?: () => string | undefined;
            };

            if (Platform.OS !== "web") {
              const cookies = cookieStore.getCookie?.();

              if (cookies) {
                headers.set("Cookie", cookies);
              }
            }

            return headers;
          },
          fetch(url: RequestInfo | URL, options?: RequestInit) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
