import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { createCallerFactory } from "./trpc";
import { appRouter } from "./root";
import { auth } from "@/lib/auth";

const createCaller = createCallerFactory(appRouter);

export const createServerCaller = cache(async () => {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  return createCaller({
    headers: reqHeaders,
    session: session
      ? {
          user: {
            id: session.user.id,
            name: session.user.name ?? "",
            email: session.user.email,
            image: session.user.image ?? undefined,
          },
        }
      : null,
  });
});
