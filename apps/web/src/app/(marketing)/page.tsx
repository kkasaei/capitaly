"use client";

import Link from "next/link";
import Image from "next/image";
import { FaRobot, FaBrain, FaNetworkWired, FaMagic, FaChartBar, FaSearch, FaUsers, FaPencilAlt, FaBullhorn, FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    name: "AI Strategy & Planning",
    description: "Market intelligence, competitor analysis, and dynamic GTM roadmaps that auto-update based on real-time data.",
    icon: FaBrain,
  },
  {
    name: "Content Creation & Optimization",
    description: "End-to-end content creation with autonomous agents, multimedia generation, and intelligent content refresh.",
    icon: FaPencilAlt,
  },
  {
    name: "Demand Generation",
    description: "Programmatic ad management, ABM sequences, and conversational bots for lead qualification and booking.",
    icon: FaBullhorn,
  },
  {
    name: "Social & Distribution",
    description: "Intelligent social scheduling, viral hook testing, and influencer management across all channels.",
    icon: FaNetworkWired,
  },
  {
    name: "Conversion Optimization",
    description: "Advanced CRO suite with A/B testing, UX heatmaps, and dynamic personalization for maximum conversion.",
    icon: FaChartBar,
  },
  {
    name: "Analytics & Attribution",
    description: "Unified dashboard with multi-touch attribution, predictive forecasting, and real-time performance tracking.",
    icon: FaSearch,
  },
  {
    name: "Retention & Loyalty",
    description: "Automated lifecycle workflows, loyalty programs, and customer advocacy management.",
    icon: FaUsers,
  },
  {
    name: "CRM & Sales Alignment",
    description: "Seamless CRM integration, AI lead scoring, and automated sales enablement workflows.",
    icon: FaUserFriends,
  },
  {
    name: "Marketing Operations",
    description: "AI project management, approval workflows, and automated data enrichment for streamlined operations.",
    icon: FaMagic,
  },
  {
    name: "Events & Webinars",
    description: "End-to-end event management with AI-driven networking and engagement analytics.",
    icon: FaRobot,
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0 }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600 shadow-sm">
                <svg className="h-4 w-4 mr-2 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93"/></svg>
                The Future of AI-Powered Marketing
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            >
              Your Full-Stack <motion.span
                initial={{ color: '#000' }}
                animate={{ color: '#2563eb' }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="block text-blue-600"
              >
                AI Marketing Agency
              </motion.span>
            </motion.h1>
            <div className="relative mt-8">
              <div className="absolute -inset-x-4 -z-10 transform-gpu overflow-hidden blur-[100px]">
                <div
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff4d94] to-[#7c3aed] opacity-80 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
                <div
                  className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7c3aed] to-[#ff4d94] opacity-70 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x-reverse"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
                <div
                  className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#7c3aed] opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 mb-12 sm:mb-6 text-lg sm:text-xl leading-8 text-gray-600 font-medium"
            >
              Hoook combines agentic AI with comprehensive marketing expertise to deliver end-to-end automation across strategy, content, demand gen, social, CRO, analytics, retention, and operations—replacing your entire marketing team with intelligent agents.
            </motion.p>
            
          </div>
        </div>
      </div>

      <div className="relative isolate px-6 lg:px-8 -mt-28">
        <div className="mx-auto">
          <div className="relative">
            <div className="absolute -inset-x-4 top-[-15rem] -z-10 transform-gpu overflow-hidden blur-[100px] sm:-top-96">
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff4d94] to-[#7c3aed] opacity-80 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
              <div
                className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7c3aed] to-[#ff4d94] opacity-70 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x-reverse"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
              <div
                className="absolute left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#7c3aed] opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-gradient-x"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mt-4 flow-root sm:mt-6">
                <div className="relative -m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <div className="absolute inset-0 rounded-xl">
                    <div className="absolute inset-0 rounded-xl border-2 border-blue-500/50 animate-ring-pulse"></div>
                  </div>
                  <Image
                    src="/dashboard.png"
                    alt="Hoook.io Dashboard"
                    width={2432}
                    height={1442}
                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">All-in-One AI Marketing Suite</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to grow your business with the power of artificial intelligence
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600">Why Hoook?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Designed by marketers, for marketers
            </p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Hoook Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Winner
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
                  <div className="absolute inset-0 rounded-2xl border-4 border-blue-500/20 animate-pulse"></div>
                  <div className="relative p-8">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700"
                      >
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Hoook</h3>
                        <p className="text-sm text-gray-500">AI-Powered Marketing Platform</p>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4">
                      {[
                        { text: "Full Marketing Control", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                        { text: "Seamless Integrations", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
                        { text: "Marketing-First Design", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                        { text: "AI-Powered Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                          </div>
                          <span className="text-gray-600">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <a
                        href="https://form.typeform.com/to/awrhYESs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-center text-base font-semibold text-white shadow-sm hover:from-blue-700 hover:to-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Other Tools Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center rounded-full bg-gray-200 px-4 py-1 text-sm font-semibold text-gray-600">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Basic Tools
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
                  <div className="relative p-8">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-200 to-gray-300"
                      >
                        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Other Tools</h3>
                        <p className="text-sm text-gray-500">Generic Automation</p>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4">
                      {[
                        { text: "Limited Control", icon: "M6 18L18 6M6 6l12 12" },
                        { text: "Complex Integrations", icon: "M6 18L18 6M6 6l12 12" },
                        { text: "Generic Design", icon: "M6 18L18 6M6 6l12 12" },
                        { text: "Basic Analytics", icon: "M6 18L18 6M6 6l12 12" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                          </div>
                          <span className="text-gray-600">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-8">
                      <button
                        className="block w-full rounded-md bg-gray-100 px-6 py-3 text-center text-base font-semibold text-gray-600 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all duration-300"
                      >
                        Limited Features
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-blue-600">Seamless Integrations</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Works with your favorite tools
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect Hoook with your existing marketing stack for a unified workflow
            </p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-7xl">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            >
              {[
                { name: "Adobe Experience", src: "/integrations/adobe-experience.png" },
                { name: "Beehive", src: "/integrations/beehive.png" },
                { name: "BigCommerce", src: "/integrations/bigcommerce.png" },
                { name: "Canva", src: "/integrations/canva.png" },
                { name: "ChatGPT", src: "/integrations/chatgpt.png" },
                { name: "Contentful", src: "/integrations/contentful.png" },
                { name: "Craft", src: "/integrations/craft.png" },
                { name: "Directus", src: "/integrations/directus.png" },
                { name: "Drupal", src: "/integrations/drupal.png" },
                { name: "Framer", src: "/integrations/framer.png" },
                { name: "Ghost", src: "/integrations/ghost.png" },
                { name: "Kentico", src: "/integrations/kentico.png" },
                { name: "Netlify", src: "/integrations/netlify.png" },
                { name: "Payload", src: "/integrations/payload.png" },
                { name: "Prismic", src: "/integrations/prismic.png" },
                { name: "Salesforce", src: "/integrations/salesforce.png" },
                { name: "Sanity", src: "/integrations/sanity.png" },
                { name: "Segment", src: "/integrations/segment.png" },
                { name: "Shopify", src: "/integrations/shopify.png" },
                { name: "Squarespace", src: "/integrations/squarespace.png" },
                { name: "Storyblok", src: "/integrations/storyblock.png" },
                { name: "Strapi", src: "/integrations/strapi.png" },
                { name: "Webflow", src: "/integrations/webflow.png" },
                { name: "Webhook", src: "/integrations/webhook.png" },
                { name: "Wix", src: "/integrations/wix.png" },
                { name: "WordPress", src: "/integrations/wordpress.png" },
                { name: "Zapier", src: "/integrations/zapier.png" },
              ].map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Link 
                href="/integrations" 
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                View all integrations
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div id="pricing" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the plan that works best for your marketing needs.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Enterprise Plan</h3>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Complete marketing automation with full content stack management. Perfect for teams looking to scale their marketing operations.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600">What&apos;s included</h4>
                <div className="h-px flex-auto bg-gray-100"></div>
              </div>
              <ul className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Full content stack management
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Unlimited agents & workflows
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Advanced automation
                </li>
                <li className="flex gap-x-3">
                  <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  24/7 dedicated support
                </li>
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Custom pricing for your needs</p>
                  <p className="mt-6 text-lg text-gray-900">
                    Get in touch to discuss your specific requirements and receive a tailored quote
                  </p>
                  <a
                    href="https://form.typeform.com/to/awrhYESs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Contact Sales
                  </a>
                  <p className="mt-6 text-xs leading-5 text-gray-600">
                    Flexible plans available for teams of all sizes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to transform your marketing with AI?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of businesses already leveraging our AI-powered marketing platform to drive growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="https://form.typeform.com/to/awrhYESs"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Schedule a Demo →
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
