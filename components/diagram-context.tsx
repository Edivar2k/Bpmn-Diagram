"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { DiagramData } from "@/utils/import-export-utils"
import type { Node, Edge } from "reactflow"
import type { NodeData } from "@/types/kaos-types"

type DiagramContextType = {
  exportDiagram: () => DiagramData
  importDiagram: (data: DiagramData) => void
  registerExportFunction: (fn: () => DiagramData) => void
  registerImportFunction: (fn: (data: DiagramData) => void) => void
  updateDiagramState: (nodes: Node<NodeData>[], edges: Edge[]) => void
  diagramState: {
    nodes: Node<NodeData>[]
    edges: Edge[]
  } | null
}

const defaultContext: DiagramContextType = {
  exportDiagram: () => ({
    nodes: [],
    edges: [],
    customNodes: [],
    customConnections: [],
    version: "1.0.0",
  }),
  importDiagram: () => {},
  registerExportFunction: () => {},
  registerImportFunction: () => {},
  updateDiagramState: () => {},
  diagramState: null,
}

const DiagramContext = createContext<DiagramContextType>(defaultContext)

export const useDiagramContext = () => useContext(DiagramContext)

export function DiagramProvider({ children }: { children: React.ReactNode }) {
  const [exportFn, setExportFn] = useState<() => DiagramData>(defaultContext.exportDiagram)
  const [importFn, setImportFn] = useState<(data: DiagramData) => void>(defaultContext.importDiagram)
  const [diagramState, setDiagramState] = useState<{
    nodes: Node<NodeData>[]
    edges: Edge[]
  } | null>(null)

  const registerExportFunction = useCallback((fn: () => DiagramData) => {
    setExportFn(() => fn)
  }, [])

  const registerImportFunction = useCallback((fn: (data: DiagramData) => void) => {
    setImportFn(() => fn)
  }, [])

  const exportDiagram = useCallback(() => {
    return exportFn()
  }, [exportFn])

  const importDiagram = useCallback(
    (data: DiagramData) => {
      importFn(data)
    },
    [importFn],
  )

  const updateDiagramState = useCallback((nodes: Node<NodeData>[], edges: Edge[]) => {
    setDiagramState({ nodes, edges })
  }, [])

  return (
    <DiagramContext.Provider
      value={{
        exportDiagram,
        importDiagram,
        registerExportFunction,
        registerImportFunction,
        updateDiagramState,
        diagramState,
      }}
    >
      {children}
    </DiagramContext.Provider>
  )
}
