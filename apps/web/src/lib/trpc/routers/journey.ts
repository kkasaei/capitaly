import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc";
import { prisma as db } from "@repo/database";

export const journeyRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return db.workflow.findMany({
        where: {
          userId: ctx.auth.userId as string,
          ...(input.search ? {
            name: {
              contains: input.search,
              mode: 'insensitive',
            },
          } : {}),
        },
        take: input.limit,
        orderBy: { createdAt: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId as string,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.userId as string,
        },
      });
    }),
}); 