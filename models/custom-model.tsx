import type { ModelDefinition } from "@/types/model-types"
import CustomNode from "@/components/nodes/custom-node"
import CustomEdge from "@/components/edges/custom-edge"

// Define a minimal custom model with just the essential components
export const customModel: ModelDefinition = {
  id: "custom",
  name: "Custom Model",
  description: "Create your own modeling framework from scratch",
  thumbnail: "/models/custom-placeholder.png",
  nodeTypes: {
    custom: CustomNode,
  },
  edgeTypes: {
    custom: CustomEdge,
  },
  defaultNodes: [],
  defaultConnections: [],
  diagramTypes: [],
  // Update validation rules to use the validateConnection function
  validationRules: {
    validateConnection: (connection, nodes, edgeType, customConnections, customNodes) => {
      // Import the validation function from utils
      const { validateConnection } = require("@/utils/connection-validation")
      return validateConnection(connection, nodes, edgeType, customConnections, customNodes)
    },
  },
}
