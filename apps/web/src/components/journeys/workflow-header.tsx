/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useCallback } from "react"
import { Pencil, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function WorkflowHeader({
  journeyMode,
  journeyName,
  setJourneyName,
  setShowSaveConfirmation,
  isSaving,
}: {
  journeyMode: string
  journeyName: string
  setJourneyName: (name: string) => void
  setShowSaveConfirmation: (show: boolean) => void
  isSaving: boolean
}) {
  const router = useRouter();
  const { currentStep, setCurrentStep, isLastStep } = {
    currentStep: 1,
    setCurrentStep: (stepId: number) => { },
    isLastStep: false,
  }
  const [isRenaming, setIsRenaming] = useState(false)
  const [tempName, setTempName] = useState(journeyName)

  const handleStepClick = useCallback(
    (stepId: number) => {
      setCurrentStep(stepId)
    },
    [setCurrentStep],
  )

  const handleRename = useCallback(() => {
    setJourneyName(tempName)
    setIsRenaming(false)
  }, [tempName, setJourneyName])

  return (
    <div>
      <header className="flex h-16 items-center border-y bg-white px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="relative">
            <div className="flex items-center pr-4">
              <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-5 z-10 rounded-full">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Workflow</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter Workflow Name"
                    />
                    <button className="flex justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500" onClick={handleRename}>Save</button>
                  </div>
                </DialogContent>
              </Dialog>
              <Input className="text-sm font-medium text-gray-900" value={journeyName} readOnly />
            </div>
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center">
            <Tabs defaultValue="edit" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="executions">Executions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex justify-center items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              onClick={() => router.push("/dashboard/agents")}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowSaveConfirmation(true)}
              disabled={isSaving}
              className="flex justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Workflow"}
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

