/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { FaArrowLeft, FaNetworkWired } from "react-icons/fa";
import WorkflowBuilder from "@/components/workflows/workflow-builder";
import { api } from "@/lib/trpc/react";
import { useMemo, useState } from "react";
import { InfoCallout } from "@/components/ui/info-callout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the Agent type expected by WorkflowBuilder
type WorkflowBuilderAgent = {
  id: string;
  name: string;
  description: string;
  type: string;
};

// Define form data types for type safety
interface WorkflowFormValues {
  name: string;
  description: string;
  schedule?: string;
  isActive: boolean;
}

interface WorkflowStepData {
  id: string; // Client-side ID
  agentId: string;
  order: number;
  config: Record<string, unknown>;
}

export default function NewWorkflowPage() {
  const router = useRouter();
  const { data: apiAgents = [], isLoading } = api.agent.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });
  const [workflowTimezone, setWorkflowTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  
  const utils = api.useUtils();
  const createWorkflow = api.workflow.create.useMutation({
    onSuccess: () => {
      utils.workflow.getAll.invalidate();
      toast.success("Workflow created successfully");
      router.push("/dashboard/agents/workflows");
    },
    onError: (error) => {
      toast.error(`Failed to create workflow: ${error.message}`);
    }
  });

  // Transform API agents to the format expected by WorkflowBuilder
  const agents: WorkflowBuilderAgent[] = useMemo(() => {
    return apiAgents.map((agent: { id: any; name: any; description: any; type: any; }) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description || "", // Convert null to empty string
      type: agent.type
    }));
  }, [apiAgents]);

  // Handle timezone changes from the schedule builder
  const handleTimezoneChange = (timezone: string) => {
    setWorkflowTimezone(timezone);
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard/agents/workflows"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Create New Workflow</h1>
        <p className="text-sm text-gray-500">
          Design automated marketing workflows by connecting multiple agents together with LangGraph.
        </p>
      </div>

      <InfoCallout 
        title="Marketing Workflow Builder" 
        icon={<FaNetworkWired className="h-5 w-5 text-blue-600" />}
        defaultOpen={false}
      >
        <p className="mt-1 text-sm text-blue-700">
          Create powerful multi-step workflows that combine different specialized agents to automate marketing tasks:
        </p>
        <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li><strong>Content Creation Pipeline:</strong> Generate, optimize, and publish content across platforms</li>
          <li><strong>Social Media Campaign:</strong> Research, create, and schedule social media content</li>
          <li><strong>Competitor Analysis:</strong> Monitor and analyze competitor activities</li>
          <li><strong>SEO Optimization:</strong> Analyze and improve content for search engines</li>
          <li><strong>Marketing Analytics:</strong> Collect, analyze, and report on marketing performance</li>
        </ul>
        <p className="mt-2 text-sm text-blue-700">
          Define workflow steps, configure agent connections, and set up scheduling for full marketing automation.
        </p>
      </InfoCallout>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 bg-white p-6 rounded-lg shadow">
          <FaNetworkWired className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No agents available</h3>
          <p className="mt-2 text-gray-500">
            You need to create at least one agent before you can build a workflow.
          </p>
          <Link
            href="/dashboard/agents/agents/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Agent
          </Link>
        </div>
      ) : (
        <WorkflowBuilder 
          agents={agents}
          initialData={{
            name: "",
            description: "",
            steps: []
          }}
          onSubmit={(data: WorkflowFormValues, steps: WorkflowStepData[]) => {
            // Add timezone info to the description to avoid schema issues
            let enhancedDescription = data.description;
            if (workflowTimezone) {
              enhancedDescription += `\n\nTimezone: ${workflowTimezone}`;
            }
            
            // Create the workflow with proper data structure
            const workflowData = {
              name: data.name,
              description: enhancedDescription,
              schedule: data.schedule,
              isActive: data.isActive || true,
              // Map steps removing client-side IDs
              steps: steps.map(({ id, ...step }) => ({
                agentId: step.agentId,
                order: step.order,
                config: step.config || {}
              }))
            };
            
            // Call the create mutation
            createWorkflow.mutate(workflowData);
          }}
          onTimezoneChange={handleTimezoneChange}
        />
      )}
    </div>
  );
} 