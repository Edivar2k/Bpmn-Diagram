"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { ModelDefinition } from "@/types/model-types"

interface ModelContextProps {
  selectedModel: ModelDefinition | null
  setSelectedModel: (model: ModelDefinition) => void
}

const ModelContext = createContext<ModelContextProps | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<ModelDefinition | null>(null)

  return <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>{children}</ModelContext.Provider>
}

export function useModelContext() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error("useModelContext must be used within a ModelProvider")
  }
  return context
}
