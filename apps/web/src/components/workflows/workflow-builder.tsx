/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaPlus, FaMinus, FaArrowUp, FaArrowDown, FaCog } from "react-icons/fa";
import WorkflowGraph from "./workflow-graph";
import { ScheduleBuilder } from "@/components/ui/schedule-builder";

// Types
type Agent = {
  id: string;
  name: string;
  description: string;
  type: string;
};

type WorkflowStep = {
  id: string;
  agentId: string;
  order: number;
  config: Record<string, unknown>;
};

// Form schema
const workflowFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500),
  schedule: z.string().optional(),
  isActive: z.boolean(),
});

type WorkflowFormValues = z.infer<typeof workflowFormSchema>;

interface WorkflowBuilderProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    schedule?: string;
    isActive?: boolean;
    steps: WorkflowStep[];
  };
  agents: Agent[];
  isEdit?: boolean;
  onSubmit?: (formData: WorkflowFormValues, steps: WorkflowStep[]) => void;
  onTimezoneChange?: (timezone: string) => void;
}

export default function WorkflowBuilder({
  initialData,
  agents,
  isEdit = false,
  onSubmit: externalSubmit,
  onTimezoneChange
}: WorkflowBuilderProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialData?.steps || []);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  
  // Set up form with proper typing
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      schedule: initialData?.schedule || "",
      isActive: initialData?.isActive ?? true,
    },
  });
  
  // Generate graph data from steps
  const graphData = {
    nodes: steps.map((step) => {
      const agent = agents.find((a) => a.id === step.agentId);
      return {
        id: step.id,
        label: agent?.name || "Unknown Agent",
        type: agent?.type || "unknown",
      };
    }),
    edges: steps.slice(0, -1).map((step, index) => ({
      source: step.id,
      target: steps[index + 1].id,
    })),
  };
  
  // Store the timezone
  const [workflowTimezone, setWorkflowTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  
  // Add a step to the workflow
  const addStep = () => {
    // Create a unique ID for the step
    const newId = `step-${Date.now()}`;
    
    // If no agents available, show error
    if (agents.length === 0) {
      toast.error("No agents available. Please create an agent first.");
      return;
    }
    
    // Create a new step with the first available agent
    const newStep: WorkflowStep = {
      id: newId,
      agentId: agents[0].id,
      order: steps.length,
      config: {},
    };
    
    setSteps([...steps, newStep]);
    setSelectedStepId(newId);
  };
  
  // Remove a step from the workflow
  const removeStep = (id: string) => {
    const updatedSteps = steps
      .filter((step) => step.id !== id)
      .map((step, index) => ({ ...step, order: index }));
    
    setSteps(updatedSteps);
    
    if (selectedStepId === id) {
      setSelectedStepId(null);
    }
  };
  
  // Move a step up in the workflow
  const moveStepUp = (id: string) => {
    const index = steps.findIndex((step) => step.id === id);
    if (index <= 0) return;
    
    const updatedSteps = [...steps];
    [updatedSteps[index - 1], updatedSteps[index]] = [updatedSteps[index], updatedSteps[index - 1]];
    
    // Update order
    updatedSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(updatedSteps);
  };
  
  // Move a step down in the workflow
  const moveStepDown = (id: string) => {
    const index = steps.findIndex((step) => step.id === id);
    if (index >= steps.length - 1) return;
    
    const updatedSteps = [...steps];
    [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
    
    // Update order
    updatedSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(updatedSteps);
  };
  
  // Update a step's agent
  const updateStepAgent = (stepId: string, agentId: string) => {
    const updatedSteps = steps.map((step) => {
      if (step.id === stepId) {
        return { ...step, agentId };
      }
      return step;
    });
    
    setSteps(updatedSteps);
  };

  // Handle form submission
  const onSubmit = async (data: WorkflowFormValues) => {
    try {
      // Validate that there are steps
      if (steps.length === 0) {
        toast.error("Please add at least one step to the workflow");
        return;
      }
      
      setIsSubmitting(true);
      
      // If external submit handler is provided, use that
      if (externalSubmit) {
        externalSubmit(data, steps);
        toast.success(isEdit ? "Workflow updated successfully" : "Workflow created successfully");
        router.push("/dashboard/agents/workflows");
        return;
      }
      
      // Otherwise use the default behavior
      // Prepare data for API
      const workflowData = {
        ...data,
        steps: steps.map(({ id: _id, ...step }) => step), // Remove client-side IDs
      };
      
      // Determine URL and method based on edit mode
      const url = isEdit && initialData?.id
        ? `/api/workflows/${initialData.id}`
        : "/api/workflows";
      
      const method = isEdit ? "PATCH" : "POST";
      
      // Send request
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflowData),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message || "Failed to save workflow");
          });
        }
        
        // Success
        toast.success(isEdit ? "Workflow updated successfully" : "Workflow created successfully");
        router.push("/dashboard/agents/workflows");
        router.refresh();
      })
      .catch(error => {
        console.error("Error saving workflow:", error);
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  // Handle timezone changes from the schedule builder
  const handleTimezoneChange = (newTimezone: string) => {
    setWorkflowTimezone(newTimezone);
    if (onTimezoneChange) {
      onTimezoneChange(newTimezone);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Info Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Workflow Details</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name field */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Workflow Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Weekly Content Creation"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            {/* Schedule field with timezone support */}
            <div className="col-span-2 sm:col-span-1">
              <ScheduleBuilder 
                value={form.watch("schedule")} 
                onChange={(value) => form.setValue("schedule", value)}
                timezone={workflowTimezone}
                onTimezoneChange={handleTimezoneChange}
              />
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
                placeholder="Describe what this workflow does..."
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
              )}
            </div>
            
            {/* Active toggle */}
            <div className="col-span-2">
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...form.register("isActive")}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active (will run on schedule if set)
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Workflow Steps */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Workflow Steps</h2>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <FaPlus className="mr-1.5 h-4 w-4" />
            Add Step
          </button>
        </div>
        
        {steps.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              No steps added yet. Click &quot;Add Step&quot; to start building your workflow.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Graph visualization */}
            <div className="mb-6">
              <WorkflowGraph
                nodes={graphData.nodes}
                edges={graphData.edges}
                onNodeClick={setSelectedStepId}
                height={300}
              />
            </div>
            
            {/* Step list */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Steps</h3>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                {steps.map((step, index) => {
                  const agent = agents.find(a => a.id === step.agentId);
                  const isSelected = step.id === selectedStepId;
                  
                  return (
                    <li 
                      key={step.id} 
                      className={`p-4 ${isSelected ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedStepId(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {agent?.name || "Unknown Agent"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {agent?.type || "Unknown type"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => moveStepUp(step.id)}
                            disabled={index === 0}
                            className={`p-1 text-gray-500 ${index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStepDown(step.id)}
                            disabled={index === steps.length - 1}
                            className={`p-1 text-gray-500 ${index === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-700'}`}
                          >
                            <FaArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedStepId(step.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaCog className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <FaMinus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Step configuration when selected */}
                      {isSelected && (
                        <div className="mt-4 pl-11 border-t border-gray-200 pt-4">
                          <div className="space-y-4">
                            <div>
                              <label htmlFor={`agent-${step.id}`} className="block text-sm font-medium text-gray-700">
                                Agent
                              </label>
                              <select
                                id={`agent-${step.id}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={step.agentId}
                                onChange={(e) => updateStepAgent(step.id, e.target.value)}
                              >
                                {agents.map((agent) => (
                                  <option key={agent.id} value={agent.id}>
                                    {agent.name} ({agent.type})
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* Additional step configuration can be added here */}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end pt-5">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => router.push("/dashboard/agents/workflows")}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => form.handleSubmit(onSubmit)()}
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Workflow" : "Create Workflow"}
        </button>
      </div>
    </div>
  );
} 