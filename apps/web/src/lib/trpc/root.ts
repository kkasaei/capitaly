import { createCallerFactory, createTRPCRouter } from "@/lib/trpc";
import { agentRouter } from "@/lib/trpc/routers/agent";
import { workflowRouter } from "@/lib/trpc/routers/workflow";
import { journeyRouter } from "@/lib/trpc/routers/journey";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  agent: agentRouter,
  workflow: workflowRouter,
  journey: journeyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
