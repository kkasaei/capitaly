import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc";
import { prisma as db } from "@repo/database";
import { TRPCError } from "@trpc/server";

// Schema for workflow creation/updates
const workflowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  schedule: z.string().optional(),
  config: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  steps: z.array(z.object({
    agentId: z.string(),
    order: z.number(),
    config: z.record(z.any()).optional()
  })).optional(),
});

export const workflowRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.workflow.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        orderBy: { createdAt: "desc" },
        include: {
          steps: true,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        include: {
          steps: {
            orderBy: { order: "asc" },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(workflowSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const { steps, ...workflowData } = input;

      // First create the workflow
      const workflow = await db.workflow.create({
        data: {
          name: workflowData.name,
          description: workflowData.description,
          schedule: workflowData.schedule,
          isActive: workflowData.isActive,
          userId: ctx.auth.userId,
        },
      });

      // Then create the steps if provided
      if (steps && steps.length > 0) {
        await db.workflowStep.createMany({
          data: steps.map(step => ({
            workflowId: workflow.id,
            agentId: step.agentId,
            order: step.order,
            config: step.config || {},
          })),
        });
      }

      return workflow;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: workflowSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const { steps, ...workflowData } = input.data;

      // First update the workflow
      const workflow = await db.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        data: workflowData,
      });

      // Then handle steps if provided
      if (steps) {
        // Delete existing steps
        await db.workflowStep.deleteMany({
          where: { workflowId: input.id },
        });

        // Create new steps
        if (steps.length > 0) {
          await db.workflowStep.createMany({
            data: steps.map(step => ({
              workflowId: workflow.id,
              agentId: step.agentId,
              order: step.order,
              config: step.config || {},
            })),
          });
        }
      }

      return workflow;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });
    }),

  run: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Start a workflow execution
      const workflow = await db.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
        include: { steps: true },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Create a new execution record
      const execution = await db.workflowRun.create({
        data: {
          workflowId: workflow.id,
          status: "RUNNING",
          startedAt: new Date(),
        },
      });

      // TODO: Implement actual workflow execution with LangGraph

      return execution;
    }),

  getExecutions: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.workflowRun.findMany({
        where: {
          workflowId: input.workflowId,
          workflow: {
            userId: ctx.auth.userId
          }
        },
        orderBy: { startedAt: "desc" },
      });
    }),

  getAllRuns: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.workflowRun.findMany({
        where: {
          workflow: {
            userId: ctx.auth.userId
          }
        },
        include: {
          workflow: {
            select: {
              name: true
            }
          },
          agentRuns: {
            include: {
              agent: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { startedAt: "desc" },
      });
    }),
}); 