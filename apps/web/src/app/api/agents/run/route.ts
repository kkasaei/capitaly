/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { BaseAgent, AgentInput } from "@/lib/agents/base-agent";
import { ContentMarketingAgent } from "@/lib/agents/content-agent";
import { auth } from "@clerk/nextjs/server";

// Type for run agent input
type RunAgentInput = {
  prompt: string;
  context?: Record<string, unknown>;
  toolInput?: Record<string, unknown>;
  sessionId?: string;
  persistMemory?: boolean;
};

// Helper function to safely access config properties
function getConfigValue<T>(config: unknown, key: string, defaultValue: T): T {
  if (!config || typeof config !== 'object') return defaultValue;

  const configObj = config as Record<string, unknown>;
  return (configObj[key] as T) ?? defaultValue;
}

export async function POST(req: Request) {
  try {
    // Validate authentication
    const authObject = await auth();
    if (!authObject.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { agentId, input } = body;

    if (!agentId || !input) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the agent from the database
    const agent = await prisma.agent.findUnique({
      where: {
        id: agentId,
        userId: authObject.userId,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Get the agent configuration as a safe object
    const agentConfig = agent.config as Record<string, unknown>;

    // Create an agent run record
    const agentRun = await prisma.agentRun.create({
      data: {
        agentId: agent.id,
        userId: authObject.userId,
        status: 'RUNNING', // RunStatus.RUNNING,
        input: JSON.parse(JSON.stringify(input)) as any, // Store the input as JSON
      },
    });

    // Determine the agent type and instantiate the appropriate agent
    let agentInstance;
    switch (agent.type) {
      case "content":
        agentInstance = new ContentMarketingAgent({
          name: agent.name,
          description: agent.description || undefined,
          agentId: agent.id, // Pass the agent ID for memory persistence
          // Pass agent-specific configuration from the database
          ...agentConfig,
        });
        break;
      // Add other agent types here as they are implemented
      default:
        // Default to base agent
        agentInstance = new BaseAgent({
          name: agent.name,
          description: agent.description || undefined,
          agentId: agent.id, // Pass the agent ID for memory persistence
          systemPrompt: getConfigValue<string>(agentConfig, 'systemPrompt', "You are an AI assistant."),
          memory: getConfigValue<boolean>(agentConfig, 'memory', false),
          model: getConfigValue<string>(agentConfig, 'model', "gpt-3.5-turbo"),
          temperature: getConfigValue<number>(agentConfig, 'temperature', 0.7),
        });
    }

    // Run the agent
    const typedInput = input as RunAgentInput;
    const agentInput: AgentInput = {
      input: typedInput.prompt,
      context: typedInput.context || {},
      toolInput: typedInput.toolInput,
      runId: agentRun.id, // Pass the run ID for memory persistence
      sessionId: typedInput.sessionId, // Pass session ID if provided
      persistMemory: typedInput.persistMemory || false, // Whether to persist memory
    };

    const result = await agentInstance.run(agentInput);

    // Update agent run with the result
    const updatedRun = await prisma.agentRun.update({
      where: {
        id: agentRun.id,
      },
      data: {
        status: 'COMPLETED', //RunStatus.COMPLETED,
        output: JSON.parse(JSON.stringify({ content: result.output })) as any,
        logs: JSON.parse(JSON.stringify(result.logs)) as any,
        endedAt: new Date(),
      },
    });

    // If memory was persisted, link it to the run
    if (result.memoryId) {
      await prisma.agentMemory.update({
        where: {
          id: result.memoryId,
        },
        data: {
          agentRunId: agentRun.id,
        },
      });
    }

    return NextResponse.json({
      id: updatedRun.id,
      output: result.output,
      toolCalls: result.toolCalls,
      logs: result.logs,
      memoryId: result.memoryId,
    });
  } catch (error) {
    console.error("Error running agent:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
} 