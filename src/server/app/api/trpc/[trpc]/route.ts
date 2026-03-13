import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "@/lib/trpc/context";
import { appRouter } from "@/lib/trpc/root";

const allowedHeaders = "content-type, x-trpc-source";

function createCorsHeaders(origin: string | null) {
  const headers = new Headers();

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", allowedHeaders);
  headers.set("Vary", "Origin");

  return headers;
}

function handler(req: Request) {
  const corsHeaders = createCorsHeaders(req.headers.get("origin"));

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError({ error, path }) {
      console.error(
        `[tRPC] ${path ?? "<no-path>"} failed: ${error.message}`,
        error,
      );
    },
    responseMeta() {
      return {
        headers: corsHeaders,
      };
    },
  });
}

export const GET = handler;
export const POST = handler;

export function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: createCorsHeaders(req.headers.get("origin")),
  });
}
