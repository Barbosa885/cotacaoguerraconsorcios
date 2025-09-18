import { listingRouter } from "~/server/api/routers/listing";
import { searchHistoryRouter } from "~/server/api/routers/searchHistory";
import { fipeRouter } from "~/server/api/routers/fipe";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  fipe: fipeRouter,
  searchHistory: searchHistoryRouter,
  listing: listingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
