"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FaPlus, FaNetworkWired, FaPlay, FaPause, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { api } from "@/lib/trpc/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { WorkflowScheduleDisplay } from "@/components/ui/workflow-schedule-display";
// import type { Prisma } from "@repo/database";

interface Workflow {
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
    config: any; //Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const WorkflowsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // TRPC queries and mutations
  const utils = api.useUtils();
  const { data: workflows = [], isLoading } = api.workflow.getAll.useQuery(undefined, {
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
  });
  const { mutate: toggleActive } = api.workflow.update.useMutation({
    onSuccess: () => {
      utils.workflow.getAll.invalidate();
      toast.success("Workflow updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating workflow: ${error.message}`);
    },
  });
  const { mutate: deleteWorkflow } = api.workflow.delete.useMutation({
    onSuccess: () => {
      utils.workflow.getAll.invalidate();
      toast.success("Workflow deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting workflow: ${error.message}`);
    },
  });
  const { mutate: runWorkflow, isPending: isRunning } = api.workflow.run.useMutation({
    onSuccess: () => {
      toast.success("Workflow started successfully");
    },
    onError: (error) => {
      toast.error(`Error running workflow: ${error.message}`);
    },
  });

  // Function to toggle workflow active state
  const toggleWorkflowState = (id: string, currentState: boolean) => {
    toggleActive({
      id,
      data: {
        isActive: !currentState,
        name: '', // These fields are required by the schema
        description: '',
      },
    });
  };

  // Function to handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      deleteWorkflow({ id });
    }
  };

  // Function to handle run
  const handleRun = (id: string) => {
    runWorkflow({ id });
  };

  // Filter workflows based on search query
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow: { name: string; description: string | null; schedule: string | null; }) => 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workflow.description && workflow.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (workflow.schedule && workflow.schedule.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [workflows, searchQuery]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredWorkflows.length / itemsPerPage));
  const paginatedWorkflows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredWorkflows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredWorkflows, currentPage, itemsPerPage]);

  // Create showing text for pagination
  const showingText = filteredWorkflows.length > 0 
    ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredWorkflows.length)} of ${filteredWorkflows.length} workflows`
    : "";

  // Format relative time
  const formatRelativeTime = (date: Date | null) => {
    if (!date) return "Never";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-y-1 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage automated marketing workflows.
          </p>
        </div>

        <div className="flex items-center gap-x-2">

        <Link
          href="/dashboard/builder"
          className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          <FaPlus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          Build Workflow
        </Link>
        <Link
          href="/dashboard/agents/workflows/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <FaPlus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          New Workflow
        </Link>
        </div>
   
      </div>

      <div className="mt-4 mb-6">
        <SearchInput
          value={searchQuery}
          onSearch={setSearchQuery}
          placeholder="Search workflows..."
        />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <FaSpinner className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading workflows...</span>
              </div>
            ) : paginatedWorkflows.length === 0 ? (
              <EmptyState
                icon={<FaNetworkWired className="h-10 w-10 text-purple-400" />}
                title="No workflows found"
                description={searchQuery ? "No workflows match your search criteria. Try a different search." : "Get started by creating your first workflow."}
                actionLabel={searchQuery ? "Clear search" : "New Workflow"}
                actionUrl={searchQuery ? undefined : "/dashboard/agents/workflows/new"}
                actionHandler={searchQuery ? () => setSearchQuery("") : undefined}
              />
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Schedule
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Steps
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Updated
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedWorkflows.map((workflow: { id: string; name: string; description: string | null; schedule: string | null; isActive: boolean; steps: Array<{ id: string; workflowId: string; agentId: string; order: number; config: any; createdAt: Date; updatedAt: Date; }>; updatedAt: Date; }) => (
                      <tr key={workflow.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-100">
                              <FaNetworkWired className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {workflow.name}
                              </div>
                              <div className="text-gray-500 max-w-xs truncate">
                                {workflow.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <WorkflowScheduleDisplay schedule={workflow.schedule} />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              workflow.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {workflow.isActive ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {workflow.steps.length}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatRelativeTime(workflow.updatedAt)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex space-x-2 justify-end">
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              onClick={() => handleRun(workflow.id)}
                              disabled={isRunning}
                            >
                              {isRunning ? (
                                <FaSpinner className="mr-1 h-4 w-4 text-gray-500 animate-spin" />
                              ) : (
                                <FaPlay className="mr-1 h-4 w-4 text-gray-500" />
                              )}
                              Run Now
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => toggleWorkflowState(workflow.id, workflow.isActive)}
                            >
                              {workflow.isActive ? (
                                <>
                                  <FaPause className="mr-1 h-4 w-4 text-yellow-500" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <FaPlay className="mr-1 h-4 w-4 text-green-500" />
                                  Activate
                                </>
                              )}
                            </button>
                            <Link
                              href={`/dashboard/agents/workflows/${workflow.id}/edit`}
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              <FaEdit className="mr-1 h-4 w-4 text-gray-500" />
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              onClick={() => handleDelete(workflow.id)}
                            >
                              <FaTrash className="mr-1 h-4 w-4 text-red-500" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredWorkflows.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={showingText}
        />
      )}
    </div>
  );
}

export default WorkflowsPage; 