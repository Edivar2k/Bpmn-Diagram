"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Upload, AlertCircle } from "lucide-react"
import { exportDiagramToJson, importDiagramFromJson, type DiagramData } from "@/utils/import-export-utils"

interface ImportExportDialogProps {
  onExport?: () => DiagramData
  onImport?: (data: DiagramData) => void
  triggerButtonProps?: React.ComponentProps<typeof Button>
  triggerButtonContent?: React.ReactNode
}

export function ImportExportDialog({
  onExport,
  onImport,
  triggerButtonProps = {
    variant: "outline",
    size: "sm",
    className: "gap-2 w-full",
  },
  triggerButtonContent = (
    <>
      <Download className="h-4 w-4" />
      <span>Import / Export</span>
    </>
  ),
}: ImportExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"import" | "export">("export")
  const [filename, setFilename] = useState("kaos-diagram.json")
  const [error, setError] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      setError(null)

      // Ensure filename has .json extension
      let exportFilename = filename.trim()
      if (!exportFilename) {
        exportFilename = "kaos-diagram.json"
      } else if (!exportFilename.toLowerCase().endsWith(".json")) {
        exportFilename += ".json"
      }

      // Get diagram data from parent component
      if (onExport) {
        const data = onExport()
        // Export the diagram as a file
        exportDiagramToJson(data, exportFilename)
      } else {
        // Create empty diagram data if no onExport function is provided
        const emptyData: DiagramData = {
          nodes: [],
          edges: [],
          customNodes: [],
          customConnections: [],
          version: "1.0.0",
        }
        exportDiagramToJson(emptyData, exportFilename)
      }

      // Close dialog after successful export
      setTimeout(() => setIsOpen(false), 300)
    } catch (err) {
      console.error("Export error:", err)
      setError("Failed to export diagram. Please try again.")
    }
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setImportStatus("loading")

    try {
      const data = await importDiagramFromJson(file)
      if (onImport) {
        onImport(data)
      }
      setImportStatus("success")
      setIsOpen(false)
    } catch (err) {
      console.error("Import error:", err)
      setError(err instanceof Error ? err.message : "Failed to import diagram")
      setImportStatus("error")
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Custom button style class for the purple buttons
  const purpleButtonClass = "bg-[#cca8f0] text-[#330a5c] hover:bg-[#bc98e0] hover:text-[#330a5c]"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button {...triggerButtonProps}>{triggerButtonContent}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle>Import / Export Diagram</DialogTitle>
          <DialogDescription>Save your diagram as a JSON file or load a previously saved diagram.</DialogDescription>
        </DialogHeader>

        {/* Tab navigation */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "export"
                ? "border-b-2 border-primary text-gray-800 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("export")}
          >
            Export
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "import"
                ? "border-b-2 border-primary text-gray-800 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("import")}
          >
            Import
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Reduced height content area */}
        <div className="h-[150px] flex flex-col">
          {activeTab === "export" ? (
            <div className="h-full flex flex-col">
              <div className="flex-grow">
                <div className="mb-3">
                  <div className="grid grid-cols-12 items-center gap-4">
                    <Label htmlFor="filename" className="col-span-2 text-left">
                      Filename
                    </Label>
                    <Input
                      id="filename"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      placeholder="kaos-diagram.json"
                      className="col-span-10 h-9"
                    />
                  </div>
                </div>
                <div className="h-12">
                  <p className="text-sm text-muted-foreground">
                    This will export your diagram including all nodes, connections, and custom elements as a JSON file.
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-auto">
                <Button onClick={handleExport} className={`w-full ${purpleButtonClass}`}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Diagram
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-grow">
                <div className="mb-3">
                  <Label htmlFor="diagram-file" className="text-sm font-medium">
                    Upload Diagram File
                  </Label>
                  <Input
                    ref={fileInputRef}
                    id="diagram-file"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="h-12">
                  <p className="text-sm text-muted-foreground">
                    Import a previously exported KAOS diagram. This will replace your current diagram.
                  </p>
                </div>
              </div>

              <DialogFooter className="mt-auto">
                <Button
                  onClick={handleImportClick}
                  className={`w-full ${purpleButtonClass}`}
                  disabled={importStatus === "loading"}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {importStatus === "loading" ? "Importing..." : "Select File"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
