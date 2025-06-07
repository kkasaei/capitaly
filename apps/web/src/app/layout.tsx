import "@/app/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { PostHogProvider } from "@/components/posthog-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capitaly",
  description: "The AI Fundraising Platform",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
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
          <body className={`${geistSans.className} ${geistMono.variable}`}>
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
