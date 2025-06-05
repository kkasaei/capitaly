import { NextRequest, NextResponse } from 'next/server';
import { createCaller } from '@/lib/trpc/root';
import { prisma as db } from '@repo/database';
import { auth } from '@clerk/nextjs/server'; // Clerk imports

// Create a new agent
export async function POST(req: NextRequest) {
  try {
    // Clerk authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Optionally, fetch user details if needed
    // const user = await currentUser();

    // Parse request body
    const body = await req.json();

    // Create tRPC caller
    const caller = createCaller({
      auth: authObject, // Pass the full Clerk auth object
      db,
    });
    // Create agent using tRPC
    const agent = await caller.agent.create({
      name: body.name,
      description: body.description,
      type: body.type,
      systemPrompt: body.systemPrompt,
      tools: body.selectedTools || [],
      model: body.model,
      temperature: body.temperature,
      memory: body.memory,
      capabilities: [],
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET handler to list all agents
export async function GET() {
  try {
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
      auth: authObject, // Pass the full Clerk auth object
      db,
    });

    // Get all agents using tRPC
    const agents = await caller.agent.getAll();

    // Transform agents for the frontend
    const transformedAgents = agents.map((agent: { id: any; name: any; description: any; type: any; }) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      runs: 0,
      lastRun: "Never",
    }));

    return NextResponse.json(transformedAgents);
  } catch (error) {
    console.error("Error getting agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}