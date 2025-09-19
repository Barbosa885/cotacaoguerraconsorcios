import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

  // Novo procedimento para listar os anúncios do usuário autenticado
  listMyListings: protectedProcedure.query(async ({ ctx }) => {
    const listings = await ctx.db.vehicleListing.findMany({
      where: {
        sellerId: ctx.session.user.id,
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

  // Novo procedimento para atualizar um anúncio existente
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        modelName: z.string().optional(),
        brandName: z.string().optional(),
        year: z.string().optional(),
        fuelType: z.string().optional(),
        fipeCode: z.string().optional(),
        price: z.number().optional(),
        mileage: z.string().optional(),
        condition: z.string().optional(),
        description: z.string().optional(),
        optionals: z.record(z.boolean()).optional(),
        status: z.enum(["ACTIVE", "SOLD", "REMOVED"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const listing = await ctx.db.vehicleListing.findUnique({
        where: { id },
      });

      if (!listing || listing.sellerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Você não tem permissão para editar este anúncio.",
        });
      }

      const updatedListing = await ctx.db.vehicleListing.update({
        where: { id },
        data,
      });
      return updatedListing;
    }),

  // Novo procedimento para deletar um anúncio
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const listing = await ctx.db.vehicleListing.findUnique({
        where: { id },
      });

      if (!listing || listing.sellerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Você não tem permissão para deletar este anúncio.",
        });
      }

      await ctx.db.vehicleListing.delete({
        where: { id },
      });

      return { message: "Anúncio deletado com sucesso." };
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
