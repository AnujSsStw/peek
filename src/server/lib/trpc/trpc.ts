import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { TRPCContext } from "./types";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = performance.now();

  if (process.env.NODE_ENV === "development") {
    const delayMs = Math.floor(Math.random() * 250) + 100;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const result = await next();
  const end = performance.now();

  console.log(`[tRPC] ${path} took ${Math.round(end - start)}ms`);

  return result;
});

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(enforceUserIsAuthed);
