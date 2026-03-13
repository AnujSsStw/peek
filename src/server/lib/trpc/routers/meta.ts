import { createTRPCRouter, publicProcedure } from "../trpc";

export const metaRouter = createTRPCRouter({
  health: publicProcedure.query(({ ctx }) => ({
    ok: true,
    authenticated: Boolean(ctx.session?.user),
    serverTime: new Date().toISOString(),
    source: ctx.headers.get("x-trpc-source") ?? "unknown",
  })),
});
