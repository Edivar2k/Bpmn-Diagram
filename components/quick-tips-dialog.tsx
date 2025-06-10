"use client"

import { MousePointer, Link2, Layers, Save, X, RotateCcw, PenTool, GitMerge } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface QuickTipsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickTipsDialog({ open, onOpenChange }: QuickTipsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 sticky top-0 z-10 bg-white border-b relative space-y-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-6 h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <DialogTitle className="text-2xl font-bold mt-0">Meta4Model Quick Tips</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-80px)]">
          <div className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* LEFT COLUMN - Using flex to ensure equal height */}
              <div className="flex flex-col space-y-4 h-full">
                {/* Basic Operations */}
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <MousePointer className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Basic Operations</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag elements from the sidebar onto the canvas to build your diagram. Double-click nodes to edit
                    labels directly. Click on any node to edit its properties in the side panel.
                  </p>
                </div>

                {/* Connections - Now with image and updated text */}
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Link2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Creating Connections</h3>
                  </div>
                  <div className="flex flex-col items-center mb-3">
                    <Image
                      src="/connection-diagram.png"
                      alt="Connection diagram showing source and target handles"
                      width={280}
                      height={200}
                      className="my-2"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect nodes by dragging from a source handle (bottom) to a target handle (top) to establish
                    relationships. These relationships will be automatically validated.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN - Using flex to ensure equal height */}
              <div className="flex flex-col space-y-4 h-full">
                {/* Extensions Repository */}
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Layers className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Extensions Repository</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Community-created extensions to enhance your work. Here are a few examples:
                  </p>
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1 text-gray-700">Security Extension</h4>
                      <p className="text-xs text-gray-600">
                        Adds security-specific elements for threat modeling, vulnerability assessment, and security
                        requirements specification.
                      </p>
                    </div>
                    <div className="pb-3">
                      <h4 className="font-medium mb-1 text-gray-700">Safety Extension</h4>
                      <p className="text-xs text-gray-600">
                        Specialized elements for safety and hazard analysis, and safety requirement specification for
                        critical systems.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Your Work */}
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Save className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Save Your Work</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Export your work and import it later to continue. The result includes all nodes and connections.
                  </p>
                </div>

                {/* Reset Canvas */}
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <RotateCcw className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Reset Canvas</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Reset your work and start a new project by clicking the "Reset Canvas" button on the left panel.
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW - Custom Elements boxes without the title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <PenTool className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-purple-700 text-base">Custom Nodes</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Design your own node shapes with SVG, assign colors, and categorize them by diagram type. Perfect for
                  domain-specific elements like sensors, controllers, or specialized components.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <GitMerge className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-purple-700 text-base">Custom Connections</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Create specialized connection types with custom line styles, colors, and decorations. Add meaningful
                  relationships like "triggers", "monitors", or domain-specific interactions.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
