'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-100">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/icon.png" alt="Capitaly" className="w-8 h-8" />
                <span className="text-black font-semibold text-lg">CAPITALY</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 px-6 py-8">
              <nav className="space-y-8">
                <Link
                  href="/pricing"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/features"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/templates"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  href="/blog"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/forum"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Forum
                </Link>
                <Link
                  href="/about"
                  className="block text-4xl font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <div className="font-semibold text-gray-900">Guest User</div>
                  <div className="text-sm text-gray-600">guest@capitaly.com</div>
                </div>

                <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-200 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Account Settings</span>
                </button>

                <button className="flex items-center justify-between w-full p-3 hover:bg-gray-200 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Log Out</span>
                  </div>
                  <LogOut className="w-4 h-4 text-gray-400" />
                </button>

                <Button className="w-full bg-black text-white hover:bg-gray-800 mt-4">Join Waitlist</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed top-4 left-0 right-0 z-50 px-[5%]">
        <nav className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/icon.png" alt="Capitaly" width={32} height={32} className="w-8 h-8" />
              <span className="text-black font-semibold text-lg">CAPITALY</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-black transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-black transition-colors">
              Templates
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-black transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="#signin"
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Button className="hidden md:block bg-black text-white hover:bg-gray-800">Join the waitlist</Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
} 