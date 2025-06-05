"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import AgentForm from "@/components/agents/agent-form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { FC } from "react";

// Define Agent type based on the form schema
type Agent = {
  id: string;
  name: string;
  description: string;
  type: "content" | "social" | "seo" | "analytics" | "custom";
  model: string;
  temperature: number;
  systemPrompt: string;
  memory: boolean;
  selectedTools?: string[];
};

const EditAgentPage: FC = () => {
  const params = useParams();
  const agentId = params.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from your API
        const response = await fetch(`/api/agents/${agentId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch agent");
        }
        
        const data = await response.json();
        setAgent(data);
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError("Could not load agent data. Please try again later.");
        toast.error("Error loading agent data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Error</h2>
        <p className="mt-2 text-gray-600">{error || "Agent not found"}</p>
        <Link
          href="/dashboard/agents/agents"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard/agents/agents"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Agent</h1>
        <p className="text-sm text-gray-500">
          Update your agent&apos;s configuration and capabilities.
        </p>
      </div>

      <AgentForm 
        initialData={agent} 
        isEdit={true} 
      />
    </div>
  );
}

export default EditAgentPage; 