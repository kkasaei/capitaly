"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, HelpCircleIcon, ShieldCheckIcon, ExternalLinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data
const subscriptionData = {
  plan: "Pro",
  price: "$5,000",
  billingCycle: "monthly",
  nextBillingDate: "2024-05-01",
  status: "active",
  features: [
    "Unlimited API calls",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
    "Team collaboration",
    "Dedicated account manager"
  ]
};

// Add token usage data
const tokenUsage = {
  current: 2450,
  limit: 10000,
  percentage: 24.5,
  nextTier: {
    name: "Enterprise",
    price: "$10,000",
    limit: 20000
  }
};

const faqs = [
  {
    question: "How do I change my billing plan?",
    answer: "You can change your billing plan at any time from the billing page. Simply select your desired plan and follow the prompts to update your subscription."
  },
  {
    question: "What happens when I cancel?",
    answer: "When you cancel, you'll continue to have access to your current plan until the end of your billing period. After that, your account will be downgraded to the free tier."
  },
  {
    question: "Can I get a refund?",
    answer: "We offer refunds within 14 days of purchase if you're not satisfied with our service. Please contact our support team to process your refund request."
  }
];

export default function BillingPage() {
  const [isPayAsYouGo, setIsPayAsYouGo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayAsYouGoToggle = (checked: boolean) => {
    setIsPayAsYouGo(checked);
    if (checked) {
      // Show confirmation dialog
      if (window.confirm("Pay-as-you-go mode will charge you for any tokens used beyond your limit. Continue?")) {
        setIsPayAsYouGo(true);
      } else {
        setIsPayAsYouGo(false);
      }
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with your actual API endpoint
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error opening Stripe portal:', error);
      alert('Failed to open subscription management portal. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <Badge variant="outline" className="text-green-600 bg-green-50">
          Active
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Current Plan Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{subscriptionData.plan}</span>
              <span className="text-2xl font-bold">{subscriptionData.price}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>Next billing date: {subscriptionData.nextBillingDate}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">Plan Features:</h3>
              <ul className="space-y-2">
                {subscriptionData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Manage Subscription
                  <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Token Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold">T</span>
              </div>
              Token Usage
            </CardTitle>
            <CardDescription>Monitor your token consumption and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Usage</span>
                <span className="font-medium">{tokenUsage.current.toLocaleString()} tokens</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${tokenUsage.percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>0</span>
                <span>{tokenUsage.limit.toLocaleString()} tokens</span>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Need more tokens?</h4>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to {tokenUsage.nextTier.name} for {tokenUsage.nextTier.limit.toLocaleString()} tokens
                  </p>
                </div>
                <Button variant="default">
                  Upgrade Plan
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Pay-as-you-go Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    {isPayAsYouGo 
                      ? "You will be charged for tokens used beyond your limit"
                      : "Enable to use tokens beyond your limit"}
                  </p>
                </div>
                <Switch
                  checked={isPayAsYouGo}
                  onCheckedChange={handlePayAsYouGoToggle}
                />
              </div>
              {isPayAsYouGo && (
                <div className="text-sm text-muted-foreground">
                  <p>• Additional tokens will be charged at $0.01 per token</p>
                  <p>• Charges will be added to your next billing cycle</p>
                  <p>• You can disable this mode at any time</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Usage Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">API Calls</p>
                  <p className="text-lg font-medium">45,000</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Webhooks</p>
                  <p className="text-lg font-medium">12,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircleIcon className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to help you with any billing-related questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                For immediate assistance, please contact our support team:
              </p>
              <div className="flex gap-4">
                <Button variant="outline">Email Support</Button>
                <Button variant="outline">Live Chat</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
