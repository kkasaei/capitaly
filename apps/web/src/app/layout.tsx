import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { PostHogProvider } from "@/components/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hoook",
  description: "A platform for creating and managing AI marketing agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
      <PostHogProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster position="bottom-right" />
            <GoogleAnalytics />
          </body>
        </html>
        </PostHogProvider>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
