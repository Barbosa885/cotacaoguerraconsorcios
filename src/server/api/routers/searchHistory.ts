import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const searchHistoryRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const history = await ctx.db.searchHistory.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3, // Limit to the last 3 searches
    });

    return history;
  }),

  add: protectedProcedure
    .input(
      z.object({
        vehicleType: z.string(),
        brandName: z.string(),
        modelName: z.string(),
        year: z.string(),
        price: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { vehicleType, brandName, modelName, year, price } = input;

      const newHistoryEntry = await ctx.db.searchHistory.create({
        data: {
          userId: ctx.session.user.id,
          vehicleType,
          brandName,
          modelName,
          year,
          price,
        },
      });

      return newHistoryEntry;
    }),
});
