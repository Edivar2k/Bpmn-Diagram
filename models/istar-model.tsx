import type { ModelDefinition } from "@/types/model-types"

// Define the i* model as a placeholder
export const istarModel: ModelDefinition = {
  id: "istar",
  name: "i* Framework",
  description: "A goal-oriented modeling framework for early requirements engineering",
  thumbnail: "/models/i-star-placeholder.png",

  // Empty node types and edge types since this is now a coming soon model
  nodeTypes: {},
  edgeTypes: {},
  defaultNodes: [],
  defaultConnections: [],

  diagramTypes: [
    {
      id: "sd",
      name: "Strategic Dependency Diagram",
      description: "Shows dependencies between actors",
      nodeTypes: [],
    },
    {
      id: "sr",
      name: "Strategic Rationale Diagram",
      description: "Shows internal rationale of actors",
      nodeTypes: [],
    },
  ],

  validationRules: {
    validateConnection: () => ({ valid: true }),
  },

  documentationUrl: "#",
}
