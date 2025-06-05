"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Mail,
  MessageSquare,
  Database,
  FileText,
  ShoppingCart,
  Calendar,
  Users,
  Zap,
  Plus,
  Globe,
  Lock,
  Crown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  isPro: boolean;
  imageUrl: string;
  status: "connected" | "disconnected" | "pending";
  instances?: IntegrationInstance[];
}

interface IntegrationInstance {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "pending";
  connectedAt?: string;
  config?: Record<string, any>;
}

interface DisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  integrationName: string;
  instanceName: string;
}

function DisconnectModal({ isOpen, onClose, onConfirm, integrationName, instanceName }: DisconnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
          <h3 className="text-lg font-medium text-gray-900">Disconnect Integration</h3>
        </div>
        <p className="text-gray-500 mb-6">
          Are you sure you want to disconnect {instanceName} from {integrationName}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'connected'>('all');
  const [disconnectModal, setDisconnectModal] = useState<{
    isOpen: boolean;
    integrationId: string;
    instanceId: string;
    integrationName: string;
    instanceName: string;
  }>({
    isOpen: false,
    integrationId: '',
    instanceId: '',
    integrationName: '',
    instanceName: '',
  });
  const [integrations, setIntegrations] = useState<Integration[]>([
    // CMS
    {
      id: "wordpress",
      name: "WordPress",
      description: "Connect your WordPress site to automate content management",
      category: "cms",
      isPublic: true,
      isPro: false,
      imageUrl: "/integrations/wordpress.png",
      status: "disconnected",
      instances: []
    },
    {
      id: "webflow",
      name: "Webflow",
      description: "Integrate with Webflow for seamless website management",
      category: "cms",
      isPublic: true,
      isPro: true,
      imageUrl: "/integrations/webflow.png",
      status: "disconnected",
      instances: [
        {
          id: "webflow-1",
          name: "Main Website",
          status: "connected",
          connectedAt: "2024-03-20T10:00:00Z",
          config: { siteId: "123" }
        },
        {
          id: "webflow-2",
          name: "Blog Site",
          status: "connected",
          connectedAt: "2024-03-21T15:30:00Z",
          config: { siteId: "456" }
        }
      ]
    },
    // E-commerce
    {
      id: "shopify",
      name: "Shopify",
      description: "Connect your Shopify store for automated e-commerce workflows",
      category: "ecommerce",
      isPublic: true,
      isPro: true,
      imageUrl: "/integrations/shopify.png",
      status: "disconnected"
    },
    {
        id: "google-analytics",
        name: "Google Analytics",
        description: "Connect your Google Analytics account for automated e-commerce workflows",
        category: "analytics",
        isPublic: true,
        isPro: true,
        imageUrl: "/integrations/google-analytics.png",
        status: "disconnected"
      },
    
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    showPublic: true,
    showPrivate: true,
    showPro: true,
    showFree: true,
    categories: [] as string[],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: "cms", name: "CMS", icon: FileText },
    { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
    { id: "communication", name: "Communication", icon: MessageSquare },
    { id: "email", name: "Email", icon: Mail },
    { id: "database", name: "Database", icon: Database },
    { id: "calendar", name: "Calendar", icon: Calendar },
    { id: "crm", name: "CRM", icon: Users },
  ];

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVisibility = (integration.isPublic && filters.showPublic) || 
      (!integration.isPublic && filters.showPrivate);
    
    const matchesPlan = (integration.isPro && filters.showPro) || 
      (!integration.isPro && filters.showFree);

    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(integration.category);

    return matchesSearch && matchesVisibility && matchesPlan && matchesCategory;
  });

  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);
  const paginatedIntegrations = filteredIntegrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleDisconnect = (integrationId: string, instanceId: string, integrationName: string, instanceName: string) => {
    setDisconnectModal({
      isOpen: true,
      integrationId,
      instanceId,
      integrationName,
      instanceName,
    });
  };

  const confirmDisconnect = () => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === disconnectModal.integrationId) {
        return {
          ...integration,
          instances: integration.instances?.map(instance => {
            if (instance.id === disconnectModal.instanceId) {
              return {
                ...instance,
                status: 'disconnected',
                connectedAt: undefined,
              };
            }
            return instance;
          }),
        };
      }
      return integration;
    }));
    setDisconnectModal({ isOpen: false, integrationId: '', instanceId: '', integrationName: '', instanceName: '' });
  };

  const handleReconnect = (integrationId: string, instanceId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        return {
          ...integration,
          instances: integration.instances?.map(instance => {
            if (instance.id === instanceId) {
              return {
                ...instance,
                status: 'connected',
                connectedAt: new Date().toISOString(),
              };
            }
            return instance;
          }),
        };
      }
      return integration;
    }));
  };

  const handleDelete = (integrationId: string, instanceId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        return {
          ...integration,
          instances: integration.instances?.filter(instance => instance.id !== instanceId),
        };
      }
      return integration;
    }));
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <Link
            href="/dashboard/integrations/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Integration
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>

              {/* Visibility Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Visibility</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showPublic: !prev.showPublic }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showPublic ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Public Integrations
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showPrivate: !prev.showPrivate }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showPrivate ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Private Integrations
                  </button>
                </div>
              </div>

              {/* Plan Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Plan Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showPro: !prev.showPro }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showPro ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Pro Integrations
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showFree: !prev.showFree }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showFree ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Free Integrations
                  </button>
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                        filters.categories.includes(category.id)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${
                    activeTab === 'all'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  All Integrations
                </button>
                <button
                  onClick={() => setActiveTab('connected')}
                  className={`${
                    activeTab === 'connected'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Connected Integrations
                </button>
              </nav>
            </div>

            {/* Connected Integrations Tab */}
            {activeTab === 'connected' && (
              <div className="space-y-6">
                {integrations
                  .filter(integration => integration.instances?.some(instance => instance.status === "connected"))
                  .map(integration => (
                    <div key={integration.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center mb-4">
                        <div className="relative h-12 w-12 mr-4">
                          <Image
                            src={integration.imageUrl}
                            alt={integration.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {integration.instances?.map(instance => (
                          <div key={instance.id} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                            <div>
                              <p className="font-medium text-gray-900">{instance.name}</p>
                              <p className="text-sm text-gray-500">
                                {instance.status === 'connected' 
                                  ? `Connected ${new Date(instance.connectedAt!).toLocaleDateString()}`
                                  : 'Disconnected'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                instance.status === 'connected'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {instance.status}
                              </span>
                              {instance.status === 'connected' ? (
                                <button
                                  className="text-sm font-medium text-red-600 hover:text-red-500"
                                  onClick={() => handleDisconnect(integration.id, instance.id, integration.name, instance.name)}
                                >
                                  Disconnect
                                </button>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                                    onClick={() => handleReconnect(integration.id, instance.id)}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Reconnect
                                  </button>
                                  <button
                                    className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                                    onClick={() => handleDelete(integration.id, instance.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                {integrations.filter(integration => 
                  integration.instances?.some(instance => instance.status === "connected")
                ).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No connected integrations yet</p>
                  </div>
                )}
              </div>
            )}

            {/* All Integrations Tab */}
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedIntegrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative h-12 w-12">
                          <Image
                            src={integration.imageUrl}
                            alt={integration.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          integration.status === 'connected'
                            ? 'bg-green-100 text-green-800'
                            : integration.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {integration.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          integration.isPro
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {integration.isPro ? 'Pro' : 'Free'}
                        </span>
                        <button
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() => {/* Handle connect */}}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination - Only show in All Integrations tab */}
            {activeTab === 'all' && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <DisconnectModal
        isOpen={disconnectModal.isOpen}
        onClose={() => setDisconnectModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDisconnect}
        integrationName={disconnectModal.integrationName}
        instanceName={disconnectModal.instanceName}
      />
    </div>
  );
}
