"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PaginationControls } from "@/components/ui/pagination-controls"
import Image from "next/image"

// Mock data - replace with actual data fetching
const MOCK_POSTS = [
  {
    id: 1,
    title: "Getting Started with AI Content Generation",
    excerpt: "Learn how to leverage AI to create engaging content for your business...",
    category: "AI",
    date: "2024-03-20",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  },
  {
    id: 2,
    title: "Content Marketing Strategies for 2024",
    excerpt: "Discover the most effective content marketing strategies that will drive results...",
    category: "Marketing",
    date: "2024-03-19",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1664575601711-67110e027b9b"
  },
  // Add more mock posts as needed
]

const CATEGORIES = ["All", "AI", "Marketing", "Technology", "Business"]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage))
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPosts, currentPage, itemsPerPage])

  // Create showing text for pagination
  const showingText = filteredPosts.length > 0
    ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, filteredPosts.length)} of ${filteredPosts.length} posts`
    : ""

  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Insights, tutorials, and updates from our team
        </p>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content area */}
        <div className="flex-1">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories for mobile */}
          <div className="lg:hidden mb-8">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-sm px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <time>{post.date}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto">
                    Read more →
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingText={showingText}
          />
        </div>

        {/* Categories sidebar for desktop */}
        <div className="hidden lg:block lg:w-64">
          <div className="lg:sticky lg:top-8">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
