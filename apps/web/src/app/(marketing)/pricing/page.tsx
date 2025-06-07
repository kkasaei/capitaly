"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"
import Navigation from '@/components/Navigation'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
          <div className="mb-16">
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
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-stretch h-full">
            {/* Start Plan */}
            <Card className="relative overflow-hidden flex flex-col h-full">
              <CardContent className="p-8 flex-1 flex flex-col">
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
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Training Material</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 px-8 py-5 text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden flex flex-col h-full bg-gradient-to-b from-transparent via-blue-100 to-red-200">
              <CardContent className="p-8 flex-1 flex flex-col bg-transparent">
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

                <div className="mt-auto">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 px-8 py-5 text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative overflow-hidden flex flex-col h-full">
              <CardContent className="p-8 flex-1 flex flex-col">
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
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">SOC2 compliance</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Advanced security features</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button className="w-full bg-black text-white hover:bg-gray-800 px-8 py-5 text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105">Contact Sales</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Price Comparison Table */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12">Detailed Feature Comparison</h2>
          <p className="text-xl text-gray-600 mb-12">Have questions? We're here to help you choose the right plan for your needs.</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Start</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Team Members</td>
                  <td className="text-center py-4 px-6">Up to 5</td>
                  <td className="text-center py-4 px-6">Up to 20</td>
                  <td className="text-center py-4 px-6">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Investor Matching</td>
                  <td className="text-center py-4 px-6">Basic</td>
                  <td className="text-center py-4 px-6">Advanced</td>
                  <td className="text-center py-4 px-6">Custom</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Data Room</td>
                  <td className="text-center py-4 px-6">Standard</td>
                  <td className="text-center py-4 px-6">Enhanced</td>
                  <td className="text-center py-4 px-6">Custom</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Support</td>
                  <td className="text-center py-4 px-6">Email</td>
                  <td className="text-center py-4 px-6">Priority</td>
                  <td className="text-center py-4 px-6">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payment">
              <AccordionTrigger className="text-xl font-semibold text-black">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="plans">
              <AccordionTrigger className="text-xl font-semibold text-black">
                Can I change plans later?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="trial">
              <AccordionTrigger className="text-xl font-semibold text-black">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We offer a 14-day free trial for all plans. No credit card required to start.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="team">
              <AccordionTrigger className="text-xl font-semibold text-black">
                What happens if I exceed my team member limit?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                You'll be notified when approaching your limit. You can upgrade your plan at any time to accommodate more team members.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <CTA />
      <Footer />
    </div>
  )
}
