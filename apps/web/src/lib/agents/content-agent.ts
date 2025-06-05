import { BaseAgent, AgentConfig, AgentInput, AgentOutput } from "./base-agent";

/**
 * Specialization for content marketing.
 * This agent is designed to help with content creation, editing, and optimization.
 */
export class ContentMarketingAgent extends BaseAgent {
  constructor(config?: Partial<AgentConfig>) {
    // Merge provided config with default content marketing config
    const defaultConfig: AgentConfig = {
      name: "Content Marketing Agent",
      description: "Creates, edits, and optimizes marketing content based on best practices",
      systemPrompt: `You are an expert content marketing specialist with years of experience. 
Your goal is to help create high-quality, engaging content that resonates with the target audience.

Follow these principles:
1. Focus on providing value to the reader
2. Make content clear, concise, and compelling
3. Use an appropriate tone based on the brand and audience
4. Include strong headlines and calls-to-action
5. Optimize for SEO when appropriate
6. Structure content for readability (headings, bullet points, short paragraphs)

For any content creation task, consider:
- The target audience and their needs
- The stage of the marketing funnel
- The goal of the content (educate, entertain, persuade, etc.)
- The platform where the content will be published
- The brand voice and style guidelines`,
      model: "gpt-4o",
      temperature: 0.7,
    };

    // Merge configs, with provided config taking precedence
    super({
      ...defaultConfig,
      ...config,
    });
  }

  /**
   * Generate a blog post based on a topic and target audience
   */
  async generateBlogPost(topic: string, targetAudience: string, wordCount = 800): Promise<AgentOutput> {
    const input: AgentInput = {
      input: `Generate a blog post about "${topic}" targeted at ${targetAudience}. 
The post should be approximately ${wordCount} words.
Include a catchy headline, introduction, 3-4 main sections with subheadings, and a conclusion with a call-to-action.`,
      context: {
        contentType: "blog post",
        topic,
        targetAudience,
        wordCount,
      },
    };

    return this.run(input);
  }

  /**
   * Generate social media posts based on a topic or campaign
   */
  async generateSocialMediaPosts(
    topic: string, 
    platforms: string[], 
    count = 3
  ): Promise<AgentOutput> {
    const input: AgentInput = {
      input: `Generate ${count} social media posts about "${topic}" for the following platforms: ${platforms.join(", ")}.
Each post should be optimized for its platform (length, tone, hashtags, etc.).
For each post, include the platform, the post text, and any hashtags or mentions that should be included.`,
      context: {
        contentType: "social media",
        topic,
        platforms,
        count,
      },
    };

    return this.run(input);
  }

  /**
   * Optimize existing content for SEO based on target keywords
   */
  async optimizeForSEO(
    content: string, 
    targetKeywords: string[], 
    suggestions = true
  ): Promise<AgentOutput> {
    const input: AgentInput = {
      input: `Optimize the following content for SEO using these target keywords: ${targetKeywords.join(", ")}.
${suggestions ? "Provide specific suggestions for improvement and an optimized version." : "Provide only the optimized version."}

CONTENT:
${content}`,
      context: {
        contentType: "SEO optimization",
        targetKeywords,
        originalLength: content.length,
      },
    };

    return this.run(input);
  }

  /**
   * Generate email marketing content
   */
  async generateEmailContent(
    purpose: string,
    audience: string,
    keyPoints: string[]
  ): Promise<AgentOutput> {
    const input: AgentInput = {
      input: `Generate email marketing content for ${purpose}. The target audience is ${audience}.
Include these key points: ${keyPoints.join(", ")}.
Provide a subject line and the email body. The email should be professional but conversational, with a clear call-to-action.`,
      context: {
        contentType: "email",
        purpose,
        audience,
        keyPoints,
      },
    };

    return this.run(input);
  }
} 