"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { FaTools, FaCaretDown, FaCaretUp } from "react-icons/fa";

// Define the form schema with Zod
const agentFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  type: z.enum(["content", "social", "seo", "analytics", "custom"]),
  model: z.string().min(1, { message: "Please select a model" }),
  temperature: z.number().min(0).max(1),
  systemPrompt: z.string().min(10, { message: "System prompt must be at least 10 characters" }),
  selectedTools: z.array(z.string()).optional(),
  memory: z.boolean(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

// Define props for the component
interface AgentFormProps {
  initialData?: AgentFormValues & { id?: string };
  isEdit?: boolean;
}

// Update the AVAILABLE_TOOLS with our registered tools
const AVAILABLE_TOOLS = {
  social: [
    { id: "twitter_post", name: "Twitter/X Post", description: "Create and schedule tweets" },
    { id: "linkedin_post", name: "LinkedIn Post", description: "Create and schedule LinkedIn posts" },
    { id: "social-scheduler", name: "Social Media Scheduler", description: "Schedule posts on social media platforms" },
  ],
  seo: [
    { id: "keyword_analysis", name: "Keyword Analysis", description: "Research and analyze SEO keywords" },
    { id: "content_optimizer", name: "Content Optimizer", description: "Optimize content for SEO" },
  ],
  analytics: [
    { id: "analytics_data", name: "Analytics Data", description: "Fetch and analyze website metrics" },
  ],
  content: [
    { id: "generate_content", name: "Content Generator", description: "Generate content for various platforms" },
    { id: "content-generator", name: "Advanced Content Generator", description: "Generates marketing content based on provided parameters" },
  ],
  research: [
    { id: "competitor-analysis", name: "Competitor Analysis", description: "Analyzes competitor content and strategies" },
  ],
};

export default function AgentForm({ initialData, isEdit = false }: AgentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);

  // Set up form with react-hook-form and zod validation
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      type: "content",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      systemPrompt: "You are a helpful AI assistant that specializes in marketing tasks.",
      selectedTools: [],
      memory: true,
    },
  });

  // Add these updated default system prompts
  const defaultSystemPrompts: Record<string, string> = {
    content: "You are an expert content creator with deep knowledge of marketing best practices. Your goal is to help create engaging and effective content for various marketing channels. You have access to tools that allow you to generate and optimize content based on marketing requirements.",
    social: "You are a social media expert who understands audience engagement, trending topics, and effective social media strategies across platforms. Your goal is to help create, optimize, and schedule social media content that drives engagement and meets marketing objectives.",
    seo: "You are an SEO specialist who can optimize content to rank well on search engines while maintaining readability and value for human readers. You have access to tools for keyword research and content optimization. Your goal is to improve search visibility and organic traffic.",
    analytics: "You are a marketing analytics expert who can analyze data, identify trends, and provide actionable insights to improve marketing performance. Your goal is to help users understand their data and make data-driven marketing decisions.",
    research: "You are a market research specialist with expertise in competitor analysis, market trends, and consumer behavior. Your goal is to provide strategic insights that can inform marketing strategies and campaigns.",
    custom: "You are a specialized marketing AI assistant. Provide expert guidance based on your configuration and the tools you have access to.",
  };

  // Update system prompt when type changes
  const onTypeChange = (type: string) => {
    // Only update system prompt if it's empty or matches a previous default
    const currentPrompt = form.getValues("systemPrompt");
    const isDefaultPrompt = Object.values(defaultSystemPrompts).includes(currentPrompt);
    
    if (isDefaultPrompt || !currentPrompt) {
      form.setValue("systemPrompt", defaultSystemPrompts[type as keyof typeof defaultSystemPrompts]);
    }
    
    // Set default tools for this type
    if (type !== "custom") {
      const defaultTools = AVAILABLE_TOOLS[type as keyof typeof AVAILABLE_TOOLS]?.map(tool => tool.id) || [];
      form.setValue("selectedTools", defaultTools);
    } else {
      // For custom type, don't automatically select tools
      form.setValue("selectedTools", []);
    }
  };

  // Toggle a tool selection
  const toggleTool = (toolId: string) => {
    const currentTools = form.getValues("selectedTools") || [];
    if (currentTools.includes(toolId)) {
      form.setValue("selectedTools", currentTools.filter(id => id !== toolId));
    } else {
      form.setValue("selectedTools", [...currentTools, toolId]);
    }
  };

  // Handle form submission
  const onSubmit = async (data: AgentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Construct request URL and method based on edit mode
      const url = isEdit && initialData?.id 
        ? `/api/agents/${initialData.id}` 
        : "/api/agents";
      
      const method = isEdit ? "PATCH" : "POST";
      
      // Send the data to the API
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save agent");
      }
      
      // Show success message and redirect
      toast.success(isEdit ? "Agent updated successfully" : "Agent created successfully");
      router.push("/dashboard/agents/agents");
      router.refresh();
    } catch (error) {
      console.error("Error saving agent:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current selected tools
  const selectedTools = form.watch("selectedTools") || [];
  const currentType = form.watch("type");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name field */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Agent Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Content Creator"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          {/* Type field */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Agent Type
            </label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...form.register("type")}
              onChange={(e) => {
                form.setValue("type", e.target.value as z.infer<typeof agentFormSchema>["type"]);
                onTypeChange(e.target.value);
              }}
            >
              <option value="content">Content Creation</option>
              <option value="social">Social Media</option>
              <option value="seo">SEO Optimization</option>
              <option value="analytics">Analytics</option>
              <option value="custom">Custom</option>
            </select>
            {form.formState.errors.type && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.type.message}</p>
            )}
          </div>
          
          {/* Description field */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe what this agent does..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Tools Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Agent Tools</h3>
          <button 
            type="button"
            onClick={() => setShowToolSelector(!showToolSelector)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <FaTools className="h-4 w-4" />
            <span>{showToolSelector ? "Hide Tools" : "Configure Tools"}</span>
            {showToolSelector ? <FaCaretUp /> : <FaCaretDown />}
          </button>
        </div>
        
        {showToolSelector && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Select the tools this agent can use. {currentType !== "custom" && "Default tools for this agent type are pre-selected."}
            </p>
            
            <div className="space-y-4">
              {Object.entries(AVAILABLE_TOOLS).map(([category, tools]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium capitalize">{category} Tools</h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {tools.map((tool) => (
                      <div key={tool.id} className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id={`tool-${tool.id}`}
                          checked={selectedTools.includes(tool.id)}
                          onChange={() => toggleTool(tool.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`tool-${tool.id}`} className="text-sm">
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-gray-500">{tool.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!showToolSelector && selectedTools.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTools.map(toolId => {
              // Find the tool details from available tools
              let toolLabel = toolId;
              for (const category in AVAILABLE_TOOLS) {
                const found = AVAILABLE_TOOLS[category as keyof typeof AVAILABLE_TOOLS].find(t => t.id === toolId);
                if (found) {
                  toolLabel = found.name;
                  break;
                }
              }
              
              return (
                <span key={toolId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {toolLabel}
                </span>
              );
            })}
          </div>
        )}
        
        {!showToolSelector && selectedTools.length === 0 && (
          <p className="text-sm text-gray-500">
            No tools selected. This agent will only be able to respond with text.
          </p>
        )}
      </div>
      
      {/* Model Settings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">AI Model Settings</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Model selection */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Language Model
            </label>
            <select
              id="model"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...form.register("model")}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, lower cost)</option>
              <option value="gpt-4o">GPT-4o (More capable, higher cost)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Balance of capability and cost)</option>
            </select>
            {form.formState.errors.model && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.model.message}</p>
            )}
          </div>
          
          {/* Temperature setting */}
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
              Temperature: {form.watch("temperature")}
            </label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="mt-1 block w-full"
              {...form.register("temperature", { valueAsNumber: true })}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Precise (0)</span>
              <span>Balanced (0.5)</span>
              <span>Creative (1)</span>
            </div>
            {form.formState.errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.temperature.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* System Prompt Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">System Prompt</h3>
        <p className="text-sm text-gray-500">
          This tells the AI how to behave and what its role is. Be specific about the agent&apos;s expertise and responsibilities.
        </p>
        
        <div>
          <textarea
            id="systemPrompt"
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono p-4 resize-y min-h-[150px] whitespace-pre-wrap"
            style={{ tabSize: 2 }}
            {...form.register("systemPrompt")}
          />
          {form.formState.errors.systemPrompt && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.systemPrompt.message}</p>
          )}
        </div>
      </div>
      
      {/* Memory Configuration Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Advanced Configuration</h3>
        
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="memory"
            checked={form.watch("memory")}
            onChange={(e) => form.setValue("memory", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="memory" className="text-sm">
            <div className="font-medium">Enable Memory</div>
            <div className="text-gray-500">
              This allows the agent to remember previous conversations and maintain context across sessions.
            </div>
          </label>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="pt-5 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => router.push("/dashboard/agents/agents")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Agent' : 'Create Agent'}
          </button>
        </div>
      </div>
    </form>
  );
} 