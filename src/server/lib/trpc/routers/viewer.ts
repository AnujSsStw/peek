import { createTRPCRouter, protectedProcedure } from "../trpc";

export const viewerRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => ({
    id: ctx.session.user.id,
    name: ctx.session.user.name,
    email: ctx.session.user.email,
    image: ctx.session.user.image ?? null,
  })),
});
