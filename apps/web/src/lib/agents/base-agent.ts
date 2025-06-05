import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent, AgentStep } from "langchain/agents";
import { BaseMessage } from "@langchain/core/messages";
// When the package is installed properly, uncomment this
// import { BufferMemory, ChatMessageHistory } from "@langchain/community/memory";
// import { BaseMemory } from "@langchain/core/memory";
import { AgentMemoryService } from "./memory-service";

// Temporary interfaces until we install the proper packages
interface ChatMessageHistoryInterface {
  addUserMessage(message: string): Promise<void>;
  addAIMessage(message: string): Promise<void>;
  getMessages(): Promise<BaseMessage[]>;
  clear(): Promise<void>;
}

class ChatMessageHistory implements ChatMessageHistoryInterface {
  private messages: BaseMessage[] = [];
  
  constructor(initialMessages?: BaseMessage[]) {
    if (initialMessages) {
      this.messages = [...initialMessages];
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addUserMessage(message: string): Promise<void> {
    // Implementation will be added when we install @langchain/community
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addAIMessage(message: string): Promise<void> {
    // Implementation will be added when we install @langchain/community
  }
  
  async getMessages(): Promise<BaseMessage[]> {
    return this.messages;
  }
  
  async clear(): Promise<void> {
    this.messages = [];
  }
}

interface BufferMemoryOptions {
  chatHistory: ChatMessageHistoryInterface;
  returnMessages: boolean;
  memoryKey: string;
  inputKey: string;
}

class BufferMemory {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options: BufferMemoryOptions) {
    // Implementation will be added when we install @langchain/community
  }
}

// Agent types
export type AgentConfig = {
  name: string;
  description?: string;
  systemPrompt: string;
  tools?: Tool[];
  capabilities?: string[]; // What tasks this agent can perform
  memory?: boolean;
  model?: string;
  temperature?: number;
  agentId?: string; // Database ID for the agent
};

// Types for agent inputs and outputs
export type AgentInput = {
  input: string;
  context?: Record<string, unknown>;
  toolInput?: Record<string, unknown>;
  history?: BaseMessage[]; // Add message history
  runId?: string; // Database ID for the run
  sessionId?: string; // Session ID for grouping runs
  persistMemory?: boolean; // Whether to persist memory to database
};

export type AgentOutput = {
  output: string;
  toolCalls?: {
    tool: string;
    input: Record<string, unknown>;
    output: string;
  }[];
  logs?: string[];
  memoryId?: string; // ID of the stored memory
};

/**
 * Enhanced base agent that uses LangChain's agent framework.
 * Supports tools, dynamic capabilities, and more complex workflows.
 */
export class BaseAgent {
  private config: AgentConfig;
  private llm: ChatOpenAI;
  private agent: AgentExecutor | null = null;
  private messageHistory: ChatMessageHistory | null = null;
  private memory: BufferMemory | null = null;
  private memoryId: string | null = null;
  
  constructor(config: AgentConfig) {
    this.config = config;
    
    // Initialize the language model
    this.llm = new ChatOpenAI({
      modelName: config.model || "gpt-3.5-turbo",
      temperature: config.temperature || 0.7,
    });
    
    // Initialize message history and memory if enabled
    if (config.memory) {
      this.messageHistory = new ChatMessageHistory();
      
      this.memory = new BufferMemory({
        chatHistory: this.messageHistory,
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
      });
    }
    
    // Initialize agent if tools are provided
    if (config.tools && config.tools.length > 0) {
      this.initializeAgent();
    }
  }
  
  private async initializeAgent() {
    if (!this.config.tools || this.config.tools.length === 0) return;
    
    try {
      const tools = this.config.tools;
      
      // Create the prompt
      const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(this.config.systemPrompt),
        HumanMessagePromptTemplate.fromTemplate("{input}"),
      ]);
      
      // Create the agent
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools,
        prompt,
      });
      
      // Create the agent executor
      this.agent = new AgentExecutor({
        agent,
        tools,
        verbose: false,
        returnIntermediateSteps: true,
        // Note: We need to type cast once proper packages are installed
        // memory: this.memory as BaseMemory,
      });
    } catch (error) {
      console.error("Error initializing agent:", error);
    }
  }

  /**
   * Update message history with new messages
   */
  async updateHistory(input: string, output: string): Promise<void> {
    if (this.config.memory && this.messageHistory) {
      await this.messageHistory.addUserMessage(input);
      await this.messageHistory.addAIMessage(output);
    }
  }
  
  /**
   * Load message history from provided messages
   */
  async loadHistory(messages: BaseMessage[]): Promise<void> {
    if (this.config.memory && messages.length > 0) {
      // Create a new message history with the provided messages
      this.messageHistory = new ChatMessageHistory(messages);
      
      // Reinitialize memory with the new message history
      this.memory = new BufferMemory({
        chatHistory: this.messageHistory,
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
      });
      
      // Reinitialize agent with new memory if needed
      if (this.agent && this.config.tools) {
        await this.initializeAgent();
      }
    }
  }
  
  /**
   * Get current message history
   */
  async getHistory(): Promise<BaseMessage[]> {
    if (this.config.memory && this.messageHistory) {
      return this.messageHistory.getMessages();
    }
    return [];
  }
  
  /**
   * Clear message history
   */
  async clearHistory(): Promise<void> {
    if (this.config.memory && this.messageHistory) {
      await this.messageHistory.clear();
      this.memoryId = null;
    }
  }
  
  /**
   * Load memory from the database
   */
  async loadMemoryFromDatabase(memoryId?: string, sessionId?: string): Promise<boolean> {
    if (!this.config.memory || !this.config.agentId) return false;
    
    try {
      // Load messages using the memory service
      const messages = await AgentMemoryService.loadMemory(
        memoryId,
        this.config.agentId,
        sessionId
      );
      
      if (messages.length > 0) {
        // Load the messages into the agent's memory
        await this.loadHistory(messages);
        
        // Store memory ID if provided
        if (memoryId) {
          this.memoryId = memoryId;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error loading memory from database:", error);
      return false;
    }
  }
  
  /**
   * Save memory to the database
   */
  async saveMemoryToDatabase(runId?: string, sessionId?: string): Promise<string | null> {
    if (!this.config.memory || !this.config.agentId) return null;
    
    try {
      // Get current messages
      const messages = await this.getHistory();
      
      if (messages.length === 0) return null;
      
      // Save messages using the memory service
      const memoryId = await AgentMemoryService.saveMemory(
        this.config.agentId,
        messages,
        runId,
        sessionId
      );
      
      // Store memory ID
      this.memoryId = memoryId;
      
      return memoryId;
    } catch (error) {
      console.error("Error saving memory to database:", error);
      return null;
    }
  }
  
  /**
   * Run the agent with the provided input
   */
  async run(input: AgentInput): Promise<AgentOutput> {
    try {
      const logs: string[] = [
        `Agent: ${this.config.name}`,
        `Model: ${this.llm.modelName}`,
        `Timestamp: ${new Date().toISOString()}`
      ];
      
      // Include context if provided
      const contextString = input.context 
        ? `\n\nContext: ${JSON.stringify(input.context)}` 
        : '';
        
      const fullInput = `${input.input}${contextString}`;
      
      // Load history from database if this agent has a database ID
      if (input.runId && this.config.agentId && this.config.memory) {
        // Try to load memory from a specific run
        const loaded = await this.loadMemoryFromDatabase(undefined, input.sessionId);
        logs.push(`Memory loaded from database: ${loaded}`);
      }
      // If history is provided in the input, load it
      else if (input.history && this.config.memory) {
        await this.loadHistory(input.history);
        logs.push("Memory loaded from provided history");
      }
      
      // If agent with tools is initialized, use it
      if (this.agent) {
        logs.push("Execution mode: AgentExecutor with tools");
        
        const result = await this.agent.invoke({
          input: fullInput,
          ...input.toolInput,
        });
        
        // Extract tool calls from intermediate steps
        const toolCalls = result.intermediateSteps?.map((step: AgentStep) => ({
          tool: step.action.tool,
          input: step.action.toolInput as Record<string, unknown>,
          output: step.observation as string,
        }));
        
        // Update history if memory is enabled and not using agent's built-in memory
        if (this.config.memory && this.messageHistory && !this.agent.memory) {
          await this.updateHistory(fullInput, result.output);
        }
        
        // Persist memory to database if requested
        let memoryId: string | undefined = this.memoryId || undefined;
        if (input.persistMemory && this.config.agentId && this.config.memory) {
          const savedMemoryId = await this.saveMemoryToDatabase(input.runId, input.sessionId);
          if (savedMemoryId) {
            memoryId = savedMemoryId;
          }
        }
        
        return {
          output: result.output,
          toolCalls,
          logs,
          memoryId,
        };
      } 
      // Otherwise, use simpler LLM chain
      else {
        logs.push("Execution mode: Simple LLM chain (no tools)");
        
        let result: string;
        
        if (this.config.memory && this.messageHistory) {
          // Create a prompt that includes chat history
          const messages = await this.messageHistory.getMessages();
          
          // Add system message at the beginning if not already present
          const systemMessageExists = messages.some(
            (msg: BaseMessage) => msg._getType() === "system"
          );
          
          const chatPrompt = ChatPromptTemplate.fromMessages([
            // Add system message if not in history
            ...(systemMessageExists 
              ? [] 
              : [SystemMessagePromptTemplate.fromTemplate(this.config.systemPrompt)]),
            // Add existing messages from history
            ...messages,
            // Add new user message
            HumanMessagePromptTemplate.fromTemplate("{input}"),
          ]);
          
          // Create chain with memory
          const chain = chatPrompt.pipe(this.llm).pipe(new StringOutputParser());
          
          // Run the chain
          result = await chain.invoke({
            input: fullInput,
          });
          
          // Update history
          await this.updateHistory(fullInput, result);
        } else {
          // Create simple prompt without memory
          const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(this.config.systemPrompt),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
          ]);
          
          // Create a simple chain
          const chain = prompt.pipe(this.llm).pipe(new StringOutputParser());
          
          // Run the chain
          result = await chain.invoke({
            input: fullInput,
          });
        }
        
        // Persist memory to database if requested
        let memoryId: string | undefined = this.memoryId || undefined;
        if (input.persistMemory && this.config.agentId && this.config.memory) {
          const savedMemoryId = await this.saveMemoryToDatabase(input.runId, input.sessionId);
          if (savedMemoryId) {
            memoryId = savedMemoryId;
          }
        }
        
        return {
          output: result,
          logs,
          memoryId,
        };
      }
    } catch (error) {
      console.error("Error running agent:", error);
      return {
        output: "An error occurred while running the agent. Please try again.",
        logs: [`Error: ${String(error)}`],
      };
    }
  }
  
  /**
   * Add a tool to the agent
   */
  async addTool(tool: Tool): Promise<void> {
    if (!this.config.tools) {
      this.config.tools = [];
    }
    
    this.config.tools.push(tool);
    await this.initializeAgent();
  }
  
  /**
   * Get agent capabilities
   */
  getCapabilities(): string[] {
    return this.config.capabilities || [];
  }
} 