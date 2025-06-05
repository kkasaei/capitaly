"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaRobot, FaNetworkWired, FaComments, FaFileAlt, FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Database, Folders, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { UserMenu } from "@/components/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [starredChats, setStarredChats] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load starred chats from localStorage on component mount
    const savedStarredChats = localStorage.getItem('starredChats');
    if (savedStarredChats) {
      setStarredChats(new Set(JSON.parse(savedStarredChats)));
    }
  }, []);

  const toggleStar = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newStarredChats = new Set(starredChats);
    if (newStarredChats.has(chatId)) {
      newStarredChats.delete(chatId);
    } else {
      newStarredChats.add(chatId);
    }
    setStarredChats(newStarredChats);
    localStorage.setItem('starredChats', JSON.stringify(Array.from(newStarredChats)));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navigation = [
    {
      section: "Agent",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: FaHome },
        { name: "Agents", href: "/dashboard/agents", icon: FaRobot },
        { name: "Templates", href: "/dashboard/templates", icon: FaFileAlt },
        { name: "Integrations", href: "/dashboard/integrations", icon: FaNetworkWired },
        { name: "Content & Assets", href: "/dashboard/content", icon: Database },
      ]
    },
    {
      section: "Projects",
      items: [
        { name: "All Projects", href: "/dashboard/projects", icon: Folders },
        { name: "Capitaly", href: "/dashboard/projects/12321" },
      ]
    },
    {
      section: "Recent Chats",
      items: [
        { name: "All Chats", href: "/dashboard/chat", icon: FaComments },
        { name: "Capitaly Content Writer", href: "/dashboard/chat/12321" },
        { name: "Marketing Strategy Chat", href: "/dashboard/chat/12322" },
        { name: "Product Roadmap Discussion", href: "/dashboard/chat/12323" },
        { name: "Customer Support Bot", href: "/dashboard/chat/12324" },
        { name: "Sales Pitch Generator", href: "/dashboard/chat/12325" },
        { name: "Technical Documentation", href: "/dashboard/chat/12326" },
        { name: "Social Media Manager", href: "/dashboard/chat/12327" },
        { name: "Email Campaign Writer", href: "/dashboard/chat/12328" },
        { name: "SEO Content Assistant", href: "/dashboard/chat/12329" },
        { name: "Blog Post Generator", href: "/dashboard/chat/12330" },
        { name: "Press Release Writer", href: "/dashboard/chat/12331" },
        { name: "Product Description Bot", href: "/dashboard/chat/12332" },
        { name: "Newsletter Assistant", href: "/dashboard/chat/12333" },
        { name: "Case Study Writer", href: "/dashboard/chat/12334" },
        { name: "White Paper Generator", href: "/dashboard/chat/12335" },
        { name: "FAQ Content Creator", href: "/dashboard/chat/12336" },
        { name: "Landing Page Copywriter", href: "/dashboard/chat/12337" },
        { name: "Social Post Generator", href: "/dashboard/chat/12338" },
        { name: "Video Script Writer", href: "/dashboard/chat/12339" },
        { name: "Podcast Episode Planner", href: "/dashboard/chat/12340" },
        { name: "Webinar Content Assistant", href: "/dashboard/chat/12341" }
      ]
    }
  ];

  // Sort chats to show starred ones at the top
  const sortedNavigation = navigation.map(section => {
    if (section.section === "Recent Chats") {
      const sortedItems = [...section.items].sort((a, b) => {
        // Always put "All Chats" at the top
        if (a.name === "All Chats") return -1;
        if (b.name === "All Chats") return 1;
        
        const aId = a.href.split('/').pop();
        const bId = b.href.split('/').pop();
        const aStarred = starredChats.has(aId || '');
        const bStarred = starredChats.has(bId || '');
        if (aStarred && !bStarred) return -1;
        if (!aStarred && bStarred) return 1;
        return 0;
      });
      return { ...section, items: sortedItems };
    }
    return section;
  });

  return (
 <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <div className={`fixed inset-y-0 flex ${collapsed ? 'w-16' : 'w-64'} flex-col transition-all duration-300`}>
            <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-4">
                  {!collapsed && (
                    <Link href="/dashboard" className="flex items-center space-x-2">
                      <span className="text-white font-semibold text-2xl">Hoook</span>
                    </Link>
                  )}
                  <button
                    onClick={toggleSidebar}
                    className="text-white p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                  </button>
                </div>
                
                <div className="px-2 mb-2">
                  <Link
                    href="/dashboard/chat/new"
                    className="flex items-center justify-center w-full p-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  >
                    <Plus className={`${collapsed ? 'h-5 w-5' : 'h-5 w-5 mr-2'}`} />
                    {!collapsed && "New Chat"}
                  </Link>
                </div>

                <nav className="mt-5 flex-1 space-y-1 px-2 overflow-y-auto">
                  {sortedNavigation.map((section) => (
                    <div key={section.section} className="mb-4">
                      {!collapsed && (
                        <h3 className="px-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                          {section.section}
                        </h3>
                      )}
                      <div className="mt-2 space-y-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href;
                          const chatId = item.href.split('/').pop();
                          const isStarred = starredChats.has(chatId || '');
                          
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`${isActive
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                              title={collapsed ? item.name : ""}
                            >
                              {item.icon && (
                                <item.icon
                                  className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                                  aria-hidden="true"
                                />
                              )}
                              {!collapsed && (
                                <>
                                  <span className="flex-1">{item.name}</span>
                                  {section.section === "Recent Chats" && (
                                    <button
                                      onClick={(e) => toggleStar(chatId || '', e)}
                                      className={`p-1 rounded-full hover:bg-white/20 transition-colors ${
                                        isStarred 
                                          ? 'text-yellow-400 opacity-100' 
                                          : 'text-white/40 opacity-0 group-hover:opacity-100'
                                      }`}
                                    >
                                      <FaStar className="h-4 w-4" />
                                    </button>
                                  )}
                                </>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-white/20 p-4">
                <div className="group block w-full flex-shrink-0">
                  {!collapsed ? (
                    <>
                      <div className="mb-4 p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/80">Token Usage</span>
                          <span className="text-sm text-white/60">2,450 / 10,000</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
                          <div className="bg-white h-1.5 rounded-full" style={{ width: '24.5%' }}></div>
                        </div>
                        <button className="w-full text-sm text-white bg-white/20 hover:bg-white/30 rounded-md py-1.5 transition-colors">
                          Upgrade Plan
                        </button>
                      </div>
                      <div className="flex items-center">
                        <UserMenu />
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <UserMenu />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`${collapsed ? 'pl-16' : 'pl-64'} transition-all duration-300`}>
            <main className="flex-1">
            {children}
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
</>
  );
} 