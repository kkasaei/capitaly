"use client";

import Link from "next/link";
import { FaRobot, FaNetworkWired, FaBolt, FaPlay, FaCalendar, FaInfoCircle } from "react-icons/fa";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/react";
import { useUser, useAuth } from "@clerk/nextjs";

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
    config: Record<string, unknown>;
  }>;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();

  // Use tRPC hooks to fetch real data
  const { data: agents } = api.agent.getAll.useQuery(undefined, {
    enabled: isSignedIn
  });

  const { data: workflows } = api.workflow.getAll.useQuery(undefined, {
    enabled: isSignedIn
  });

  const { data: recentRuns, isLoading: loadingRuns } = api.agent.getAllRuns.useQuery(undefined, {
    enabled: isSignedIn
  });

  const { data: scheduledWorkflows, isLoading: loadingScheduled } = api.workflow.getAll.useQuery(undefined, {
    enabled: isSignedIn
  }) as { data: Workflow[] | undefined, isLoading: boolean };

  useEffect(() => {
    // If the user is not authenticated and the auth state is loaded, redirect to login
    if (isLoaded && !isSignedIn) {
      router.push("/auth/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while session is being fetched
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  // Calculate stats based on real data
  const stats = [
    {
      name: "Active Agents",
      value: agents?.length.toString() || "0",
      icon: FaRobot,
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Workflows",
      value: workflows?.length.toString() || "0",
      icon: FaNetworkWired,
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Runs Today",
      value: recentRuns?.filter((run: { startedAt: string | number | Date; }) =>
        new Date(run.startedAt).toDateString() === new Date().toDateString()
      ).length.toString() || "0",
      icon: FaBolt,
      color: "bg-green-100 text-green-800"
    },
  ];

  // Filter to most recent runs (up to 3)
  const formattedRecentRuns = recentRuns?.slice(0, 3).map((run: { id: string; agent?: { name: string }; status: string; startedAt: string | Date; output?: { text?: string } }) => ({
    id: run.id,
    name: run.agent?.name || "Unknown Agent",
    type: "Agent",
    status: run.status,
    date: formatDate(run.startedAt),
    result: run.output ?
      (typeof run.output === 'object' && 'text' in run.output) ?
        String(run.output.text).substring(0, 30) + (String(run.output.text).length > 30 ? '...' : '') :
        "Completed" :
      "No output",
  })) || [];

  // Filter scheduled workflows (simplified approach)
  const formattedScheduled = scheduledWorkflows
    ?.filter((wf: Workflow) => wf.steps?.length > 0)
    .slice(0, 2)
    .map(wf => ({
      id: wf.id,
      name: wf.name,
      schedule: "Scheduled workflow",
      nextRun: "Upcoming",
    })) || [];

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Agents
          </h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard/agents/builder/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              New Agent
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className={`rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-5">
                <dt className="truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Recent Runs</h2>
              <Link
                href="/dashboard/agents/history"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 flow-root">
              {loadingRuns ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : formattedRecentRuns.length > 0 ? (
                <ul className="-my-5 divide-y divide-gray-200">
                  {formattedRecentRuns.map((run: { id: string; name: string; type: string; status: string; date: string; result: string }) => (
                    <li key={run.id} className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <FaPlay className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {run.name}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {run.type} · {run.status} · {run.date}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${run.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : run.status === "RUNNING"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {run.result}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <FaPlay className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No recent runs</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by running an agent.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/agents/agents"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      Go to Agents
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">Scheduled Runs</h2>
              <Link
                href="/dashboard/agents/workflows"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Configure
              </Link>
            </div>
            <div className="mt-6 flow-root">
              {loadingScheduled ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : formattedScheduled.length > 0 ? (
                <ul className="-my-5 divide-y divide-gray-200">
                  {formattedScheduled.map((scheduled) => (
                    <li key={scheduled.id} className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <FaCalendar className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {scheduled.name}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {scheduled.schedule}
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {scheduled.nextRun}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <FaCalendar className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No scheduled workflows</h3>
                  <p className="mt-1 text-sm text-gray-500">Create a workflow with a schedule to automate your tasks.</p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/agents/agents/new"
                      className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                    >
                      Create Workflow
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How To Use Section */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">How to Use the Platform</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">1. Create Agents</h3>
              <p className="text-sm text-gray-500">Start by creating AI agents with specific capabilities for your marketing tasks.</p>
              <Link href="/dashboard/agents/agents/new" className="mt-3 text-sm text-blue-600 hover:text-blue-500 block">
                Create an Agent →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">2. Build Workflows</h3>
              <p className="text-sm text-gray-500">Connect agents together in workflows to automate complex marketing processes.</p>
              <Link href="/dashboard/agents/workflows/new" className="mt-3 text-sm text-blue-600 hover:text-blue-500 block">
                Create a Workflow →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">3. Schedule & Monitor</h3>
              <p className="text-sm text-gray-500">Set up schedules, run workflows, and track performance in the dashboard.</p>
              <Link href="/dashboard/agents/history" className="mt-3 text-sm text-blue-600 hover:text-blue-500 block">
                View Run History →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

// Helper function to format dates
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default DashboardPage; 