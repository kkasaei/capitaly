import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { BaseAgent } from "@/lib/agents/base-agent";

/**
 * Interface for a state graph node handler
 */
type NodeHandler<T> = (state: T) => Promise<Partial<T>>;

/**
 * Interface for a state graph that can process nodes and edges
 */
interface StateGraph<T> {
  // Implementation properties
  nodes: Map<string, NodeHandler<T>>;
  edges: Map<string, string[]>;
  conditionalEdges: Map<string, { 
    condition: (state: T) => string, 
    defaultNodes: string[] 
  }>;
  entryPoint: string | null;
  endNode: string | null;
  
  // Methods
  addNode: (name: string, handler: NodeHandler<T>) => StateGraph<T>;
  addEdge: (from: string, to: string) => StateGraph<T>;
  addConditionalEdges: (from: string, condition: (state: T) => string, defaultNodes: string[]) => StateGraph<T>;
  setEntryPoint: (node: string) => StateGraph<T>;
  setEndNode: (node: string) => StateGraph<T>;
  compile: () => { invoke: (state: T) => Promise<T> };
}

/**
 * Workflow state for marketing workflows
 */
export interface WorkflowState {
  input: string;
  intermediateSteps: {
    agentId: string;
    input: string;
    output: string;
  }[];
  finalOutput?: string;
  error?: string;
  routingDecision?: string;
}

/**
 * Create an initial workflow state
 */
const createInitialWorkflowState = (input: string): WorkflowState => ({
  input,
  intermediateSteps: [],
});

/**
 * Marketing workflow graph for composing agent workflows
 */
export class MarketingWorkflowGraph {
  public graph: StateGraph<WorkflowState>;
  private agents: Record<string, BaseAgent> = {};
  
  constructor() {
    // Implement a minimal but functional graph
    this.graph = {
      nodes: new Map<string, NodeHandler<WorkflowState>>(),
      edges: new Map<string, string[]>(),
      conditionalEdges: new Map<string, { 
        condition: (state: WorkflowState) => string, 
        defaultNodes: string[] 
      }>(),
      entryPoint: null,
      endNode: null,
      
      addNode: (name, handler) => {
        this.graph.nodes.set(name, handler);
        return this.graph;
      },
      
      addEdge: (from, to) => {
        if (!this.graph.edges.has(from)) {
          this.graph.edges.set(from, []);
        }
        this.graph.edges.get(from)!.push(to);
        return this.graph;
      },
      
      addConditionalEdges: (from, condition, defaultNodes) => {
        this.graph.conditionalEdges.set(from, { condition, defaultNodes });
        return this.graph;
      },
      
      setEntryPoint: (node) => {
        this.graph.entryPoint = node;
        return this.graph;
      },
      
      setEndNode: (node) => {
        this.graph.endNode = node;
        return this.graph;
      },
      
      compile: () => ({ 
        invoke: async (state: WorkflowState) => {
          if (!this.graph.entryPoint) {
            throw new Error("Entry point not set for workflow graph");
          }
          
          let currentNode = this.graph.entryPoint;
          let currentState = { ...state };
          
          // Process nodes until we reach an end node or have no more edges
          while (currentNode && currentNode !== this.graph.endNode) {
            // Execute the current node
            const handler = this.graph.nodes.get(currentNode);
            if (!handler) {
              throw new Error(`Node ${currentNode} not found in workflow graph`);
            }
            
            // Update the state with the node's result
            const result = await handler(currentState);
            currentState = { ...currentState, ...result };
            
            // Check if we have a conditional edge
            if (this.graph.conditionalEdges.has(currentNode)) {
              const { condition, defaultNodes } = this.graph.conditionalEdges.get(currentNode)!;
              const nextNode = condition(currentState);
              
              // If the condition returns a valid node name, go there
              if (this.graph.nodes.has(nextNode)) {
                currentNode = nextNode;
                continue;
              }
              
              // Otherwise use the default node if available
              if (defaultNodes.length > 0) {
                currentNode = defaultNodes[0];
                continue;
              }
              
              // No valid next node found
              break;
            }
            
            // Get the next node from regular edges
            const nextNodes = this.graph.edges.get(currentNode);
            if (!nextNodes || nextNodes.length === 0) {
              break; // No more edges, stop execution
            }
            currentNode = nextNodes[0]; // Take the first edge
          }
          
          // Execute the end node if we reached it
          if (currentNode === this.graph.endNode) {
            const handler = this.graph.nodes.get(currentNode);
            if (handler) {
              const result = await handler(currentState);
              currentState = { ...currentState, ...result };
            }
          }
          
          return currentState;
        } 
      }),
    };
    
    // Set an entry point by default
    this.graph.setEntryPoint("start");
  }
  
  /**
   * Add an agent node to the workflow
   */
  addAgent(agentId: string, agent: BaseAgent, nodeName: string = agentId) {
    this.agents[agentId] = agent;
    
    // Create an agent node
    this.graph.addNode(nodeName, async (state: WorkflowState) => {
      try {
        // Run the agent
        const result = await agent.run({
          input: state.input,
        });
        
        // Record the step
        const newSteps = [
          ...state.intermediateSteps,
          {
            agentId,
            input: state.input,
            output: result.output,
          },
        ];
        
        // Return updated state
        return {
          ...state,
          intermediateSteps: newSteps,
        };
      } catch (error) {
        return {
          ...state,
          error: `Error in agent ${agentId}: ${String(error)}`,
        };
      }
    });
    
    return this;
  }
  
  /**
   * Connect two nodes in sequence
   */
  addEdge(fromNode: string, toNode: string) {
    this.graph.addEdge(fromNode, toNode);
    return this;
  }
  
  /**
   * Add a conditional edge based on agent output
   */
  addConditionalEdge(
    fromNode: string, 
    conditionFn: (state: WorkflowState) => string,
    defaultNode?: string
  ) {
    this.graph.addConditionalEdges(
      fromNode,
      conditionFn,
      defaultNode ? [defaultNode] : []
    );
    return this;
  }
  
  /**
   * Set the output node (final node in the workflow)
   */
  setOutputNode(nodeName: string) {
    // Add a formatting node at the end
    this.graph.addNode("output_formatter", async (state: WorkflowState) => {
      // Get output from the final step
      const lastStep = state.intermediateSteps[state.intermediateSteps.length - 1];
      
      // Format the final output
      const formattedOutput = `
# Marketing Workflow Results

## Final Output
${lastStep.output}

## Workflow Steps
${state.intermediateSteps.map((step, index) => 
  `### Step ${index + 1}: ${step.agentId}
Input: ${step.input.substring(0, 100)}${step.input.length > 100 ? '...' : ''}
Output: ${step.output.substring(0, 100)}${step.output.length > 100 ? '...' : ''}`
).join('\n\n')}
`;

      return {
        ...state,
        finalOutput: formattedOutput,
      };
    });
    
    // Connect the specified node to the output formatter
    this.graph.addEdge(nodeName, "output_formatter");
    
    // Set output formatter as the final node
    this.graph.setEndNode("output_formatter");
    
    return this;
  }
  
  /**
   * Compile the workflow graph
   */
  compile() {
    return this.graph.compile();
  }
  
  /**
   * Run the workflow with the given input
   */
  async run(input: string) {
    const compiledGraph = this.compile();
    const result = await compiledGraph.invoke(createInitialWorkflowState(input));
    return result;
  }
}

/**
 * Create a linear marketing workflow that processes content through multiple stages
 */
export function createContentMarketingWorkflow(
  contentAgent: BaseAgent, 
  seoAgent: BaseAgent, 
  socialAgent: BaseAgent
) {
  // Create a new workflow graph
  const workflow = new MarketingWorkflowGraph();
  
  // Add our agents
  workflow
    .addAgent("content_creation", contentAgent, "create_content")
    .addAgent("seo_optimization", seoAgent, "optimize_content")
    .addAgent("social_distribution", socialAgent, "create_social_posts");
  
  // Connect agents in sequence
  workflow
    .addEdge("create_content", "optimize_content")
    .addEdge("optimize_content", "create_social_posts")
    .setOutputNode("create_social_posts");
  
  return workflow;
}

/**
 * Create a dynamic marketing workflow that uses conditional routing
 */
export function createDynamicMarketingWorkflow(agents: Record<string, BaseAgent>) {
  // Create a new workflow graph
  const workflow = new MarketingWorkflowGraph();
  
  // Add a router node that uses LLM to decide next steps
  const routerLLM = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });
  
  const routerPrompt = ChatPromptTemplate.fromTemplate(`
You are a marketing workflow router. Based on the user request, decide which agent should handle it next.
Choose from the following options:
- content_creation: For creating or editing marketing content
- seo_optimization: For analyzing or optimizing content for search engines
- social_distribution: For creating social media posts or distribution strategies
- analytics: For analyzing marketing performance metrics
- complete: If the workflow is finished and no further steps are needed

User request: {input}

Previous steps: {steps}

Your decision (just return one option from the list above):
`);
  
  const routerChain = RunnableSequence.from([
    {
      input: (state: WorkflowState) => state.input,
      steps: (state: WorkflowState) => 
        state.intermediateSteps.map(step => 
          `${step.agentId}: ${step.output.substring(0, 200)}...`
        ).join("\n\n"),
    },
    routerPrompt,
    routerLLM,
    new StringOutputParser(),
  ]);
  
  // Add router node
  workflow.graph.addNode("router", async (state: WorkflowState) => {
    // If this is the first step or there's an error, start with content creation
    if (state.intermediateSteps.length === 0 || state.error) {
      return state;
    }
    
    try {
      // Use the router chain to decide the next node
      const nextNode = await routerChain.invoke(state);
      
      // Add the routing decision to state
      return {
        ...state,
        routingDecision: nextNode.trim().toLowerCase(),
      };
    } catch (error) {
      console.error("Routing error:", error);
      return {
        ...state,
        error: `Routing error: ${String(error)}`,
      };
    }
  });
  
  // Add all agents
  Object.entries(agents).forEach(([agentId, agent]) => {
    workflow.addAgent(agentId, agent);
  });
  
  // Add conditional routing
  workflow.graph.addConditionalEdges(
    "router",
    (state: WorkflowState) => {
      return state.routingDecision || "content_creation";
    },
    Object.keys(agents).concat(["complete"])
  );
  
  // Connect all agent nodes back to router
  Object.keys(agents).forEach(agentId => {
    workflow.graph.addEdge(agentId, "router");
  });
  
  // Set entry and end nodes
  workflow.graph.setEntryPoint("router");
  workflow.graph.setEndNode("complete");
  
  return workflow;
} 