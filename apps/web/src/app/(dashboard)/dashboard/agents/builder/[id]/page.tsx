'use client'
import JourneyBuilder from "@/components/journeys/pages/journeyBuilder";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <JourneyBuilder campaignId={id} />;

  
}