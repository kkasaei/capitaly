/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseAgent, AgentConfig } from "./base-agent";
import { ContentMarketingAgent } from "./content-agent";
import { getToolsByAgentType, getAllTools } from "./tools";
import { Tool } from "@langchain/core/tools";

// Define agent capabilities by type
const AGENT_CAPABILITIES = {
  content: [
    "create_blog_post",
    "generate_article",
    "write_product_description",
    "create_email_content",
    "edit_content",
    "optimize_content",
  ],
  social: [
    "create_social_post",
    "schedule_content",
    "analyze_engagement",
    "create_social_campaign",
    "respond_to_comments",
  ],
  seo: [
    "keyword_research",
    "content_optimization",
    "backlink_analysis",
    "competitor_analysis",
    "seo_audit",
  ],
  analytics: [
    "track_performance",
    "generate_report",
    "analyze_campaign",
    "identify_trends",
    "conversion_analysis",
  ],
  custom: [], // Custom agents can have any capabilities
};

// Define default prompts by agent type
const DEFAULT_PROMPTS = {
  content: `You are an expert content marketing specialist with years of experience. 
Your goal is to help create high-quality, engaging content that resonates with the target audience.

Follow these principles:
1. Focus on providing value to the reader
2. Make content clear, concise, and compelling
3. Use an appropriate tone based on the brand and audience
4. Include strong headlines and calls-to-action
5. Optimize for SEO when appropriate
6. Structure content for readability (headings, bullet points, short paragraphs)`,

  social: `You are a social media marketing expert who specializes in creating engaging content for various platforms.

Follow these principles:
1. Craft platform-specific content that resonates with each audience
2. Create content that drives engagement (likes, shares, comments)
3. Develop consistent brand voice across platforms
4. Stay current with platform trends and algorithm changes
5. Include effective calls-to-action
6. Optimize posting times and frequency`,

  seo: `You are an SEO specialist with extensive knowledge of search engine algorithms and optimization techniques.

Follow these principles:
1. Focus on user intent first, search engines second
2. Create content that satisfies both users and search algorithms
3. Structure content with proper heading hierarchy
4. Use keywords naturally and strategically
5. Optimize meta elements (titles, descriptions)
6. Consider both on-page and technical SEO factors`,

  analytics: `You are a marketing analytics expert who specializes in deriving insights from data.

Follow these principles:
1. Focus on actionable metrics over vanity metrics
2. Connect data points to business outcomes
3. Identify patterns and trends across campaigns
4. Provide recommendations based on data
5. Break down complex data into clear insights
6. Track KPIs that align with business goals`,

  custom: `You are a specialized marketing AI assistant.
Provide expert guidance based on your configuration and tools.`,
};

/**
 * Factory function to create an agent based on configuration
 */
export function createAgent(config: Partial<AgentConfig> & { type: string }): BaseAgent {
  const agentType = config.type;
  
  // Get default system prompt for the agent type
  const defaultSystemPrompt = DEFAULT_PROMPTS[agentType as keyof typeof DEFAULT_PROMPTS] || DEFAULT_PROMPTS.custom;
  
  // Get capabilities for this agent type
  const capabilities = config.capabilities || AGENT_CAPABILITIES[agentType as keyof typeof AGENT_CAPABILITIES] || [];
  
  // Create the full agent configuration
  const fullConfig: AgentConfig = {
    name: config.name || `${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent`,
    description: config.description || `A marketing agent specializing in ${agentType}`,
    systemPrompt: config.systemPrompt || defaultSystemPrompt,
    tools: config.tools, // Use the tools passed in the config
    capabilities,
    model: config.model || "gpt-3.5-turbo",
    temperature: config.temperature || 0.7,
    memory: config.memory || false,
  };
  
  // Add tools after agent is created if not already provided
  const agent = agentType === "content" 
    ? new ContentMarketingAgent(fullConfig) 
    : new BaseAgent(fullConfig);
  
  // If no tools were provided in config, add the default tools for this agent type
  if (!config.tools) {
    const toolsForType = getToolsByAgentType(agentType);
    toolsForType.forEach(async tool => {
      await agent.addTool(tool as unknown as Tool<any>);
    });
  }
  
  return agent;
}

/**
 * Create a custom agent with specified tools and capabilities
 */
export function createCustomAgent(config: Partial<AgentConfig>, selectedToolNames: string[] = []): BaseAgent {
  // Create the agent first
  const agent = createAgent({
    ...config,
    type: "custom",
  });
  
  // Then add selected tools
  if (selectedToolNames.length > 0) {
    const allTools = getAllTools();
    const selectedTools = allTools.filter(tool => selectedToolNames.includes(tool.name));
    
    selectedTools.forEach(async tool => {
      await agent.addTool(tool as unknown as Tool<any>);
    });
  }
  
  return agent;
} 