import { createRouter, publicQuery } from "./middleware";
import { leadRouter } from "./leadRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  lead: leadRouter,
});

export type AppRouter = typeof appRouter;
