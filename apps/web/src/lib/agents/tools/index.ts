import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// Types
export type ToolRegistration = {
  id: string;
  name: string;
  description: string;
  getTool: () => DynamicStructuredTool;
};

// Available tools registry
const toolRegistry: Record<string, ToolRegistration> = {};

/**
 * Social Media Tools
 */

// Twitter/X Post Tool
export const createTwitterPostTool = () => {
  return new DynamicStructuredTool({
    name: "twitter_post",
    description: "Create a Twitter/X post with optional image. Useful for social media marketing.",
    schema: z.object({
      content: z.string().describe("The text content of the tweet (max 280 characters)"),
      imageUrl: z.string().optional().describe("Optional URL to an image to include with the tweet"),
      scheduledTime: z.string().optional().describe("Optional time to schedule the tweet (ISO format)"),
    }),
    func: async ({ content, imageUrl, scheduledTime }) => {
      // Would connect to Twitter API in production
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would connect to the Twitter API to post this content",
        details: {
          platform: "twitter",
          content: content.substring(0, 280), // Enforce Twitter's character limit
          hasImage: !!imageUrl,
          scheduledTime: scheduledTime || "immediate",
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

// LinkedIn Post Tool
export const createLinkedInPostTool = () => {
  return new DynamicStructuredTool({
    name: "linkedin_post",
    description: "Create a LinkedIn post with optional image. Good for professional content.",
    schema: z.object({
      content: z.string().describe("The text content of the LinkedIn post"),
      imageUrl: z.string().optional().describe("Optional URL to an image to include"),
      title: z.string().optional().describe("Optional title for the post"),
      scheduledTime: z.string().optional().describe("Optional time to schedule the post (ISO format)"),
    }),
    func: async ({ content, imageUrl, title, scheduledTime }) => {
      // Would connect to LinkedIn API in production
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would connect to the LinkedIn API to post this content",
        details: {
          platform: "linkedin",
          content,
          title: title || undefined,
          hasImage: !!imageUrl,
          scheduledTime: scheduledTime || "immediate",
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

/**
 * SEO Tools
 */

// Keyword Analysis Tool
export const createKeywordAnalysisTool = () => {
  return new DynamicStructuredTool({
    name: "keyword_analysis",
    description: "Analyze keywords for SEO performance and competitiveness.",
    schema: z.object({
      keywords: z.array(z.string()).describe("List of keywords to analyze"),
      language: z.string().optional().describe("Optional language code (default 'en')"),
    }),
    func: async ({ keywords, language = 'en' }) => {
      // Would connect to an SEO API in production (like SEMrush, Ahrefs, etc.)
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would connect to an SEO API to analyze these keywords",
        details: {
          requestType: "keyword_analysis",
          keywords,
          language,
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

// Content SEO Optimizer
export const createContentOptimizerTool = () => {
  return new DynamicStructuredTool({
    name: "content_optimizer",
    description: "Suggest improvements to make content more SEO-friendly.",
    schema: z.object({
      content: z.string().describe("The content to analyze and optimize"),
      targetKeywords: z.array(z.string()).describe("Target keywords to optimize for"),
    }),
    func: async ({ content, targetKeywords }) => {
      // Would connect to a content analysis API in production
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would analyze content using NLP and SEO best practices",
        details: {
          contentLength: content.length,
          wordCount: content.split(/\s+/).length,
          targetKeywords,
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

/**
 * Analytics Tools
 */

// GA4 Data Fetcher
export const createAnalyticsTool = () => {
  return new DynamicStructuredTool({
    name: "analytics_data",
    description: "Get website analytics data like traffic, conversions, etc.",
    schema: z.object({
      metric: z.string().describe("The metric to retrieve (e.g., 'pageviews', 'conversions', 'users')"),
      period: z.string().describe("Time period (e.g., '7d', '30d', '90d')"),
      segment: z.string().optional().describe("Optional segment to filter by"),
    }),
    func: async ({ metric, period, segment }) => {
      // Would connect to Google Analytics API in production
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would connect to Google Analytics API to fetch this data",
        details: {
          requestType: "analytics_data",
          metric,
          period,
          segment: segment || "all_users",
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

/**
 * Content Tools
 */

// Content Generator for a Specific Platform
export const createContentGeneratorTool = () => {
  return new DynamicStructuredTool({
    name: "generate_content",
    description: "Create content for a specific marketing platform or purpose",
    schema: z.object({
      platform: z.string().describe("Target platform (blog, email, social, etc.)"),
      topic: z.string().describe("The topic to create content about"),
      tone: z.string().describe("The tone of the content (professional, casual, etc.)"),
      length: z.string().describe("Desired length (short, medium, long)"),
      keywords: z.array(z.string()).optional().describe("Optional keywords to include"),
    }),
    func: async ({ platform, topic, tone, length, keywords }) => {
      // Would use a specialized content generation model in production
      return JSON.stringify({
        status: "pending_api_connection",
        message: "In production, this would use a specialized language model to generate content",
        details: {
          requestType: "content_generation",
          platform,
          topic,
          tone,
          length,
          keywords: keywords || [],
          requestedAt: new Date().toISOString()
        }
      });
    },
  });
};

/**
 * Helper functions to get tools by category
 */

export const getSocialMediaTools = () => {
  return [
    createTwitterPostTool(),
    createLinkedInPostTool(),
  ];
};

export const getSeoTools = () => {
  return [
    createKeywordAnalysisTool(),
    createContentOptimizerTool(),
  ];
};

export const getAnalyticsTools = () => {
  return [
    createAnalyticsTool(),
  ];
};

export const getContentTools = () => {
  return [
    createContentGeneratorTool(),
  ];
};

// Updated to work with the tool registry
export const getAllTools = () => {
  // Return both legacy tools and registered tools from the registry
  const legacyTools = [
    ...getSocialMediaTools(),
    ...getSeoTools(),
    ...getAnalyticsTools(),
    ...getContentTools(),
  ];
  
  // Get registered tools
  const registeredTools = Object.values(toolRegistry).map(tool => tool.getTool());
  
  return [...legacyTools, ...registeredTools];
};

export const getToolsByAgentType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'social':
      return getSocialMediaTools();
    case 'content':
      return getContentTools();
    case 'seo':
      return getSeoTools();
    case 'analytics':
      return getAnalyticsTools();
    case 'all':
      return getAllTools();
    default:
      return [];
  }
};

/**
 * Content generation tool for creating marketing copy
 */
export const contentGenerationTool: ToolRegistration = {
  id: "content-generator",
  name: "Content Generator",
  description: "Generates marketing content based on provided parameters",
  getTool: () => {
    return new DynamicStructuredTool({
      name: "generateContent",
      description: "Generate marketing content like blog posts, social media posts, etc.",
      schema: z.object({
        contentType: z.enum(["blog", "social", "email", "ad"]),
        topic: z.string().describe("The topic to create content about"),
        tone: z.enum(["professional", "casual", "humorous", "persuasive"]).optional(),
        length: z.enum(["short", "medium", "long"]).optional(),
        targetAudience: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      }),
      func: async ({
        contentType,
        topic,
        tone = "professional",
        length = "medium",
        targetAudience,
        keywords,
      }) => {
        // Would use specialized content generation service in production
        return JSON.stringify({
          status: "pending_api_connection",
          message: "In production, this would use a specialized language model to generate content",
          details: {
            requestType: "specialized_content_generation",
            contentType,
            topic,
            tone,
            length,
            targetAudience: targetAudience || "general",
            keywords: keywords || [],
            lengthEstimate: length === "short" ? "100-300 words" : length === "medium" ? "300-800 words" : "800+ words",
            requestedAt: new Date().toISOString()
          }
        });
      },
    });
  }
};

/**
 * Social Media Scheduler Tool
 */
export const socialMediaSchedulerTool: ToolRegistration = {
  id: "social-scheduler",
  name: "Social Media Scheduler",
  description: "Schedules posts on social media platforms",
  getTool: () => {
    return new DynamicStructuredTool({
      name: "scheduleSocialPost",
      description: "Schedule a post on social media platforms",
      schema: z.object({
        platform: z.enum(["twitter", "facebook", "instagram", "linkedin"]),
        content: z.string().describe("The content to post"),
        scheduledTime: z.string().describe("ISO datetime string for when to publish"),
        mediaUrls: z.array(z.string()).optional(),
        hashtags: z.array(z.string()).optional(),
      }),
      func: async ({ platform, content, scheduledTime, mediaUrls, hashtags }) => {
        // Would connect to social media API or scheduling service in production
        return JSON.stringify({
          status: "pending_api_connection",
          message: "In production, this would connect to a social media scheduling API",
          details: {
            requestType: "social_media_scheduling",
            platform,
            contentPreview: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            contentLength: content.length,
            scheduledTime,
            mediaCount: mediaUrls?.length || 0,
            hashtags: hashtags || [],
            requestedAt: new Date().toISOString()
          }
        });
      },
    });
  }
};

/**
 * Competitor Analysis Tool
 */
export const competitorAnalysisTool: ToolRegistration = {
  id: "competitor-analysis",
  name: "Competitor Analysis",
  description: "Analyzes competitor content and strategies",
  getTool: () => {
    return new DynamicStructuredTool({
      name: "analyzeCompetitor",
      description: "Analyze competitor content and marketing strategies",
      schema: z.object({
        competitorName: z.string().describe("Name of the competitor to analyze"),
        competitorUrl: z.string().describe("URL of the competitor's website or content"),
        aspectToAnalyze: z.enum(["content", "seo", "social", "design"]),
      }),
      func: async ({ competitorName, competitorUrl, aspectToAnalyze }) => {
        // Would use web scraping and AI analysis in production
        return JSON.stringify({
          status: "pending_api_connection",
          message: "In production, this would use web scraping and AI analysis tools",
          details: {
            requestType: "competitor_analysis",
            competitor: competitorName,
            url: competitorUrl,
            aspect: aspectToAnalyze,
            analysisScope: `Analysis of ${aspectToAnalyze} strategy and implementation`,
            requestedAt: new Date().toISOString()
          }
        });
      },
    });
  }
};

// Register all tools
[contentGenerationTool, socialMediaSchedulerTool, competitorAnalysisTool].forEach(tool => {
  toolRegistry[tool.id] = tool;
});

/**
 * Get a registered tool by ID
 */
export function getToolById(id: string): ToolRegistration | undefined {
  return toolRegistry[id];
}

/**
 * Register a new tool
 */
export function registerTool(tool: ToolRegistration): void {
  toolRegistry[tool.id] = tool;
} 