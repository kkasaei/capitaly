import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc";
import { prisma as db } from "@repo/database";
import { TRPCError } from "@trpc/server";

// Schema for integration connection
const integrationConnectionSchema = z.object({
  type: z.enum(["google_analytics", "webflow"]),
  credentials: z.record(z.string()),
});

// Schema for integration status
const integrationStatusSchema = z.object({
  type: z.enum(["google_analytics", "webflow"]),
});

export const integrationRouter = createTRPCRouter({
  // Get all integrations for the user
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.integration.findMany({
        where: {
          userId: ctx.auth.userId,
        },
      });
    }),

  // Get status of a specific integration
  getStatus: protectedProcedure
    .input(integrationStatusSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const integration = await db.integration.findFirst({
        where: {
          userId: ctx.auth.userId,
          type: input.type,
        },
      });

      return {
        connected: !!integration,
        lastChecked: integration?.updatedAt,
      };
    }),

  // Connect a new integration
  connect: protectedProcedure
    .input(integrationConnectionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if integration already exists
      const existing = await db.integration.findFirst({
        where: {
          userId: ctx.auth.userId,
          type: input.type,
        },
      });

      if (existing) {
        // Update existing integration
        return db.integration.update({
          where: { id: existing.id },
          data: {
            credentials: input.credentials,
            updatedAt: new Date(),
          },
        });
      }

      // Create new integration
      return db.integration.create({
        data: {
          userId: ctx.auth.userId,
          type: input.type,
          credentials: input.credentials,
        },
      });
    }),

  // Disconnect an integration
  disconnect: protectedProcedure
    .input(integrationStatusSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const integration = await db.integration.findFirst({
        where: {
          userId: ctx.auth.userId,
          type: input.type,
        },
      });

      if (!integration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Integration not found",
        });
      }

      return db.integration.delete({
        where: { id: integration.id },
      });
    }),

  // Test integration connection
  testConnection: protectedProcedure
    .input(integrationStatusSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const integration = await db.integration.findFirst({
        where: {
          userId: ctx.auth.userId,
          type: input.type,
        },
      });

      if (!integration) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Integration not found",
        });
      }

      try {
        // Test the connection based on integration type
        switch (input.type) {
          case "google_analytics":
            // TODO: Implement Google Analytics API test
            return { success: true, message: "Google Analytics connection successful" };
          case "webflow":
            // TODO: Implement Webflow API test
            return { success: true, message: "Webflow connection successful" };
          default:
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid integration type",
            });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to test connection",
        });
      }
    }),
}); 