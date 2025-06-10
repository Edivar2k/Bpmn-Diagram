import type React from "react"
import type { NodeTypes, EdgeTypes } from "reactflow"
import type { CustomNodeDefinition, CustomConnectionDefinition } from "./kaos-types"

export interface ModelDefinition {
  id: string
  name: string
  description: string
  thumbnail: string
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  defaultNodes: ModelNodeDefinition[]
  defaultConnections: ModelConnectionDefinition[]
  validationRules?: ValidationRules
  diagramTypes?: DiagramType[]
}

export interface ModelNodeDefinition {
  type: string
  label: string
  category: string
  diagramType?: string
  component: React.ComponentType<any>
  icon: React.ReactNode | string
  color?: string
  description?: string
}

export interface ModelConnectionDefinition {
  type: string
  label: string
  component: React.ComponentType<any>
  icon?: React.ReactNode | string
  color?: string
  description?: string
  possibleSourceTypes?: string[]
  possibleTargetTypes?: string[]
}

export interface DiagramType {
  id: string
  name: string
  description: string
  nodeTypes: string[]
}

export interface ValidationRules {
  validateConnection: (
    connection: any,
    nodes: any[],
    edgeType: string,
    customConnections?: CustomConnectionDefinition[],
    customNodes?: CustomNodeDefinition[],
  ) => { valid: boolean; message?: string }
}

export interface ModelContextType {
  selectedModel: ModelDefinition | null
  setSelectedModel: (model: ModelDefinition) => void
}
