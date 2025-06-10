"use client"

import { Download } from "lucide-react"
import { ImportExportDialog } from "@/components/import-export-dialog"
import { useDiagramContext } from "@/components/diagram-context"

export function ImportExportDialogWrapper() {
  const { exportDiagram, importDiagram } = useDiagramContext()

  return (
    <ImportExportDialog
      onExport={exportDiagram}
      onImport={importDiagram}
      triggerButtonProps={{
        variant: "outline",
        size: "sm",
        className: "flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
      }}
      triggerButtonContent={
        <>
          <Download className="h-4 w-4" />
          <span>Import / Export</span>
        </>
      }
    />
  )
}
