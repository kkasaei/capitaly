import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { AgentMemoryService } from "@/lib/agents/memory-service";
import { auth } from "@clerk/nextjs/server";

// GET endpoint to fetch memories for an agent
export async function GET(req: Request) {
  try {
    // Validate authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the agent ID from the URL
    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId");
    const memoryId = url.searchParams.get("memoryId");
    const sessionId = url.searchParams.get("sessionId");

    if (!agentId && !memoryId) {
      return NextResponse.json(
        { error: "Missing required query parameters: agentId or memoryId" },
        { status: 400 }
      );
    }

    // If memoryId is provided, fetch the specific memory
    if (memoryId) {
      const memory = await prisma.agentMemory.findUnique({
        where: {
          id: memoryId,
        },
        include: {
          agent: {
            select: {
              userId: true,
            },
          },
        },
      });

      // Check if the memory exists and belongs to the user
      if (!memory || memory.agent.userId !== authObject.userId) {
        return NextResponse.json(
          { error: "Memory not found or unauthorized" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: memory.id,
        agentId: memory.agentId,
        agentRunId: memory.agentRunId,
        sessionId: memory.sessionId,
        messages: memory.messages,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt,
      });
    }

    // Otherwise, fetch all memories for the specified agent
    // Verify the agent belongs to the user
    const agent = await prisma.agent.findUnique({
      where: {
        id: agentId as string,
        userId: authObject.userId,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Fetch memories for the agent
    let memories;
    if (sessionId) {
      // Fetch memories for a specific session
      memories = await prisma.agentMemory.findMany({
        where: {
          agentId: agentId as string,
          sessionId: sessionId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } else {
      // Fetch all memories for the agent
      memories = await prisma.agentMemory.findMany({
        where: {
          agentId: agentId as string,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }

    // Transform the output to include message count
    const memoryData = memories.map((memory: { id: any; agentId: any; agentRunId: any; sessionId: any; messages: any; createdAt: any; updatedAt: any; }) => {
      const messages = memory.messages as unknown as Array<Record<string, unknown>>;
      return {
        id: memory.id,
        agentId: memory.agentId,
        agentRunId: memory.agentRunId,
        sessionId: memory.sessionId,
        messageCount: messages.length,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt,
      };
    });

    return NextResponse.json(memoryData);
  } catch (error) {
    console.error("Error fetching agent memories:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete an agent memory
export async function DELETE(req: Request) {
  try {
    // Validate authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the memory ID from the URL
    const url = new URL(req.url);
    const memoryId = url.searchParams.get("memoryId");

    if (!memoryId) {
      return NextResponse.json(
        { error: "Missing required query parameter: memoryId" },
        { status: 400 }
      );
    }

    // Get the memory to verify ownership
    const memory = await prisma.agentMemory.findUnique({
      where: {
        id: memoryId,
      },
      include: {
        agent: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Check if the memory exists and belongs to the user
    if (!memory || memory.agent.userId !== authObject.userId) {
      return NextResponse.json(
        { error: "Memory not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the memory
    await AgentMemoryService.deleteMemory(memoryId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent memory:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
} 