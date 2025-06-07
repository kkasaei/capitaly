"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"
import Navigation from '@/components/Navigation'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  // Calculate prices based on billing period
  const getPrice = (monthlyPrice: number) => {
    if (isYearly) {
      return Math.round(monthlyPrice * 0.8) // 20% off for yearly
    }
    return monthlyPrice
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation />

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">Pricing</h1>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-16">
            <div className="flex items-center space-x-4 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !isYearly ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                MONTHLY
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors relative ${
                  isYearly ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                YEARLY
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Start Plan */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-black">${getPrice(120)}</span>
                    <span className="text-gray-600 ml-2">/{isYearly ? "month" : "month"}</span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-gray-500 mt-1">Billed annually (${getPrice(120) * 12}/year)</div>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Includes</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Up to 5 team members</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Basic investor matching</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Standard data room</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Email support</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden border-2 border-blue-500">
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-black">${getPrice(240)}</span>
                    <span className="text-gray-600 ml-2">/{isYearly ? "month" : "month"}</span>
                  </div>
                  {isYearly && (
                    <div className="text-sm text-gray-500 mt-1">Billed annually (${getPrice(240) * 12}/year)</div>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Everything in Start, plus:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Up to 20 team members</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Advanced investor matching</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Enhanced data room</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Custom branding</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">Get Started</Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-black">Custom</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Contact us for pricing</div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Everything in Pro, plus:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Unlimited team members</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Custom investor matching</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Custom integrations</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </div>
  )
}
