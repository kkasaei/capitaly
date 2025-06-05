"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaNewspaper, FaFolder } from "react-icons/fa";
import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { UserMenu } from "@/components/user-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navigation = [
    { name: "Blog Posts", href: "/admin/blog", icon: FaNewspaper },
    { name: "Categories", href: "/admin/categories", icon: FaFolder },
  ];

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <div className={`fixed inset-y-0 flex ${collapsed ? 'w-16' : 'w-64'} flex-col transition-all duration-300`}>
            <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-4">
                  {!collapsed && (
                    <Link href="/admin" className="flex items-center space-x-2">
                      <span className="text-white font-semibold text-2xl">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={toggleSidebar}
                    className="text-white p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                  </button>
                </div>
                <nav className="mt-5 flex-1 space-y-1 px-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
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
                        <item.icon
                          className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`}
                          aria-hidden="true"
                        />
                        {!collapsed && item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-white/20 p-4">
                <div className="group block w-full flex-shrink-0">
                  {!collapsed ? (
                    <div className="flex items-center">
                      <UserMenu />
                    </div>
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
