'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaClock, FaSearch, FaStar } from 'react-icons/fa'
import { useState } from 'react'

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  agent: string
  starred: boolean
}

export default function ChatHistoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showStarredOnly, setShowStarredOnly] = useState(false)

  // Mock data - replace with actual data fetching
  const chats: Chat[] = [
    {
      id: '1',
      title: 'Marketing Strategy Discussion',
      lastMessage: 'Let\'s analyze the current market trends...',
      timestamp: '2 hours ago',
      agent: 'Marketing Assistant',
      starred: true
    },
    {
      id: '2',
      title: 'Content Planning Session',
      lastMessage: 'Here\'s the content calendar for next month...',
      timestamp: '5 hours ago',
      agent: 'Content Writer',
      starred: false
    },
    {
      id: '3',
      title: 'SEO Optimization Chat',
      lastMessage: 'I\'ve analyzed your website\'s SEO performance...',
      timestamp: '1 day ago',
      agent: 'SEO Expert',
      starred: true
    }
  ]

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStarFilter = !showStarredOnly || chat.starred
    return matchesSearch && matchesStarFilter
  })

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-y-1 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your conversation history with AI agents.
          </p>
        </div>

        <Link
          href="/dashboard/chat/new"
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <FaPlus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
          New Chat
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Search chats..."
          />
        </div>
        <button
          onClick={() => setShowStarredOnly(!showStarredOnly)}
          className={`inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            showStarredOnly
              ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 hover:bg-yellow-100'
              : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          }`}
        >
          <FaStar className={`h-4 w-4 ${showStarredOnly ? 'text-yellow-400' : 'text-gray-400'}`} />
          Starred
        </button>
      </div>

      {/* Chat List */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-3">
                      <h2 className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </h2>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {chat.agent}
                      </span>
                      {chat.starred && (
                        <FaStar className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1.5 h-4 w-4 text-gray-400" />
                    {chat.timestamp}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <FaStar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No chats found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search query' : 'Get started by creating a new chat'}
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/chat/new"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                <FaPlus className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
                New Chat
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
