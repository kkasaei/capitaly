"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Lock,
  Globe,
  Crown,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  TrendingUp,
  Headset,
  Package,
  Code2,
  Users,
  Scale,
  Wallet,
  Mail,
  MessageSquare,
  Share2,
  BarChart,
  Target,
  Hash,
  Image,
  Video,
  FileText,
  Calendar,
  Gift,
  ShoppingCart,
  Award,
  Star,
  Heart,
  ThumbsUp,
  Zap,
  Lightbulb,
  BookOpen,
  PenTool,
  Camera,
  Mic,
  Radio,
  HelpCircle,
  Workflow,
  GitBranch,
  Database,
  Webhook,
  Server,
  Cloud,
  Bot,
  Cpu,
  Network,
  Link2,
  Code
} from "lucide-react";
import TemplateCards from "@/components/template-cards";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isPro: boolean;
  category: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
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
    // Social Media Marketing
    { name: "Social Media", icon: Share2 },
    { name: "Instagram", icon: Camera },
    { name: "LinkedIn", icon: Users },
    { name: "Twitter", icon: Hash },
    { name: "Facebook", icon: ThumbsUp },
    { name: "TikTok", icon: Video },
    
    // Content Marketing
    { name: "Blog Posts", icon: FileText },
    { name: "Email Marketing", icon: Mail },
    { name: "Newsletter", icon: Mail },
    { name: "Video Content", icon: Video },
    { name: "Podcasts", icon: Mic },
    { name: "Webinars", icon: Radio },
    
    // Digital Marketing
    { name: "SEO", icon: Search },
    { name: "PPC", icon: Target },
    { name: "Analytics", icon: BarChart },
    { name: "Landing Pages", icon: FileText },
    
    // Brand Marketing
    { name: "Brand Voice", icon: MessageSquare },
    { name: "Visual Identity", icon: Image },
    { name: "Brand Guidelines", icon: BookOpen },
    
    // Campaign Marketing
    { name: "Product Launch", icon: Zap },
    { name: "Holiday Campaigns", icon: Gift },
    { name: "Promotional", icon: Megaphone },
    
    // Growth Marketing
    { name: "Lead Generation", icon: TrendingUp },
    { name: "Conversion", icon: ShoppingCart },
    { name: "Retention", icon: Heart },
    
    // Performance Marketing
    { name: "ROI Tracking", icon: BarChart },
    { name: "KPI Reports", icon: Award },
    { name: "Competitor Analysis", icon: Target },
    
    // Creative Marketing
    { name: "Copywriting", icon: PenTool },
    { name: "Design", icon: Lightbulb },
    { name: "Photography", icon: Camera },

    // Integrations
    { name: "Zapier", icon: Link2 },
    { name: "N8N", icon: Workflow },
    { name: "Webhooks", icon: Webhook },
    { name: "API", icon: Code },
    { name: "Database", icon: Database },
    { name: "Cloud", icon: Cloud },

    // Workflows
    { name: "Automation", icon: Bot },
    { name: "Data Sync", icon: Network },
    { name: "Server Tasks", icon: Server },
    { name: "Processing", icon: Cpu },
    { name: "Branch Logic", icon: GitBranch }
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVisibility = (template.isPublic && filters.showPublic) || 
      (!template.isPublic && filters.showPrivate);
    
    const matchesPlan = (template.isPro && filters.showPro) || 
      (!template.isPro && filters.showFree);

    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(template.category);

    return matchesSearch && matchesVisibility && matchesPlan && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStart = (query: string) => {
    router.push(`/dashboard/chat?template=${query}`);
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            New Template
          </Link>
        </div>

        {/* Search Bar - Above Both Sections */}
        <div className="mb-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search templates..."
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
                    Public Templates
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showPrivate: !prev.showPrivate }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showPrivate ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Private Templates
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
                    Pro Templates
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, showFree: !prev.showFree }))}
                    className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      filters.showFree ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    Free Templates
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => toggleCategory(name)}
                      className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                        filters.categories.includes(name)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Template Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow p-6 border border-indigo-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Missing a Template?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Can't find what you're looking for? We can create custom templates tailored to your specific needs.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Contact us
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Cards and Pagination */}
          <div className="col-span-12 md:col-span-9">
            <div>
              <div>
                <TemplateCards handleStart={handleStart} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredTemplates.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredTemplates.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === page
                                ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
