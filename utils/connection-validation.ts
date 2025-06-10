import type { Node, Connection } from "reactflow"
import type { NodeData, CustomNodeDefinition, CustomConnectionDefinition } from "@/types/kaos-types"

export interface ValidationResult {
  valid: boolean
  message?: string
}

// Helper function to get a readable name for a node type
const getReadableNodeTypeName = (nodeType: string, customNodes: CustomNodeDefinition[]): string => {
  // Check if it's a custom node type (format: custom-{nodeId})
  if (nodeType.startsWith("custom-")) {
    const customNodeId = nodeType.includes("custom-custom-")
      ? nodeType.substring(14) // Remove 'custom-custom-' prefix
      : nodeType.substring(7) // Remove 'custom-' prefix

    const customNode = customNodes.find((node) => node.id === customNodeId || node.id === `custom-${customNodeId}`)
    if (customNode) {
      return `Custom: ${customNode.name}`
    }
  }

  // Standard node types
  const nodeTypeMap: Record<string, string> = {
    goal: "Goal",
    requirement: "Requirement",
    expectation: "Expectation",
    domainProperty: "Domain Property",
    obstacle: "Obstacle",
    agent: "Agent",
    entity: "Entity",
    operation: "Operation",
    custom: "Custom Node",
  }

  return nodeTypeMap[nodeType] || nodeType
}

// Helper function to check if a node matches a type constraint
const nodeMatchesTypeConstraint = (
  node: Node<NodeData>,
  typeConstraint: string,
  customNodes: CustomNodeDefinition[],
): boolean => {
  // For standard node types, just compare directly
  if (node.type === typeConstraint) {
    return true
  }

  // For custom nodes, we need special handling
  if (typeConstraint.startsWith("custom-")) {
    // This is a constraint for a custom node type
    // Handle both formats: "custom-{id}" and "custom-custom-{id}"
    const constraintNodeId = typeConstraint.includes("custom-custom-")
      ? typeConstraint.substring(14) // Remove 'custom-custom-' prefix
      : typeConstraint.substring(7) // Remove 'custom-' prefix

    if (node.type === "custom") {
      // Method 1: Direct ID match - most reliable
      // Check if the node's customNodeId matches the constraint ID
      if (node.data?.customNodeId === constraintNodeId) {
        return true
      }

      // Method 2: Check if the node ID contains the custom node ID
      if (node.id.includes(constraintNodeId)) {
        return true
      }

      // Method 3: Find the exact custom node definition that matches this constraint
      const targetCustomNode = customNodes.find(
        (cn) => cn.id === `custom-${constraintNodeId}` || cn.id === constraintNodeId,
      )

      if (targetCustomNode) {
        // Only match if the SVG codes are identical
        if (targetCustomNode.svgCode === node.data?.svgCode) {
          return true
        }

        // Only match if the custom node IDs match exactly
        const nodeCustomId = node.data?.customNodeId
        const targetCustomId = targetCustomNode.id.startsWith("custom-")
          ? targetCustomNode.id.substring(7)
          : targetCustomNode.id

        if (nodeCustomId === targetCustomId) {
          return true
        }
      }
    }
  }

  return false
}

// Connection validation rules
export const validateConnection = (
  connection: Connection,
  nodes: Node<NodeData>[],
  edgeType: string,
  customConnections?: CustomConnectionDefinition[],
  customNodes?: CustomNodeDefinition[],
): ValidationResult => {
  // Find source and target nodes
  const sourceNode = nodes.find((node) => node.id === connection.source)
  const targetNode = nodes.find((node) => node.id === connection.target)

  if (!sourceNode || !targetNode) {
    return { valid: false, message: "Source or target node not found" }
  }

  // Check if this is a custom connection with source/target constraints
  if (customConnections && customConnections.length > 0) {
    const customConnection = customConnections.find((conn) => conn.id === edgeType)

    if (customConnection) {
      // Check source node type constraints
      if (customConnection.possibleSourceTypes && customConnection.possibleSourceTypes.length > 0) {
        // Check if the source node matches any of the allowed types
        const sourceMatches = customConnection.possibleSourceTypes.some((allowedType: string) =>
          nodeMatchesTypeConstraint(sourceNode, allowedType, customNodes || []),
        )

        if (!sourceMatches) {
          // Format the error message with readable node type names
          const allowedSourceTypes = customConnection.possibleSourceTypes
            .map((type: string) => getReadableNodeTypeName(type, customNodes || []))
            .join(", ")

          return {
            valid: false,
            message: `This connection can only start from: ${allowedSourceTypes}`,
          }
        }
      }

      // Check target node type constraints
      if (customConnection.possibleTargetTypes && customConnection.possibleTargetTypes.length > 0) {
        // Check if the target node matches any of the allowed types
        const targetMatches = customConnection.possibleTargetTypes.some((allowedType: string) =>
          nodeMatchesTypeConstraint(targetNode, allowedType, customNodes || []),
        )

        if (!targetMatches) {
          // Format the error message with readable node type names
          const allowedTargetTypes = customConnection.possibleTargetTypes
            .map((type: string) => getReadableNodeTypeName(type, customNodes || []))
            .join(", ")

          return {
            valid: false,
            message: `This connection can only connect to: ${allowedTargetTypes}`,
          }
        }
      }
    }
  }

  // Validate based on edge type
  switch (edgeType) {
    case "conflict":
      // Conflict can only happen between Goals
      if (sourceNode.type !== "goal" || targetNode.type !== "goal") {
        return {
          valid: false,
          message: "Conflict connections can only be created between Goal nodes",
        }
      }
      break
    // Add more validation rules for other edge types as needed
  }

  // If we reach here, the connection is valid
  return { valid: true }
}
