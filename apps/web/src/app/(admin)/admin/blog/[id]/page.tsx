"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

// Mock data - replace with actual data fetching
const mockPost = {
  id: "1",
  title: "Getting Started with AI Marketing",
  content: "This is a detailed blog post about AI marketing...",
  status: "published",
  author: "John Doe",
  date: "2024-03-15",
  views: 1234,
};

export default function BlogPostViewPage() {
  const params = useParams();
  const [post, setPost] = useState(mockPost);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog Posts
        </Link>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.views} views</span>
              </div>
            </div>
            <Link
              href={`/admin/blog/${post.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Edit Post
            </Link>
          </div>

          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>

          <div className="mt-6">
            <span
              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                post.status === "published"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 