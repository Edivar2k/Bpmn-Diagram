"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useModelContext } from "@/contexts/model-context"
import KAOSDiagramEditor from "@/components/kaos-diagram-editor"
import { DiagramProvider, useDiagramContext } from "@/components/diagram-context"
import { ImportExportDialogWrapper } from "@/components/import-export-dialog-wrapper"
import { ExtensionsRepository } from "@/components/extensions-repository"
import { Button } from "@/components/ui/button"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { HelpPanel } from "@/components/help-panel"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function EditorContent() {
  const router = useRouter()
  const { selectedModel } = useModelContext()
  const { diagramState, exportDiagram } = useDiagramContext()
  const [isNavigationDialogOpen, setIsNavigationDialogOpen] = useState(false)

  // Redirect to model selection if no model is selected or if model is not fully initialized
  useEffect(() => {
    if (!selectedModel || !selectedModel.nodeTypes || !selectedModel.edgeTypes) {
      router.push("/")
    }
  }, [selectedModel, router])

  // Check if the canvas has content
  const hasCanvasContent = () => {
    return (diagramState?.nodes?.length || 0) > 0 || (diagramState?.edges?.length || 0) > 0
  }

  // Handle back button click
  const handleBackClick = () => {
    if (hasCanvasContent()) {
      setIsNavigationDialogOpen(true)
    } else {
      router.push("/")
    }
  }

  // Handle confirm navigation
  const handleConfirmNavigation = () => {
    setIsNavigationDialogOpen(false)
    router.push("/")
  }

  // If model is not fully initialized, show a loading state or return null
  if (!selectedModel || !selectedModel.nodeTypes || !selectedModel.edgeTypes) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading model...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex h-screen flex-col bg-gradient-to-br from-background to-background/95 relative overflow-hidden">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      {/* Header section */}
      <header className="border-b bg-white z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Models</span>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-700">
              <span>Meta4Model</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium ml-2">
              {selectedModel.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ExtensionsRepository />
          <ImportExportDialogWrapper />
          <Link
            href="https://www.objectiver.com/fileadmin/download/documents/KaosTutorial.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </Button>
          </Link>
          <HelpPanel />
        </div>
      </header>
      <div className="flex-1 relative overflow-hidden">
        <KAOSDiagramEditor model={selectedModel} />
      </div>

      {/* Navigation confirmation dialog */}
      <AlertDialog open={isNavigationDialogOpen} onOpenChange={setIsNavigationDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <div className="text-sm text-muted-foreground mb-6">
              <p>
                You have unsaved changes in your diagram. If you navigate away, your progress will be lost.{" "}
                <strong>
                  Consider exporting your diagram before leaving to save your work. You can import it later to continue
                  working on it.
                </strong>
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:mt-0 sm:mr-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation} className="bg-rose-500 hover:bg-rose-600 text-white">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

export default function EditorPage() {
  const router = useRouter()
  const { selectedModel } = useModelContext()

  // Redirect to model selection if no model is selected
  useEffect(() => {
    if (!selectedModel) {
      router.push("/")
    }
  }, [selectedModel, router])

  return (
    <DiagramProvider>
      <EditorContent />
    </DiagramProvider>
  )
}
