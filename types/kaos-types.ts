export interface EntityAttribute {
  name: string
  type: string
}

export interface TaggedValue {
  key: string
  value: string
}

export interface NodeData {
  label: string
  description?: string
  priority?: string
  status?: string
  severity?: string
  likelihood?: string
  verificationMethod?: string
  agentType?: string
  isNew?: boolean
  attributes?: EntityAttribute[]
  stereotype?: string // Add stereotype field
  taggedValues?: TaggedValue[] // Add tagged values field
  [key: string]: any
}

// Update the CustomNodeDefinition interface to include a diagramTypes field
export interface CustomNodeDefinition {
  id: string
  name: string
  svgCode: string
  color: string
  diagramTypes?: string[] // Change from diagramType to diagramTypes array
  createdAt: number
}

// Update the CustomConnectionDefinition interface to include a description field
export interface CustomConnectionDefinition {
  id: string
  name: string
  description?: string
  label?: string // Add label field
  lineSvgCode?: string
  markerSvgCode?: string
  color: string
  lineStyle: "solid" | "dashed" | "dotted"
  createdAt: number
  possibleSourceTypes?: string[] // Add this line for source node types
  possibleTargetTypes?: string[] // Add this line for target node types
}
