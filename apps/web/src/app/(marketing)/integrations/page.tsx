"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, Mail, MessageSquare, Database, FileText, ShoppingCart, Calendar, Users, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Integration categories
const categories = [
  { id: "all", name: "All", icon: Zap },
  { id: "cms", name: "CMS", icon: FileText },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
  { id: "communication", name: "Communication", icon: MessageSquare },
  { id: "email", name: "Email", icon: Mail },
  { id: "database", name: "Database", icon: Database },
  { id: "calendar", name: "Calendar", icon: Calendar },
  { id: "crm", name: "CRM", icon: Users },
];

// Integration data with categories
const integrations = [
  // CMS
  { name: "WordPress", src: "/integrations/wordpress.png", category: "cms" },
  { name: "Webflow", src: "/integrations/webflow.png", category: "cms" },
  { name: "Contentful", src: "/integrations/contentful.png", category: "cms" },
  { name: "Sanity", src: "/integrations/sanity.png", category: "cms" },
  { name: "Strapi", src: "/integrations/strapi.png", category: "cms" },
  { name: "Ghost", src: "/integrations/ghost.png", category: "cms" },
  { name: "Storyblok", src: "/integrations/storyblock.png", category: "cms" },
  { name: "Drupal", src: "/integrations/drupal.png", category: "cms" },
  { name: "Kentico", src: "/integrations/kentico.png", category: "cms" },
  { name: "Craft", src: "/integrations/craft.png", category: "cms" },
  { name: "Directus", src: "/integrations/directus.png", category: "cms" },
  { name: "Payload", src: "/integrations/payload.png", category: "cms" },
  { name: "Prismic", src: "/integrations/prismic.png", category: "cms" },
  { name: "Framer", src: "/integrations/framer.png", category: "cms" },

  // E-commerce
  { name: "Shopify", src: "/integrations/shopify.png", category: "ecommerce" },
  { name: "BigCommerce", src: "/integrations/bigcommerce.png", category: "ecommerce" },
  { name: "Squarespace", src: "/integrations/squarespace.png", category: "ecommerce" },
  { name: "Wix", src: "/integrations/wix.png", category: "ecommerce" },

  // Communication
  { name: "Slack", src: "/integrations/slack.png", category: "communication" },
  { name: "Microsoft Teams", src: "/integrations/teams.png", category: "communication" },
  { name: "Zoom", src: "/integrations/zoom.png", category: "communication" },
  { name: "Google Meet", src: "/integrations/google-meet.png", category: "communication" },

  // Email
  { name: "SendGrid", src: "/integrations/sendgrid.png", category: "email" },
  { name: "Mailchimp", src: "/integrations/mailchimp.png", category: "email" },
  { name: "Customer.io", src: "/integrations/customerio.png", category: "email" },

  // Database
  { name: "Airtable", src: "/integrations/airtable.png", category: "database" },
  { name: "Notion", src: "/integrations/notion.png", category: "database" },
  { name: "ClickUp", src: "/integrations/clickup.png", category: "database" },

  // Calendar
  { name: "Calendly", src: "/integrations/calendly.png", category: "calendar" },
  { name: "Google Calendar", src: "/integrations/google-calendar.png", category: "calendar" },

  // CRM
  { name: "Salesforce", src: "/integrations/salesforce.png", category: "crm" },
  { name: "HubSpot", src: "/integrations/hubspot.png", category: "crm" },
  { name: "Pipedrive", src: "/integrations/pipedrive.png", category: "crm" },
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter integrations based on category and search query
  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Integrations
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Connect Hoook with your favorite tools and services
          </p>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <category.icon className="h-5 w-5 mr-3" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full rounded-full"
                />
              </div>
            </div>

            {/* Integrations Grid */}
            <div>
              {filteredIntegrations.length > 0 ? (
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredIntegrations.map((integration, index) => (
                    <motion.div
                      key={integration.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      className="flex flex-col items-center group"
                    >
                      <motion.div 
                        className="relative h-16 w-16 flex items-center justify-center rounded-xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl"
                        whileHover={{ 
                          rotate: [0, -5, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src={integration.src}
                          alt={integration.name}
                          width={32}
                          height={32}
                          className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                        />
                      </motion.div>
                      <motion.p 
                        className="mt-4 text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {integration.name}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No integrations found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "No integrations available in this category"}
                  </p>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Can&apos;t find your integration?</h2>
              <p className="mt-4 text-gray-600">
                We&apos;re constantly adding new integrations. Let us know what you need.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-full"
                >
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 