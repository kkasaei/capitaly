"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, LogOut, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import Navigation from '@/components/Navigation';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function CapitalyLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      company: "TechFlow AI",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Capitaly transformed our Series A process. We raised $15M in 6 weeks instead of the typical 6 months. The AI matching was incredibly accurate.",
      size: "large",
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      company: "GreenTech Ventures",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "The investor insights feature is game-changing. We knew exactly when to follow up and what investors cared about most.",
      size: "medium",
    },
    {
      id: 3,
      name: "Emily Watson",
      company: "HealthTech Solutions",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Capitaly's data room analytics showed us which documents investors spent the most time on. This helped us optimize our pitch.",
      size: "large",
    },
    {
      id: 4,
      name: "David Kim",
      company: "Fintech Innovations",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Best fundraising platform I've used. The AI suggestions helped us refine our pitch deck and messaging.",
      size: "small",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      company: "EdTech Pioneers",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "We went from 0 to term sheet in 4 weeks using Capitaly. The investor matching algorithm is incredibly sophisticated.",
      size: "medium",
    },
    {
      id: 6,
      name: "James Wilson",
      company: "CleanEnergy Corp",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Capitaly is hands down the most efficient fundraising tool. It's like having a dedicated investment banker on your team.",
      size: "large",
    },
    {
      id: 7,
      name: "Priya Patel",
      company: "BioTech Innovations",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "The workflow templates saved us weeks of preparation. Everything was organized and professional from day one.",
      size: "medium",
    },
    {
      id: 8,
      name: "Alex Morgan",
      company: "SpaceTech Ventures",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "I love how Capitaly tracks every interaction. We never missed a follow-up and maintained perfect investor relations.",
      size: "small",
    },
    {
      id: 9,
      name: "Rachel Green",
      company: "FoodTech Solutions",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "After trying multiple platforms, Capitaly is the only one that actually helped us close our round faster.",
      size: "large",
    },
    {
      id: 10,
      name: "Michael Brown",
      company: "RetailTech Inc",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Capitaly's AI insights predicted which investors would be most interested. We had a 90% meeting acceptance rate.",
      size: "medium",
    },
  ]

  // Auto-scroll functionality
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        // Calculate the height of one complete set of testimonials
        // Reset to 0 when we've scrolled through one complete cycle
        const cycleHeight = 1500 // Approximate height of one complete testimonial set
        return (prev + 1) % cycleHeight
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <main>
      <Navigation />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-100">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-black font-semibold text-lg">CAPITALY</span>
              </div>
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

      {/* Hero Section */}
      <div className="pt-24 px-[2.5%] pb-4">
        <div className="bg-gradient-to-br from-purple-800 via-red-500 to-blue-600 rounded-2xl px-6 py-20 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              The AI Fundraising
              <br />
              Platform
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built to make fundraising extraordinarily efficient. Capitaly is the smartest way to raise capital and
              manage investor relations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
              <Button size="lg" className="bg-black text-white hover:bg-black/80 px-8 py-4 text-lg">
                Join Waitlist
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-gray-800 border-white hover:bg-gray-100 hover:text-gray-900 px-8 py-4 text-lg"
              >
                Schedule a demo
              </Button>
            </div>

            {/* Dashboard Mockup */}
            <div className="w-full max-w-7xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  {/* Dashboard Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="text-gray-800 font-semibold">Capitaly Dashboard</span>
                      <div className="flex items-center space-x-2 ml-8">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">Series A Round</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="p-8">
                    {/* Top Stats Bar */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">$2.4M</div>
                        <div className="text-sm text-gray-600">Raised</div>
                        <div className="text-xs text-green-600">+15% this week</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">47</div>
                        <div className="text-sm text-gray-600">Meetings</div>
                        <div className="text-xs text-green-600">+8 scheduled</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">89%</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-xs text-green-600">+12% vs last month</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-gray-600">Active Investors</div>
                        <div className="text-xs text-green-600">3 new this week</div>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-3 gap-8">
                      {/* Left Column - Investor Pipeline */}
                      <div className="col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-4">Investor Pipeline</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">SC</span>
                              </div>
                              <div>
                                <div className="font-semibold">Sequoia Capital</div>
                                <div className="text-sm text-gray-600">Term sheet under review</div>
                              </div>
                            </div>
                            <div className="text-green-600 font-semibold">Hot Lead</div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">AH</span>
                              </div>
                              <div>
                                <div className="font-semibold">Andreessen Horowitz</div>
                                <div className="text-sm text-gray-600">Due diligence in progress</div>
                              </div>
                            </div>
                            <div className="text-blue-600 font-semibold">Interested</div>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">GV</span>
                              </div>
                              <div>
                                <div className="font-semibold">Google Ventures</div>
                                <div className="text-sm text-gray-600">Initial meeting scheduled</div>
                              </div>
                            </div>
                            <div className="text-yellow-600 font-semibold">Warm</div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Quick Actions */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <Button className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700">
                            <span>Schedule Meeting</span>
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <span>Update Data Room</span>
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <span>Send Follow-up</span>
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <span>Generate Report</span>
                          </Button>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">AI Insights</h4>
                          <p className="text-sm text-blue-800">
                            "Based on recent activity, consider following up with Sequoia within 48 hours to maintain
                            momentum."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Streamline your fundraising</h2>
          <p className="text-xl text-gray-600">Everything you need to raise capital efficiently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Investor Matching</h3>
              <p className="text-gray-600">
                AI-powered matching connects you with the right investors for your stage and industry.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Data Rooms</h3>
              <p className="text-gray-600">
                Share sensitive documents securely with granular access controls and detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pipeline Management</h3>
              <p className="text-gray-600">
                Track every interaction, meeting, and milestone in your fundraising journey.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Workflow Templates</h3>
              <p className="text-gray-600">
                Ready-made fundraising workflows to help you get started quickly and follow best practices.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrations & Automation</h3>
              <p className="text-gray-600">
                Connect with your favorite tools and automate repetitive tasks to save time and reduce errors.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-indigo-500 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Generation</h3>
              <p className="text-gray-600">
                Powerful tools to identify and connect with potential investors aligned with your business goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Showcase Sections */}
      <div className="py-20">
        {/* Feature 1 */}
        <div className="px-[2.5%] pb-4">
          <div className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Track, track, track</h2>
              <p className="text-xl text-gray-600">Monitor every aspect of your fundraising progress in real-time</p>
            </div>
            <div className="bg-gradient-to-br from-blue-700 via-purple-600 to-red-500 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {/* Analytics Dashboard */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  {/* Dashboard Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="text-gray-800 font-semibold">Analytics Dashboard</span>
                      <div className="flex items-center space-x-2 ml-8">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">Series A Round</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Dashboard Content */}
                  <div className="p-8">
                    {/* Top Stats Bar */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">$2.4M</div>
                        <div className="text-sm text-gray-600">Raised</div>
                        <div className="text-xs text-green-600">+15% this week</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">47</div>
                        <div className="text-sm text-gray-600">Meetings</div>
                        <div className="text-xs text-green-600">+8 scheduled</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">89%</div>
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-xs text-green-600">+12% vs last month</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-gray-600">Active Investors</div>
                        <div className="text-xs text-green-600">3 new this week</div>
                      </div>
                    </div>

                    {/* Charts and Graphs */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Revenue Chart */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Revenue Growth</h4>
                        <div className="h-48 bg-gray-200 rounded-xl">{/* Placeholder for Chart */}</div>
                      </div>

                      {/* Engagement Chart */}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Investor Engagement</h4>
                        <div className="h-48 bg-gray-200 rounded-xl">{/* Placeholder for Chart */}</div>
                      </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="mt-8">
                      <h3 className="font-semibold text-gray-900 mb-4">Key Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="text-xl font-bold text-blue-600">32%</div>
                          <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="text-xl font-bold text-green-600">4.5</div>
                          <div className="text-sm text-gray-600">Avg. Meeting Score</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="text-xl font-bold text-purple-600">7 Days</div>
                          <div className="text-sm text-gray-600">Avg. Time to Close</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="px-[2.5%] pb-4">
          <div className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Know your investors</h2>
              <p className="text-xl text-gray-600">Deep insights into investor preferences and behavior patterns</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 via-blue-600 to-purple-700 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {/* Investor Profile Interface */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  {/* Interface Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="text-gray-800 font-semibold">Investor Profile</span>
                      <div className="flex items-center space-x-2 ml-8">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">Sequoia Capital</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Interface Content */}
                  <div className="p-8">
                    {/* Investor Details */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-2">Investor Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Name</div>
                          <div className="font-semibold">Sequoia Capital</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Industry</div>
                          <div className="font-semibold">Venture Capital</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Investment Stage</div>
                          <div className="font-semibold">Series A, Series B</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Location</div>
                          <div className="font-semibold">Menlo Park, CA</div>
                        </div>
                      </div>
                    </div>

                    {/* Interaction History */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-2">Interaction History</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Meeting on 2024-03-15</div>
                            <div className="text-green-600 font-semibold">Positive Feedback</div>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Pitch Deck Viewed 3 Times</div>
                            <div className="text-blue-600 font-semibold">High Engagement</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Analytics */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Engagement Analytics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="text-xl font-bold text-blue-600">85%</div>
                          <div className="text-sm text-gray-600">Data Room Engagement</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="text-xl font-bold text-green-600">4.7</div>
                          <div className="text-sm text-gray-600">Avg. Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="px-[2.5%] pb-4">
          <div className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Raise in natural language</h2>
              <p className="text-xl text-gray-600">AI-powered pitch optimization and investor communication</p>
            </div>
            <div className="bg-gradient-to-br from-blue-800 via-red-500 to-purple-600 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                {/* AI Communication Interface */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  {/* Interface Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                      </div>
                      <span className="text-gray-800 font-semibold">AI Communication</span>
                      <div className="flex items-center space-x-2 ml-8">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">Sequoia Capital</div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Interface Content */}
                  <div className="p-8">
                    {/* Chat Interface */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-900 mb-2">Chat with AI</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">You</div>
                          <div className="text-gray-800">"Can you suggest improvements to my pitch deck?"</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-600">AI Assistant</div>
                          <div className="text-gray-800">
                            "Consider highlighting your 300% YoY growth in slide 3 to strengthen your traction story."
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">You</div>
                          <div className="text-gray-800">"Thanks, that's helpful!"</div>
                        </div>
                      </div>
                    </div>

                    {/* Pitch Optimization Tools */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pitch Optimization</h3>
                      <div className="space-y-2">
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <div className="text-sm text-gray-600 mb-2">AI Analysis</div>
                          <div className="text-gray-800">
                            "Your pitch deck is 90% complete. Consider adding more details on your team and market
                            size."
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Highlight Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-black mb-4">Raise capital faster</h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Intelligent, efficient, and proven, Capitaly is the best way to fundraise with AI.
              </p>
            </div>
            <Button className="mt-6 md:mt-0 bg-black text-white hover:bg-gray-800 px-6 py-3">See all features</Button>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* AI-Powered Matching */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">AI-Powered Matching</h3>
                <p className="text-gray-600 mb-8">
                  Advanced algorithms connect you with the right investors based on your industry, stage, and funding
                  needs.
                </p>
              </div>

              {/* 3D Illustration */}
              <div className="relative h-48 mt-8">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  {/* Geometric AI representation */}
                  <div className="relative">
                    {/* Base platform */}
                    <div className="w-32 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg transform perspective-1000 rotateX-60"></div>

                    {/* AI Brain/Network visualization */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl transform rotate-45 shadow-lg">
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl"></div>
                      </div>
                    </div>

                    {/* Connection nodes */}
                    <div className="absolute -top-8 -left-4 w-4 h-4 bg-blue-400 rounded-full shadow-md"></div>
                    <div className="absolute -top-12 right-2 w-3 h-3 bg-purple-400 rounded-full shadow-md"></div>
                    <div className="absolute -top-6 right-8 w-2 h-2 bg-pink-400 rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless Integration */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">Seamless Integration</h3>
                <p className="text-gray-600 mb-8">
                  Connect with your existing tools and workflows. Import data, sync calendars, and automate follow-ups.
                </p>
              </div>

              {/* 3D Illustration */}
              <div className="relative h-48 mt-8">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  {/* Isometric blocks representing integration */}
                  <div className="relative">
                    {/* Base */}
                    <div className="w-24 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded transform perspective-1000 rotateX-60"></div>

                    {/* Integration blocks */}
                    <div className="absolute -top-8 left-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded transform rotate-12 shadow-lg"></div>
                    </div>
                    <div className="absolute -top-12 left-8">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded transform -rotate-12 shadow-lg"></div>
                    </div>
                    <div className="absolute -top-8 right-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded transform rotate-45 shadow-lg"></div>
                    </div>
                    <div className="absolute -top-16 left-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded transform -rotate-45 shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Security */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">Enterprise Security</h3>
                <p className="text-gray-600 mb-8">
                  Bank-grade security with SOC 2 compliance. Your sensitive fundraising data is always protected and
                  private.
                </p>
              </div>

              {/* 3D Illustration */}
              <div className="relative h-48 mt-8">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  {/* Security shield representation */}
                  <div className="relative">
                    {/* Base platform */}
                    <div className="w-28 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg transform perspective-1000 rotateX-60"></div>

                    {/* Security orb */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full shadow-xl relative">
                        <div className="absolute inset-2 bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500 rounded-full"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* SOC2 badge */}
                    <div className="absolute -bottom-2 right-4 bg-white rounded-full px-2 py-1 shadow-md border border-gray-200">
                      <span className="text-xs font-semibold text-gray-700">SOC2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by world-class Founders</h2>
          <p className="text-xl text-gray-600">
            Founders and businesses all around the world reach for Capitaly by choice.
          </p>
        </div>

        {/* Scrolling Testimonials - 3 Column Layout */}
        <div className="max-w-6xl mx-auto relative">
          {/* Fade overlay - top */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>

          {/* Fade overlay - bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>

          {/* Fade overlay - left */}
          <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10"></div>

          {/* Fade overlay - right */}
          <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="grid grid-cols-3 gap-6 h-[600px] overflow-hidden">
            {/* Left Column - Scrolling Up */}
            <div className="relative overflow-hidden">
              <div
                className="flex flex-col gap-6"
                style={{
                  transform: `translateY(-${(scrollPosition * 0.5) % 2000}px)`,
                  willChange: "transform",
                }}
              >
                {/* Create 6 sets of testimonials for seamless infinite scroll */}
                {Array.from({ length: 6 }).map((_, setIndex) => (
                  <div key={`left-set-${setIndex}`} className="flex flex-col gap-6">
                    {testimonials.slice(0, 5).map((testimonial, index) => (
                      <div
                        key={`left-${setIndex}-${testimonial.id}-${index}`}
                        className="flex-shrink-0 bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full overflow-hidden"
                        style={{
                          height:
                            testimonial.size === "large" ? "240px" : testimonial.size === "medium" ? "180px" : "140px",
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{testimonial.name}</div>
                            <div className="text-sm text-gray-600 truncate">{testimonial.company}</div>
                          </div>
                        </div>
                        <p
                          className="text-gray-700 text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: testimonial.size === "large" ? 8 : testimonial.size === "medium" ? 5 : 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {testimonial.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column - Scrolling Down */}
            <div className="relative overflow-hidden">
              <div
                className="flex flex-col gap-6"
                style={{
                  transform: `translateY(${((scrollPosition * 0.5) % 2000) - 1000}px)`,
                  willChange: "transform",
                }}
              >
                {/* Create 6 sets of testimonials for seamless infinite scroll */}
                {Array.from({ length: 6 }).map((_, setIndex) => (
                  <div key={`middle-set-${setIndex}`} className="flex flex-col gap-6">
                    {testimonials.slice(2, 7).map((testimonial, index) => (
                      <div
                        key={`middle-${setIndex}-${testimonial.id}-${index}`}
                        className="flex-shrink-0 bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full overflow-hidden"
                        style={{
                          height:
                            testimonial.size === "large" ? "240px" : testimonial.size === "medium" ? "180px" : "140px",
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{testimonial.name}</div>
                            <div className="text-sm text-gray-600 truncate">{testimonial.company}</div>
                          </div>
                        </div>
                        <p
                          className="text-gray-700 text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: testimonial.size === "large" ? 8 : testimonial.size === "medium" ? 5 : 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {testimonial.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Scrolling Up */}
            <div className="relative overflow-hidden">
              <div
                className="flex flex-col gap-6"
                style={{
                  transform: `translateY(-${(scrollPosition * 0.5) % 2000}px)`,
                  willChange: "transform",
                }}
              >
                {/* Create 6 sets of testimonials for seamless infinite scroll */}
                {Array.from({ length: 6 }).map((_, setIndex) => (
                  <div key={`right-set-${setIndex}`} className="flex flex-col gap-6">
                    {testimonials.slice(4, 9).map((testimonial, index) => (
                      <div
                        key={`right-${setIndex}-${testimonial.id}-${index}`}
                        className="flex-shrink-0 bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full overflow-hidden"
                        style={{
                          height:
                            testimonial.size === "large" ? "240px" : testimonial.size === "medium" ? "180px" : "140px",
                        }}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 truncate">{testimonial.name}</div>
                            <div className="text-sm text-gray-600 truncate">{testimonial.company}</div>
                          </div>
                        </div>
                        <p
                          className="text-gray-700 text-sm leading-relaxed overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: testimonial.size === "large" ? 8 : testimonial.size === "medium" ? 5 : 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {testimonial.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </main>
  )
}
