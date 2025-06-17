import type { CustomNodeDefinition, CustomConnectionDefinition } from "@/types/kaos-types"
import type { BPMNValidationResult } from "@/types/bpmn-types"

export function validateBPMNConnection(
  connection: any,
  nodes: any[],
  edgeType: string,
  customConnections?: CustomConnectionDefinition[],
  customNodes?: CustomNodeDefinition[],
): BPMNValidationResult {
  const sourceNode = nodes.find((node) => node.id === connection.source)
  const targetNode = nodes.find((node) => node.id === connection.target)

  if (!sourceNode || !targetNode) {
    return {
      valid: false,
      message: "Source or target node not found",
      severity: "error",
    }
  }

  // Check for self-connection
  if (connection.source === connection.target) {
    return {
      valid: false,
      message: "Cannot connect a node to itself",
      severity: "error",
    }
  }

  // Validate based on edge type
  switch (edgeType) {
    case "sequenceFlow":
      return validateSequenceFlow(sourceNode, targetNode)
    case "messageFlow":
      return validateMessageFlow(sourceNode, targetNode)
    case "association":
      return validateAssociation(sourceNode, targetNode)
    default:
      // Check if it's a custom connection
      const customConnection = customConnections?.find((conn) => conn.id === edgeType)
      if (customConnection) {
        return validateCustomConnection(sourceNode, targetNode, customConnection)
      }
      return { valid: true }
  }
}

function validateSequenceFlow(sourceNode: any, targetNode: any): BPMNValidationResult {
  // Sequence flow rules
  const validSourceTypes = ["startEvent", "task", "subprocess", "gateway"]
  const validTargetTypes = ["endEvent", "task", "subprocess", "gateway"]

  if (!validSourceTypes.includes(sourceNode.type)) {
    return {
      valid: false,
      message: `Sequence flow cannot start from ${sourceNode.type}`,
      severity: "error",
    }
  }

  if (!validTargetTypes.includes(targetNode.type)) {
    return {
      valid: false,
      message: `Sequence flow cannot end at ${targetNode.type}`,
      severity: "error",
    }
  }

  // Check for multiple outgoing sequence flows from start event
  if (sourceNode.type === "startEvent") {
    return {
      valid: true,
      message: "Start event can have only one outgoing sequence flow",
      severity: "info",
    }
  }

  // Check for multiple incoming sequence flows to end event
  if (targetNode.type === "endEvent") {
    return {
      valid: true,
      message: "End event can have only one incoming sequence flow",
      severity: "info",
    }
  }

  return { valid: true }
}

function validateMessageFlow(sourceNode: any, targetNode: any): BPMNValidationResult {
  // Message flow rules
  const validTypes = ["startEvent", "task", "subprocess", "gateway", "pool", "lane"]

  if (!validTypes.includes(sourceNode.type)) {
    return {
      valid: false,
      message: `Message flow cannot start from ${sourceNode.type}`,
      severity: "error",
    }
  }

  if (!validTypes.includes(targetNode.type)) {
    return {
      valid: false,
      message: `Message flow cannot end at ${targetNode.type}`,
      severity: "error",
    }
  }

  // Message flows should connect different participants
  if (sourceNode.data?.participantId && targetNode.data?.participantId) {
    if (sourceNode.data.participantId === targetNode.data.participantId) {
      return {
        valid: false,
        message: "Message flow should connect different participants",
        severity: "warning",
      }
    }
  }

  return { valid: true }
}

function validateAssociation(sourceNode: any, targetNode: any): BPMNValidationResult {
  // Association rules
  const validTypes = ["dataObject", "task", "subprocess"]

  if (!validTypes.includes(sourceNode.type) && !validTypes.includes(targetNode.type)) {
    return {
      valid: false,
      message: "Association must connect a data object to an activity",
      severity: "error",
    }
  }

  // At least one end must be a data object
  if (sourceNode.type !== "dataObject" && targetNode.type !== "dataObject") {
    return {
      valid: false,
      message: "Association must have at least one data object",
      severity: "error",
    }
  }

  return { valid: true }
}

function validateCustomConnection(
  sourceNode: any,
  targetNode: any,
  customConnection: CustomConnectionDefinition,
): BPMNValidationResult {
  // Validate against custom connection rules
  if (customConnection.possibleSourceTypes && !customConnection.possibleSourceTypes.includes(sourceNode.type)) {
    return {
      valid: false,
      message: `Custom connection cannot start from ${sourceNode.type}`,
      severity: "error",
    }
  }

  if (customConnection.possibleTargetTypes && !customConnection.possibleTargetTypes.includes(targetNode.type)) {
    return {
      valid: false,
      message: `Custom connection cannot end at ${targetNode.type}`,
      severity: "error",
    }
  }

  return { valid: true }
}

// Additional BPMN-specific validation functions
export function validateBPMNProcess(nodes: any[], edges: any[]): BPMNValidationResult[] {
  const results: BPMNValidationResult[] = []

  // Check for at least one start event
  const startEvents = nodes.filter((node) => node.type === "startEvent")
  if (startEvents.length === 0) {
    results.push({
      valid: false,
      message: "Process must have at least one start event",
      severity: "error",
    })
  }

  // Check for at least one end event
  const endEvents = nodes.filter((node) => node.type === "endEvent")
  if (endEvents.length === 0) {
    results.push({
      valid: false,
      message: "Process must have at least one end event",
      severity: "error",
    })
  }

  // Check for orphaned nodes (nodes without connections)
  const connectedNodeIds = new Set()
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  nodes.forEach((node) => {
    if (!connectedNodeIds.has(node.id) && node.type !== "dataObject") {
      results.push({
        valid: false,
        message: `Node "${node.data?.label || node.id}" is not connected to the process flow`,
        severity: "warning",
      })
    }
  })

  return results
} 