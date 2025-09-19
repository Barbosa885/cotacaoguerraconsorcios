import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const listingRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const listings = await ctx.db.vehicleListing.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        seller: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return listings;
  }),

  create: protectedProcedure
    .input(
      z.object({
        modelName: z.string(),
        brandName: z.string(),
        year: z.string(),
        fuelType: z.string(),
        fipeCode: z.string(),
        price: z.number(),
        mileage: z.string(),
        condition: z.string(),
        description: z.string().optional(),
        optionals: z.record(z.boolean()), // objeto JSON
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newListing = await ctx.db.vehicleListing.create({
        data: {
          ...input,
          sellerId: ctx.session.user.id,
        },
      });
      return newListing;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const listing = await ctx.db.vehicleListing.findUnique({
        where: { id: input.id },
        include: {
          seller: true,
        },
      });
      return listing;
    }),
});
