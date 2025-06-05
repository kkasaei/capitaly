"use client";

import Link from "next/link";
import { FaArrowLeft, FaLightbulb, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AgentForm from "@/components/agents/agent-form";
import { useState } from "react";

export default function NewAgentPage() {
  const [isExpanded, setIsExpanded] = useState(true);

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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Create New Agent</h1>
        <p className="text-sm text-gray-500">
          Configure an AI agent for your marketing tasks using LangChain and LangGraph technology.
        </p>
      </div>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <FaLightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="w-full">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-sm font-medium text-blue-800">Marketing Agent Platform</h3>
              <button className="text-blue-600 hover:text-blue-800">
                {isExpanded ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {isExpanded && (
              <>
                <p className="mt-1 text-sm text-blue-700">
                  This platform uses LangChain for agent capabilities and LangGraph for workflow orchestration. Agents can be:
                </p>
                <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li><strong>Content Agents:</strong> Generate blog posts, product descriptions, and marketing copy</li>
                  <li><strong>Social Media Agents:</strong> Create and schedule content for various platforms</li>
                  <li><strong>SEO Agents:</strong> Analyze and optimize content for search engines</li>
                  <li><strong>Analytics Agents:</strong> Process data and generate actionable insights</li>
                  <li><strong>Custom Agents:</strong> Build specialized agents with your choice of tools</li>
                </ul>
                <p className="mt-2 text-sm text-blue-700">
                  Each agent can use specialized tools based on its type, and multiple agents can be combined into workflows.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <AgentForm />
    </div>
  );
} 