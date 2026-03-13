import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { auth } from "@/lib/auth";
import type { TRPCContext } from "./types";

export async function createTRPCContext({
  req,
}: Pick<FetchCreateContextFnOptions, "req">): Promise<TRPCContext> {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    headers: req.headers,
    session: session
      ? {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? null,
          },
        }
      : null,
  };
}
