"use client"

import Navigation from '@/components/Navigation'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">Compliance</h1>
          <p className="text-xl text-gray-600">Coming soon...</p>
        </div>
      </div>

      <CTA />
      <Footer />
    </div>
  )
} 