import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc";
import { prisma as db } from "@repo/database";
import { TRPCError } from "@trpc/server";
import { BaseAgent, AgentConfig } from "@/lib/agents/base-agent";
import { agentSchema, runAgentSchema } from "@/lib/validations/agent";

export const agentRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      return db.agent.findMany({
        where: { userId: ctx.auth.userId },
        orderBy: { createdAt: "desc" },
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

      console.log("agent", input);
      const agent = await db.agent.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return agent;
    }),

  create: protectedProcedure
    .input(agentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const config = {
        ...input,
        tools: input.tools || [],
        capabilities: input.capabilities || [],
      };

      return db.agent.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          config: JSON.parse(JSON.stringify(config)) as unknown as AgentConfig,
          tools: input.tools || [],
          userId: ctx.auth.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: agentSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if agent exists and belongs to the user
      const existingAgent = await db.agent.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      const config = {
        ...input.data,
        tools: input.data.tools || [],
        capabilities: input.data.capabilities || [],
      };

      return db.agent.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          description: input.data.description,
          type: input.data.type,
          config: JSON.parse(JSON.stringify(config)) as unknown as AgentConfig,
          tools: input.data.tools || [],
        },
      });
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

      // Check if agent exists and belongs to the user
      const existingAgent = await db.agent.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      // Delete all associated runs and memories
      await db.agentMemory.deleteMany({
        where: { agentId: input.id },
      });

      await db.agentRun.deleteMany({
        where: { agentId: input.id },
      });

      return db.agent.delete({
        where: { id: input.id },
      });
    }),

  runAgent: protectedProcedure
    .input(runAgentSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if agent exists and belongs to the user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
        include: {
          memories: {
            where: input.sessionId ? { sessionId: input.sessionId } : undefined,
            orderBy: { updatedAt: 'desc' },
            take: 1,
          }
        }
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      try {
        // Create a run record
        const run = await db.agentRun.create({
          data: {
            agentId: agent.id,
            userId: ctx.auth.userId,
            status: "RUNNING",
            input: JSON.parse(JSON.stringify({
              text: input.input,
              context: input.context || null
            })),
          },
        });

        // Initialize configuration from agent data
        const agentConfig = agent.config as unknown as AgentConfig;
        const config: AgentConfig = {
          ...agentConfig,
          agentId: agent.id,
          name: agent.name,
          description: agent.description || undefined,
          systemPrompt: agentConfig.systemPrompt,
        };

        // Initialize base agent
        const baseAgent = new BaseAgent(config);

        // Load memory if available and requested
        if ('memories' in agent && Array.isArray(agent.memories) && agent.memories.length > 0 && config.memory) {
          const memoryId = agent.memories[0].id;
          await baseAgent.loadMemoryFromDatabase(
            memoryId,
            input.sessionId
          );
        }

        // Run the agent
        const result = await baseAgent.run({
          input: input.input,
          context: input.context,
          toolInput: input.toolInput,
          runId: run.id,
          sessionId: input.sessionId,
          persistMemory: input.persistMemory,
        });

        // Update run record with results
        await db.agentRun.update({
          where: { id: run.id },
          data: {
            status: "COMPLETED",
            output: JSON.parse(JSON.stringify({
              text: result.output,
              toolCalls: result.toolCalls
            })),
            logs: JSON.parse(JSON.stringify(result.logs || [])),
            endedAt: new Date(),
          },
        });

        return {
          runId: run.id,
          output: result.output,
          toolCalls: result.toolCalls,
          memoryId: result.memoryId,
        };
      } catch (error) {
        console.error("Error running agent:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Error running agent",
        });
      }
    }),

  getAgentRuns: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      return db.agentRun.findMany({
        where: {
          agentId: input.agentId,
          userId: ctx.auth.userId,
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

      return db.agentRun.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        include: {
          agent: {
            select: {
              name: true
            }
          }
        },
        orderBy: { startedAt: "desc" },
      });
    }),

  getAgentMemories: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // First verify agent belongs to user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      return db.agentMemory.findMany({
        where: { agentId: input.agentId },
        orderBy: { updatedAt: "desc" },
      });
    }),

  getRunDetails: protectedProcedure
    .input(z.object({ runId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Get run with agent information
      const run = await db.agentRun.findUnique({
        where: {
          id: input.runId,
        },
        include: {
          agent: true
        }
      });

      if (!run) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Run not found",
        });
      }

      // Verify user owns this run
      if (run.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this run",
        });
      }

      // Format the response
      return {
        id: run.id,
        agentId: run.agentId,
        agentName: run.agent.name,
        status: run.status,
        input: run.input,
        output: run.output,
        logs: run.logs || [],
        startedAt: run.startedAt,
        endedAt: run.endedAt,
      };
    }),

  // Get all conversations/sessions for an agent
  getAgentSessions: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // First verify agent belongs to user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      // Get all distinct sessions
      const memories = await db.agentMemory.findMany({
        where: {
          agentId: input.agentId,
          sessionId: { not: null },
        },
        select: {
          sessionId: true,
          updatedAt: true,
          messages: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      // Group by sessionId and take the latest entry for each session
      const sessionMap = new Map();
      for (const memory of memories) {
        if (memory.sessionId && !sessionMap.has(memory.sessionId)) {
          const messages = memory.messages as unknown as { role: string; content: string; timestamp: string }[];
          const lastMessage = messages.filter(m => m.role !== 'system').pop();

          sessionMap.set(memory.sessionId, {
            id: memory.sessionId,
            lastUpdated: memory.updatedAt,
            messageCount: messages.length,
            lastMessage: lastMessage ? lastMessage.content : '',
          });
        }
      }

      return Array.from(sessionMap.values());
    }),

  // Get the conversation history for a session
  getSessionHistory: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      sessionId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // First verify agent belongs to user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      // Find the most recent memory for this session
      const memory = await db.agentMemory.findFirst({
        where: {
          agentId: input.agentId,
          sessionId: input.sessionId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      if (!memory) {
        return [];
      }

      // Return serialized messages
      const serializedMessages = memory.messages as unknown as {
        role: string;
        content: string;
        timestamp: string;
      }[];

      // Transform the messages to include IDs and ensure proper timestamps
      return serializedMessages.map((msg, index) => ({
        id: `${msg.role}-${index}-${new Date(msg.timestamp).getTime()}`,
        role: msg.role === 'human' ? 'user' : msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
    }),

  // Clear the conversation history for a session
  clearSessionHistory: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      sessionId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // First verify agent belongs to user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      // Delete all memories for this session
      await db.agentMemory.deleteMany({
        where: {
          agentId: input.agentId,
          sessionId: input.sessionId,
        },
      });

      return { success: true };
    }),

  // Delete a session
  deleteSession: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      sessionId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // First verify agent belongs to user
      const agent = await db.agent.findUnique({
        where: {
          id: input.agentId,
          userId: ctx.auth.userId,
        },
      });

      if (!agent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      // Delete all memories for this session
      await db.agentMemory.deleteMany({
        where: {
          agentId: input.agentId,
          sessionId: input.sessionId,
        },
      });

      // Also delete related runs
      await db.agentRun.deleteMany({
        where: {
          agentId: input.agentId,
          // Can't directly query JSON fields, handle this at the application level
        },
      });

      return { success: true };
    }),
});