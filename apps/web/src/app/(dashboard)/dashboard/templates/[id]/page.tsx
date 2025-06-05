"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Zap, Bot, Settings, Play, Star, Globe, Layers, GitFork, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  BaseEdge,
  EdgeProps,
  getBezierPath,
  BackgroundVariant,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import WorkflowGraph from '@/components/workflows/workflow-graph';
import { nodeTypes } from '@/components/journeys/nodes';
import { CustomEdge } from '@/components/journeys/edges/CustomEdge';

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    icon: string;
    color: string;
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  config: object;
  createdAt: string;
  updatedAt: string;
  bannerImage: string;
  categories: string[];
  forks: number;
  agents: {
    id: string;
    name: string;
    description: string;
    avatar: string;
  }[];
  models: {
    id: string;
    name: string;
    provider: string;
  }[];
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflows: {
    id: string;
    name: string;
    description: string;
  }[];
}

const mockTemplate = {
  id: "1",
  name: "Capitaly.vc Content Publisher",
  description: "Automated content publishing workflow that generates, optimizes, and publishes content to Webflow while monitoring performance through Google Search Console.",
  prompt: `You are a content publishing assistant for Capitaly.vc. Your role is to:

1. Research and identify trending topics in venture capital and startup ecosystem
2. Generate high-quality, SEO-optimized content
3. Format content for Webflow publishing
4. Monitor content performance through Google Search Console
5. Adjust content strategy based on performance metrics

Always maintain a professional tone while being informative and engaging. Focus on providing value to the venture capital and startup community.`,
  config: {
    "version": "1.0",
    "settings": {
      "temperature": 0.7,
      "max_tokens": 2000,
      "response_format": "structured"
    },
    "integrations": {
      "webflow": {
        "enabled": true,
        "auto_publish": true,
        "content_types": ["blog", "news", "insights"]
      },
      "google_search_console": {
        "enabled": true,
        "metrics": ["clicks", "impressions", "ctr", "position"]
      }
    },
    "workflows": {
      "content_generation": {
        "trigger": "daily",
        "actions": ["research_topics", "generate_content", "validate_content"]
      },
      "content_validation": {
        "trigger": "content_generated",
        "actions": ["check_quality", "provide_feedback"],
        "conditions": {
          "quality_threshold": 0.8,
          "max_iterations": 3
        }
      },
      "publishing": {
        "trigger": "content_validated",
        "actions": ["format_webflow", "publish_content"]
      },
      "performance_monitoring": {
        "trigger": "daily",
        "actions": ["fetch_metrics", "analyze_performance", "adjust_strategy"]
      }
    }
  },
  createdAt: "2024-03-20T00:00:00Z",
  updatedAt: "2024-03-20T00:00:00Z",
  bannerImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  categories: ["Content Publishing", "SEO", "Automation"],
  forks: 847,
  agents: [
    {
      id: "1",
      name: "Content Researcher",
      description: "Researches trending topics and generates content ideas",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1"
    },
    {
      id: "2",
      name: "SEO Optimizer",
      description: "Optimizes content for search engines",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=2"
    },
    {
      id: "3",
      name: "Webflow Publisher",
      description: "Formats and publishes content to Webflow",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=3"
    },
    {
      id: "4",
      name: "Performance Analyst",
      description: "Analyzes content performance and suggests improvements",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=4"
    },
    {
      id: "5",
      name: "Content Validator",
      description: "Validates content quality and ensures it meets standards",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=5"
    }
  ],
  models: [
    {
      id: "1",
      name: "GPT-4",
      provider: "OpenAI"
    },
    {
      id: "2",
      name: "Claude 3",
      provider: "Anthropic"
    }
  ],
  nodes: [
    {
      id: "start",
      type: "trigger",
      position: { x: 100, y: 200 },
      data: { label: "Daily Trigger", icon: "🕒", color: "#10b981" }
    },
    {
      id: "research",
      type: "process",
      position: { x: 300, y: 200 },
      data: { label: "Topic Research", icon: "🔍", color: "#3b82f6" }
    },
    {
      id: "generate",
      type: "process",
      position: { x: 500, y: 200 },
      data: { label: "Content Generation", icon: "✍️", color: "#8b5cf6" }
    },
    {
      id: "validate",
      type: "decision",
      position: { x: 700, y: 200 },
      data: { label: "Quality Check", icon: "✅", color: "#f59e0b" }
    },
    {
      id: "optimize",
      type: "process",
      position: { x: 900, y: 200 },
      data: { label: "SEO Optimization", icon: "🎯", color: "#f59e0b" }
    },
    {
      id: "publish",
      type: "process",
      position: { x: 1100, y: 200 },
      data: { label: "Webflow Publish", icon: "🚀", color: "#ef4444" }
    },
    {
      id: "monitor",
      type: "process",
      position: { x: 1300, y: 200 },
      data: { label: "Performance Monitor", icon: "📊", color: "#14b8a6" }
    }
  ],
  edges: [
    { id: "e1", source: "start", target: "research" },
    { id: "e2", source: "research", target: "generate" },
    { id: "e3", source: "generate", target: "validate" },
    { id: "e4", source: "validate", target: "optimize" },
    { id: "e5", source: "validate", target: "research", type: "feedback" },
    { id: "e6", source: "optimize", target: "publish" },
    { id: "e7", source: "publish", target: "monitor" }
  ],
  workflows: [
    {
      id: "1",
      name: "Daily Content Generation",
      description: "Automatically generates and publishes new content daily"
    },
    {
      id: "2",
      name: "Performance Optimization",
      description: "Monitors and optimizes content performance"
    }
  ]
};

const CustomNode = ({ data }: { data: { label: string; icon: string; color: string } }) => {
  return (
    <div
      className="px-4 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm text-white font-medium text-sm flex items-center space-x-2 min-w-[120px] justify-center"
      style={{ 
        backgroundColor: `${data.color}20`,
        borderColor: data.color,
        boxShadow: `0 0 20px ${data.color}40`
      }}
    >
      <span className="text-lg">{data.icon}</span>
      <span>{data.label}</span>
    </div>
  );
};

export default function GlamorousTemplateDetails() {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visual');
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTemplate(mockTemplate);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Loading template...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Template Not Found</h2>
          <p className="text-gray-600 mb-6">The template you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/dashboard/templates')}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Return to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard/templates')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Templates
          </button>

          {/* Hero Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-lg font-medium text-gray-900">{template.name}</h1>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <GitFork className="h-4 w-4" />
                    <span className="font-semibold">{template.forks.toLocaleString()}</span>
                    <span className="text-sm">forks</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                  <Play className="mr-1.5 h-4 w-4" />
                  Use Template
                </button>
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <GitFork className="mr-1.5 h-4 w-4" />
                  Fork
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit mb-8">
            {[
              { id: 'visual', label: 'Visual', icon: Eye },
              { id: 'prompt', label: 'Prompt', icon: Star },
              { id: 'config', label: 'Config', icon: Settings },
              { id: 'agents', label: 'Agents', icon: Bot },
              { id: 'workflows', label: 'Workflows', icon: Zap }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-1.5 h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'visual' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Workflow Visualization</h3>
                <div className="relative bg-gray-50 rounded-lg p-6 min-h-[500px] overflow-hidden">
                  <div style={{ width: '100%', height: '600px' }}>
                    <ReactFlow
                      nodes={template.nodes.map(node => ({
                        id: node.id,
                        type: node.type,
                        position: node.position,
                        data: node.data,
                        sourcePosition: Position.Right,
                        targetPosition: Position.Left,
                      }))}
                      edges={template.edges.map(edge => ({
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        type: 'smoothstep',
                      }))}
                      nodeTypes={nodeTypes}
                      edgeTypes={{ smoothstep: (props: any) => <CustomEdge {...props} isSidebarOpened={false} setIsSidebarOpened={() => {}} /> }}
                      fitView
                      minZoom={0.5}
                      maxZoom={2}
                      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    >
                      <Background id="1" gap={20} variant={BackgroundVariant.Dots} />
                      <Controls />
                    </ReactFlow>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prompt' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-6">System Prompt</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {template.prompt}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Configuration</h3>
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{JSON.stringify(template.config, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-6">AI Agents</h3>
                <div className="space-y-4">
                  {template.agents.map((agent) => (
                    <div key={agent.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bot className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                        <p className="text-sm text-gray-600">{agent.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'workflows' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Workflows</h3>
                <div className="space-y-4">
                  {template.workflows.map((workflow) => (
                    <div key={workflow.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">{workflow.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Models */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Models</h3>
              <div className="space-y-3">
                {template.models.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{model.name}</span>
                    <span className="text-sm text-gray-500">{model.provider}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Template Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">Mar 20, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated</span>
                  <span className="text-gray-900">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agents</span>
                  <span className="text-gray-900">{template.agents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Workflows</span>
                  <span className="text-gray-900">{template.workflows.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}