import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Agent type is required"),
  systemPrompt: z.string().min(1, "System prompt is required"),
  tools: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  memory: z.boolean().optional(),
});

export const runAgentSchema = z.object({
  agentId: z.string(),
  input: z.string().min(1, "Input is required"),
  context: z.record(z.unknown()).optional(),
  toolInput: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
  persistMemory: z.boolean().optional(),
}); 