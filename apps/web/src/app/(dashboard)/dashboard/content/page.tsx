"use client";

import { useState, useEffect } from "react";
import {
  Search,
  List,
  Grid,
  FileText,
  Video,
  Image,
  ChevronLeft,
  ChevronRight,
  Eye,
  Play,
  File,
  Folder,
  Mic,
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";

// Mock data types
interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "blog" | "video" | "image" | "group" | "audio" | "document" | "code" | "presentation";
  createdAt: string;
  thumbnail?: string;
  groupItems?: ContentItem[];
  projectId?: string;
  projectName?: string;
  agentId: string;
  agentName: string;
}

// Mock data
const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "10 Tips for Better Social Media Marketing",
    description: "A comprehensive guide to improving your social media presence",
    type: "blog",
    createdAt: "2024-03-15",
    thumbnail: "https://picsum.photos/400/300",
    projectId: "proj1",
    projectName: "Social Media Campaign",
    agentId: "agent1",
    agentName: "Content Writer Pro",
  },
  {
    id: "2",
    title: "Product Demo Video",
    description: "A detailed walkthrough of our latest features",
    type: "video",
    createdAt: "2024-03-14",
    thumbnail: "https://picsum.photos/400/300",
    projectId: "proj2",
    projectName: "Product Launch",
    agentId: "agent2",
    agentName: "Video Creator",
  },
  {
    id: "3",
    title: "YouTube Shorts Collection",
    description: "A series of engaging short-form videos for YouTube",
    type: "group",
    createdAt: "2024-03-13",
    projectId: "proj1",
    projectName: "Social Media Campaign",
    agentId: "agent2",
    agentName: "Video Creator",
    thumbnail: "https://picsum.photos/400/300",
    groupItems: [
      {
        id: "3-1",
        title: "Short 1: Quick Tips",
        type: "video",
        description: "Quick tips for beginners",
        createdAt: "2024-03-13",
        agentId: "agent2",
        agentName: "Video Creator",
        thumbnail: "https://picsum.photos/400/300?random=1",
      },
      {
        id: "3-2",
        title: "Short 2: Advanced Features",
        type: "video",
        description: "Advanced feature showcase",
        createdAt: "2024-03-13",
        agentId: "agent2",
        agentName: "Video Creator",
        thumbnail: "https://picsum.photos/400/300?random=2",
      },
    ],
  },
  {
    id: "4",
    title: "Brand Guidelines",
    description: "Complete brand identity guidelines",
    type: "document",
    createdAt: "2024-03-12",
    thumbnail: "https://picsum.photos/400/300",
    projectId: "proj3",
    projectName: "Brand Refresh",
    agentId: "agent3",
    agentName: "Design Expert",
  },
  {
    id: "5",
    title: "Product Podcast Episode",
    description: "Deep dive into our product features",
    type: "audio",
    createdAt: "2024-03-11",
    thumbnail: "https://picsum.photos/400/300",
    projectId: "proj2",
    projectName: "Product Launch",
    agentId: "agent4",
    agentName: "Audio Producer",
  },
  {
    id: "6",
    title: "API Integration Guide",
    description: "Step-by-step guide for API integration",
    type: "code",
    createdAt: "2024-03-10",
    projectId: "proj4",
    projectName: "Developer Documentation",
    agentId: "agent5",
    agentName: "Tech Writer",
  },
  {
    id: "7",
    title: "Product Launch Video Series",
    description: "A collection of product demonstration videos",
    type: "group",
    createdAt: "2024-03-09",
    thumbnail: "https://picsum.photos/400/300?random=7",
    projectId: "proj2",
    projectName: "Product Launch",
    agentId: "agent2",
    agentName: "Video Creator",
    groupItems: [
      {
        id: "7-1",
        title: "Overview Video",
        type: "video",
        description: "Product overview and key features",
        createdAt: "2024-03-09",
        agentId: "agent2",
        agentName: "Video Creator",
        thumbnail: "https://picsum.photos/400/300?random=71",
      },
      {
        id: "7-2",
        title: "Tutorial Video",
        type: "video",
        description: "Step-by-step tutorial",
        createdAt: "2024-03-09",
        agentId: "agent2",
        agentName: "Video Creator",
        thumbnail: "https://picsum.photos/400/300?random=72",
      },
    ],
  },
  ...Array.from({ length: 23 }, (_, i) => ({
    id: `${i + 8}`,
    title: `Content Item ${i + 8}`,
    description: `Description for content item ${i + 8}`,
    type: ["blog", "video", "image", "audio", "document", "code", "presentation"][i % 7] as ContentItem["type"],
    createdAt: new Date(2024, 2, 15 - i).toISOString().split('T')[0],
    thumbnail: `https://picsum.photos/400/300?random=${i + 8}`,
    projectId: `proj${(i % 4) + 1}`,
    projectName: ["Social Media Campaign", "Product Launch", "Brand Refresh", "Developer Documentation"][i % 4],
    agentId: `agent${(i % 5) + 1}`,
    agentName: ["Content Writer Pro", "Video Creator", "Design Expert", "Audio Producer", "Tech Writer"][i % 5],
  })),
];

interface FilterState {
  searchQuery: string;
  selectedProjects: string[];
  selectedAgents: string[];
  selectedTypes: ContentItem["type"][];
  viewMode: "list" | "grid";
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}

export default function ContentPage() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedProjects: [],
    selectedAgents: [],
    selectedTypes: [],
    viewMode: "grid",
  });
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [activeSavedFilter, setActiveSavedFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique projects and agents from content
  const projects = Array.from(new Set(mockContent
    .map(item => item.projectId)
    .filter((id): id is string => id !== undefined)));
  const agents = Array.from(new Set(mockContent.map(item => item.agentId)));
  const contentTypes: ContentItem["type"][] = ["blog", "video", "image", "group", "audio", "document", "code", "presentation"];

  const filteredContent = mockContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesProject = filters.selectedProjects.length === 0 || 
      (item.projectId && filters.selectedProjects.includes(item.projectId));
    
    const matchesAgent = filters.selectedAgents.length === 0 || 
      filters.selectedAgents.includes(item.agentId);
    
    const matchesType = filters.selectedTypes.length === 0 || 
      filters.selectedTypes.includes(item.type);

    return matchesSearch && matchesProject && matchesAgent && matchesType;
  });

  const totalItems = filteredContent.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedContent = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getContentIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "blog":
        return <FileText className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "image":
        return <Image className="h-6 w-6" />;
      case "group":
        return <Folder className="h-6 w-6" />;
      case "audio":
        return <Mic className="h-6 w-6" />;
      case "document":
        return <File className="h-6 w-6" />;
      case "code":
        return <File className="h-6 w-6" />;
      case "presentation":
        return <File className="h-6 w-6" />;
    }
  };

  const saveCurrentFilter = () => {
    const name = prompt("Enter a name for this filter:");
    if (name) {
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name,
        filters: { ...filters },
      };
      setSavedFilters([...savedFilters, newFilter]);
    }
  };

  const applySavedFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter) {
      setFilters(filter.filters);
      setActiveSavedFilter(filterId);
    }
  };

  const removeSavedFilter = (filterId: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== filterId));
    if (activeSavedFilter === filterId) {
      setActiveSavedFilter(null);
    }
  };

  const renderContentCard = (item: ContentItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={() => setSelectedContent(item)}
    >
      {item.thumbnail && (
        <div className="relative aspect-video mb-4 rounded-md overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        {getContentIcon(item.type)}
        <h3 className="text-lg font-semibold">{item.title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        {item.type === "group" && (
          <span className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            {item.groupItems?.length} items
          </span>
        )}
      </div>
    </div>
  );

  const renderContentList = (item: ContentItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
      onClick={() => setSelectedContent(item)}
    >
      <div className="flex items-center gap-4">
        {item.thumbnail && (
          <div className="relative w-32 aspect-video rounded-md overflow-hidden flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {getContentIcon(item.type)}
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            {item.type === "group" && (
              <span className="flex items-center gap-1">
                <Folder className="h-4 w-4" />
                {item.groupItems?.length} items
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Content</h1>
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
              placeholder="Search content..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  onClick={saveCurrentFilter}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              {/* Saved Filters */}
              {savedFilters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Filters</h3>
                  <div className="space-y-2">
                    {savedFilters.map(filter => (
                      <div
                        key={filter.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                          activeSavedFilter === filter.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        <button
                          onClick={() => applySavedFilter(filter.id)}
                          className="flex items-center gap-1 flex-grow"
                        >
                          <BookmarkCheck className="h-4 w-4" />
                          {filter.name}
                        </button>
                        <button
                          onClick={() => removeSavedFilter(filter.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Projects</h3>
                <div className="space-y-2">
                  {projects.map(projectId => {
                    const project = mockContent.find(item => item.projectId === projectId);
                    return (
                      <label key={projectId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.selectedProjects.includes(projectId)}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              selectedProjects: e.target.checked
                                ? [...prev.selectedProjects, projectId]
                                : prev.selectedProjects.filter(id => id !== projectId)
                            }));
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{project?.projectName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Agent Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Agents</h3>
                <div className="space-y-2">
                  {agents.map(agentId => {
                    const agent = mockContent.find(item => item.agentId === agentId);
                    return (
                      <label key={agentId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.selectedAgents.includes(agentId)}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              selectedAgents: e.target.checked
                                ? [...prev.selectedAgents, agentId]
                                : prev.selectedAgents.filter(id => id !== agentId)
                            }));
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span className="text-sm text-gray-700">{agent?.agentName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Content Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Content Types</h3>
                <div className="space-y-2">
                  {contentTypes.map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.selectedTypes.includes(type)}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            selectedTypes: e.target.checked
                              ? [...prev.selectedTypes, type]
                              : prev.selectedTypes.filter(t => t !== type)
                          }));
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-9">
            {/* View Controls and Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: "list" }))}
                  className={`p-2 rounded-md ${
                    filters.viewMode === "list"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: "grid" }))}
                  className={`p-2 rounded-md ${
                    filters.viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className={filters.viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {paginatedContent.map((item) =>
                filters.viewMode === "grid" ? renderContentCard(item) : renderContentList(item)
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === currentPage
                              ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                              : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
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

        {/* Content Detail Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getContentIcon(selectedContent.type)}
                    <h2 className="text-2xl font-semibold">{selectedContent.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {selectedContent.thumbnail && (
                  <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedContent.thumbnail}
                      alt={selectedContent.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <p className="text-gray-600 mb-4">{selectedContent.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Project</h3>
                    <p className="text-gray-900">{selectedContent.projectName || "No Project"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created by</h3>
                    <p className="text-gray-900">{selectedContent.agentName}</p>
                  </div>
                </div>
                
                {selectedContent.type === "group" && selectedContent.groupItems && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Group Contents</h3>
                    <div className="space-y-4">
                      {selectedContent.groupItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex gap-4">
                            {item.thumbnail && (
                              <div className="relative w-32 aspect-video rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                {getContentIcon(item.type)}
                                <h4 className="font-medium">{item.title}</h4>
                              </div>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                  <span>Created: {new Date(selectedContent.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    {selectedContent.type === "video" && (
                      <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                        <Play className="h-4 w-4" />
                        Play
                      </button>
                    )}
                    {selectedContent.type === "audio" && (
                      <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                        <Play className="h-4 w-4" />
                        Listen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
