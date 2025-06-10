"use client"

import { useState, useEffect } from "react"
import { X, MousePointer, ArrowRight, Edit2, Link2, Layers, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = typeof window !== "undefined" ? localStorage.getItem("kaosforge-visited") : null

    if (!hasVisitedBefore) {
      // Show the welcome popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    // Mark as visited
    if (typeof window !== "undefined") {
      localStorage.setItem("kaosforge-visited", "true")
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome to <span className="text-blue-600">KAOS</span>forge!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Your tool for creating KAOS goal models and requirements diagrams
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MousePointer className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Drag & Drop</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Drag elements from the sidebar onto the canvas to create your diagram.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Edit2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Edit Properties</h3>
                </div>
                <p className="text-sm text-gray-600">Click on any node to edit its properties in the side panel.</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Link2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Create Connections</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Select a connection type and drag between node handles to create relationships.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Custom Elements</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Create your own custom nodes and connections for specialized diagrams.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Layers className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Diagram Types</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Choose from Goal, Responsibility, Object, and Operation diagram elements to create comprehensive KAOS
                  models.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full mt-0.5">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Tip</h3>
                  <p className="text-sm text-gray-600">
                    Double-click on any node to quickly edit its label directly on the canvas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button onClick={handleClose} className="w-full">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
