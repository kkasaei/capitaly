"use client";

import { FaNewspaper, FaFolder } from "react-icons/fa";
import Link from "next/link";

export default function AdminPage() {
  const adminTasks = [
    {
      name: "Blog Posts",
      description: "Create and manage blog content",
      icon: FaNewspaper,
      href: "/admin/blog",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Categories",
      description: "Manage blog post categories",
      icon: FaFolder,
      href: "/admin/categories",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your blog content and categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {adminTasks.map((task) => (
          <Link
            key={task.name}
            href={task.href}
            className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`rounded-md p-3 ${task.color}`}>
                <task.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                  {task.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Blog Posts</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No recent posts to display</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Blog Posts</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 