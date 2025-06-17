import type { NodeData as BaseNodeData } from "./kaos-types"

export interface BPMNNodeData extends BaseNodeData {
  // BPMN specific properties
  processId?: string
  participantId?: string
  laneId?: string
  gatewayType?: "exclusive" | "inclusive" | "parallel"
  eventType?: "start" | "end" | "intermediate"
  taskType?: "user" | "service" | "script" | "manual"
  subprocessType?: "embedded" | "event" | "transaction"
  dataObjectType?: "input" | "output"
  poolType?: "participant" | "blackbox"
}

export interface BPMNEdgeData {
  // BPMN specific edge properties
  conditionExpression?: string
  defaultFlow?: boolean
  messageRef?: string
  associationDirection?: "none" | "one" | "both"
  sequenceFlowType?: "normal" | "conditional" | "default"
}

export interface BPMNProcess {
  id: string
  name: string
  isExecutable: boolean
  participants: BPMNParticipant[]
  lanes: BPMNLane[]
  dataObjects: BPMNDataObject[]
}

export interface BPMNParticipant {
  id: string
  name: string
  processRef: string
  lanes: BPMNLane[]
}

export interface BPMNLane {
  id: string
  name: string
  participantRef?: string
  flowNodeRefs: string[]
}

export interface BPMNDataObject {
  id: string
  name: string
  dataObjectRef: string
  state?: string
}

export interface BPMNValidationResult {
  valid: boolean
  message?: string
  severity?: "error" | "warning" | "info"
} 