/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaNetworkWired, FaSpinner } from "react-icons/fa";
import WorkflowBuilder from "@/components/workflows/workflow-builder";
import { toast } from "sonner";
import { api } from "@/lib/trpc/react";
import { InfoCallout } from "@/components/ui/info-callout";

// Define proper types for the workflow data structure
interface WorkflowFormValues {
  name: string;
  description: string;
  schedule?: string;
  isActive: boolean;
}

interface WorkflowStepData {
  id?: string;
  agentId: string;
  order: number;
  config: Record<string, unknown>;
}

interface WorkflowData {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  schedule: string | null;
  isActive: boolean;
  steps: Array<{
    id: string;
    workflowId: string;
    agentId: string;
    order: number;
    config: Record<string, unknown>;
  }>;
}

export default function EditWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;
  const [workflowTimezone, setWorkflowTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Fetch workflow and agent data with proper options to prevent excessive requests
  const { data: workflow, isLoading: workflowLoading } = 
    api.workflow.getById.useQuery({ id: workflowId }, {
      refetchOnWindowFocus: false, // Prevent refetching on window focus
      staleTime: 60000, // Consider data fresh for 1 minute
    });
  const { data: agents = [], isLoading: agentsLoading } = api.agent.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });
  
  // Loading state
  const isLoading = workflowLoading || agentsLoading;

  // Prepare update mutation
  const utils = api.useUtils();
  const updateWorkflow = api.workflow.update.useMutation({
    onSuccess: () => {
      toast.success("Workflow updated successfully");
      utils.workflow.getAll.invalidate();
      utils.workflow.getById.invalidate({ id: workflowId });
      router.push("/dashboard/agents/workflows");
    },
    onError: (error) => {
      toast.error(`Failed to update workflow: ${error.message}`);
    }
  });

  // Handle form submission with proper types
  const handleSubmit = (data: WorkflowFormValues, steps: WorkflowStepData[]) => {
    // Add timezone info to the description to avoid schema issues
    let enhancedDescription = data.description;
    if (workflowTimezone) {
      enhancedDescription += `\n\nTimezone: ${workflowTimezone}`;
    }
    
    // Prepare workflow data for submission
    const workflowData = {
      ...data,
      description: enhancedDescription,
      steps: steps.map(({ id, ...step }) => ({
        agentId: step.agentId,
        order: step.order,
        config: step.config || {}
      }))
    };
    
    // Call the update mutation
    updateWorkflow.mutate({
      id: workflowId,
      data: workflowData
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!workflow || !agents) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-3">
          Workflow or agents could not be loaded
        </div>
        <Link
          href="/dashboard/agents/workflows"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Workflows
        </Link>
      </div>
    );
  }

  // Prepare workflow data for the builder
  const workflowWithClientIds = {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description || "",
    schedule: workflow.schedule || "",
    isActive: workflow.isActive,
    steps: (workflow as WorkflowData).steps.map((step) => ({
      id: `step-${step.order}-${step.agentId}`,
      agentId: step.agentId,
      order: step.order,
      config: typeof step.config === 'object' ? step.config as Record<string, unknown> : {}
    }))
  };

  // Prepare agents data
  const formattedAgents = agents.map((agent: { id: any; name: any; description: any; type: any; }) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description || "",
    type: agent.type
  }));

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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Workflow</h1>
        <p className="text-sm text-gray-500">
          Update your marketing workflow configuration and LangGraph connections.
        </p>
      </div>

      <InfoCallout 
        title="Workflow Editor"
        icon={<FaNetworkWired className="h-5 w-5 text-blue-600" />}
        defaultOpen={false}
      >
        <p className="mt-1 text-sm text-blue-700">
          This interface allows you to modify your workflow configuration:
        </p>
        <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
          <li>Update basic workflow information</li>
          <li>Add, remove, or reorder workflow steps</li>
          <li>Configure agents and their integration points</li>
          <li>Modify scheduling and automation settings</li>
          <li>Set up data flow between agents in the LangGraph</li>
        </ul>
      </InfoCallout>

      {formattedAgents.length === 0 ? (
        <div className="text-center py-12 bg-white p-6 rounded-lg shadow">
          <FaNetworkWired className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No agents available</h3>
          <p className="mt-2 text-gray-500">
            You need to create at least one agent to edit this workflow.
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
          agents={formattedAgents}
          initialData={workflowWithClientIds}
          isEdit={true}
          onSubmit={handleSubmit}
          onTimezoneChange={setWorkflowTimezone}
        />
      )}
    </div>
  );
} 