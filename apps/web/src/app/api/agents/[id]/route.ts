import { NextRequest, NextResponse } from 'next/server';
import { createCaller } from '@/lib/trpc/root';
import { prisma as db } from '@repo/database';
import { auth } from '@clerk/nextjs/server';

// Interface for agent configuration
interface AgentConfig {
  model?: string;
  temperature?: number;
  systemPrompt: string;
  memory?: boolean;
  capabilities?: string[];
}

// GET handler to fetch a single agent by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Clerk authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create tRPC caller
    const caller = createCaller({
      auth: authObject,
      db,
    });

    // Get agent by ID using tRPC
    const agent = await caller.agent.getById({ id });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Transform agent data for frontend
    const config = agent.config as unknown as AgentConfig;
    const transformedAgent = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      model: config.model || "gpt-3.5-turbo",
      temperature: config.temperature || 0.7,
      systemPrompt: config.systemPrompt,
      selectedTools: agent.tools,
      memory: config.memory,
      runs: 0, // We could calculate this from agent.runs if needed
      lastRun: "Never", // We could calculate this from agent.runs if needed
    };

    // Return the agent data
    return NextResponse.json(transformedAgent);
  } catch (error) {
    console.error("Error getting agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// PATCH handler to update an agent
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Clerk authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create tRPC caller
    const caller = createCaller({
      auth: authObject,
      db,
    });

    // Update agent using tRPC
    const agent = await caller.agent.update({
      id,
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        systemPrompt: body.systemPrompt,
        tools: body.selectedTools || [],
        model: body.model,
        temperature: body.temperature,
        memory: body.memory,
        capabilities: body.capabilities || [],
      },
    });

    // Transform agent data for frontend
    const config = agent.config as unknown as AgentConfig;
    const transformedAgent = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      model: config.model || "gpt-3.5-turbo",
      temperature: config.temperature || 0.7,
      systemPrompt: config.systemPrompt,
      selectedTools: agent.tools,
      memory: config.memory,
      runs: 0,
      lastRun: "Never (after update)",
    };

    return NextResponse.json(transformedAgent);
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an agent
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Clerk authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create tRPC caller
    const caller = createCaller({
      auth: authObject,
      db,
    });

    // Delete agent using tRPC
    await caller.agent.delete({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}