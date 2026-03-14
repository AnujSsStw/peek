import { generateRouter } from "./routers/generate";
import { integrationsRouter } from "./routers/integrations";
import { metaRouter } from "./routers/meta";
import { viewerRouter } from "./routers/viewer";
import { widgetsRouter } from "./routers/widgets";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  generate: generateRouter,
  meta: metaRouter,
  viewer: viewerRouter,
  widgets: widgetsRouter,
  integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;
