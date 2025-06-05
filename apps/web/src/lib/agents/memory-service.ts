/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@repo/database";
import { BaseMessage, AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";


// Interface for serialized messages
interface SerializedMessage {
  role: string;
  content: string;
  timestamp: string;
}

/**
 * Service for managing agent memory persistence
 */
export class AgentMemoryService {
  /**
   * Store messages in the database for an agent
   */
  static async saveMemory(
    agentId: string,
    messages: BaseMessage[],
    runId?: string,
    sessionId?: string
  ): Promise<string> {
    // Convert messages to serializable format
    const serializedMessages = messages.map((message) => ({
      role: message._getType(),
      content: message.content as string,
      timestamp: new Date().toISOString(),
    }));

    // Create or update memory
    if (runId) {
      // Look for existing memory for this run
      const existingMemory = await prisma.agentMemory.findFirst({
        where: { agentRunId: runId },
      });

      if (existingMemory) {
        // Update existing memory
        const updatedMemory = await prisma.agentMemory.update({
          where: { id: existingMemory.id },
          data: {
            messages: serializedMessages as any,
            updatedAt: new Date(),
          },
        });
        return updatedMemory.id;
      }
    }

    // Create new memory
    const memory = await prisma.agentMemory.create({
      data: {
        agentId,
        agentRunId: runId,
        sessionId,
        messages: serializedMessages as any,
      },
    });

    return memory.id;
  }

  /**
   * Load messages from the database
   */
  static async loadMemory(
    memoryId?: string,
    agentId?: string,
    sessionId?: string
  ): Promise<BaseMessage[]> {
    let memory = null;

    if (memoryId) {
      // Load by memory ID
      memory = await prisma.agentMemory.findUnique({
        where: { id: memoryId },
      });
    } else if (agentId && sessionId) {
      // Load by agent ID and session ID
      memory = await prisma.agentMemory.findFirst({
        where: {
          agentId,
          sessionId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } else if (agentId) {
      // Load the most recent memory for this agent
      memory = await prisma.agentMemory.findFirst({
        where: {
          agentId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }

    if (!memory) {
      return [];
    }

    // Convert serialized messages back to BaseMessage objects
    const serializedMessages = memory.messages as unknown as SerializedMessage[];
    const messages = serializedMessages.map((msg) => {
      switch (msg.role) {
        case "human":
          return new HumanMessage(msg.content);
        case "ai":
          return new AIMessage(msg.content);
        case "system":
          return new SystemMessage(msg.content);
        default:
          // Default to human messages for unknown types
          return new HumanMessage(msg.content);
      }
    });

    return messages;
  }

  /**
   * Delete memory from the database
   */
  static async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      await prisma.agentMemory.delete({
        where: { id: memoryId },
      });
      return true;
    } catch (error) {
      console.error("Error deleting memory:", error);
      return false;
    }
  }

  /**
   * Get all memories for an agent
   */
  static async getAgentMemories(agentId: string): Promise<{
    id: string;
    sessionId: string | null;
    messageCount: number;
    createdAt: Date;
    updatedAt: Date;
  }[]> {
    const memories = await prisma.agentMemory.findMany({
      where: {
        agentId,
      },
      select: {
        id: true,
        sessionId: true,
        messages: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return memories.map((memory: { id: any; sessionId: any; messages: any; createdAt: any; updatedAt: any; }) => {
      const serializedMessages = memory.messages as unknown as SerializedMessage[];
      return {
        id: memory.id,
        sessionId: memory.sessionId,
        messageCount: serializedMessages.length,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt,
      };
    });
  }
} 