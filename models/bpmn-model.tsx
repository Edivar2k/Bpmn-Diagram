import {
  CircleIcon,
  RectangleIcon,
  DiamondIcon,
  HexagonIcon,
  RoundedRectangleIcon,
} from "@/components/icons/bpmn-icons"
import StartEventNode from "@/components/nodes/bpmn/start-event-node"
import EndEventNode from "@/components/nodes/bpmn/end-event-node"
import TaskNode from "@/components/nodes/bpmn/task-node"
import GatewayNode from "@/components/nodes/bpmn/gateway-node"
import SubprocessNode from "@/components/nodes/bpmn/subprocess-node"
import PoolNode from "@/components/nodes/bpmn/pool-node"
import LaneNode from "@/components/nodes/bpmn/lane-node"
import DataObjectNode from "@/components/nodes/bpmn/data-object-node"
import CustomNode from "@/components/nodes/custom-node"
import SequenceFlowEdge from "@/components/edges/bpmn/sequence-flow-edge"
import MessageFlowEdge from "@/components/edges/bpmn/message-flow-edge"
import AssociationEdge from "@/components/edges/bpmn/association-edge"
import CustomEdge from "@/components/edges/custom-edge"
import { validateBPMNConnection } from "@/utils/bpmn-validation"
import { ArrowRight, MessageSquare, LinkIcon } from "lucide-react"
import type { ModelDefinition } from "@/types/model-types"

export const bpmnModel: ModelDefinition = {
  id: "bpmn",
  name: "BPMN",
  description: "Business Process Model and Notation - Standard for business process modeling",
  thumbnail: "/models/bpmn-thumbnail.png",

  nodeTypes: {
    startEvent: StartEventNode,
    endEvent: EndEventNode,
    task: TaskNode,
    gateway: GatewayNode,
    subprocess: SubprocessNode,
    pool: PoolNode,
    lane: LaneNode,
    dataObject: DataObjectNode,
    custom: CustomNode,
  },

  edgeTypes: {
    sequenceFlow: SequenceFlowEdge,
    messageFlow: MessageFlowEdge,
    association: AssociationEdge,
    custom: CustomEdge,
  },

  defaultNodes: [
    {
      type: "startEvent",
      label: "Start Event",
      category: "Events",
      diagramType: "Process Diagram",
      component: StartEventNode,
      icon: <CircleIcon className="h-5 w-5 text-green-500" />,
      color: "#22c55e",
      description: "The beginning of a process",
    },
    {
      type: "endEvent",
      label: "End Event",
      category: "Events",
      diagramType: "Process Diagram",
      component: EndEventNode,
      icon: <CircleIcon className="h-5 w-5 text-red-500" strokeWidth={3} />,
      color: "#ef4444",
      description: "The end of a process",
    },
    {
      type: "task",
      label: "Task",
      category: "Activities",
      diagramType: "Process Diagram",
      component: TaskNode,
      icon: <RoundedRectangleIcon className="h-5 w-5 text-blue-500" />,
      color: "#3b82f6",
      description: "A unit of work in a process",
    },
    {
      type: "subprocess",
      label: "Subprocess",
      category: "Activities",
      diagramType: "Process Diagram",
      component: SubprocessNode,
      icon: <RoundedRectangleIcon className="h-5 w-5 text-purple-500" strokeWidth={2} />,
      color: "#a855f7",
      description: "A compound activity that contains other activities",
    },
    {
      type: "gateway",
      label: "Gateway",
      category: "Gateways",
      diagramType: "Process Diagram",
      component: GatewayNode,
      icon: <DiamondIcon className="h-5 w-5 text-orange-500" />,
      color: "#f97316",
      description: "Controls the flow of the process",
    },
    {
      type: "dataObject",
      label: "Data Object",
      category: "Data",
      diagramType: "Process Diagram",
      component: DataObjectNode,
      icon: <RectangleIcon className="h-5 w-5 text-gray-500" />,
      color: "#6b7280",
      description: "Represents data used in the process",
    },
    {
      type: "pool",
      label: "Pool",
      category: "Collaboration",
      diagramType: "Collaboration Diagram",
      component: PoolNode,
      icon: <RectangleIcon className="h-5 w-5 text-blue-600" strokeWidth={2} />,
      color: "#2563eb",
      description: "Represents a participant in a collaboration",
    },
    {
      type: "lane",
      label: "Lane",
      category: "Collaboration",
      diagramType: "Collaboration Diagram",
      component: LaneNode,
      icon: <RectangleIcon className="h-5 w-5 text-blue-400" strokeWidth={1} />,
      color: "#60a5fa",
      description: "Represents a role or responsibility within a pool",
    },
  ],

  defaultConnections: [
    {
      type: "sequenceFlow",
      label: "Sequence Flow",
      component: SequenceFlowEdge,
      icon: <ArrowRight className="h-5 w-5 text-blue-500" />,
      color: "#3b82f6",
      description: "Shows the order of activities in a process",
      possibleSourceTypes: ["startEvent", "task", "subprocess", "gateway"],
      possibleTargetTypes: ["endEvent", "task", "subprocess", "gateway"],
    },
    {
      type: "messageFlow",
      label: "Message Flow",
      component: MessageFlowEdge,
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      color: "#22c55e",
      description: "Shows communication between participants",
      possibleSourceTypes: ["startEvent", "task", "subprocess", "gateway", "pool", "lane"],
      possibleTargetTypes: ["endEvent", "task", "subprocess", "gateway", "pool", "lane"],
    },
    {
      type: "association",
      label: "Association",
      component: AssociationEdge,
      icon: <LinkIcon className="h-5 w-5 text-gray-500" />,
      color: "#6b7280",
      description: "Links data objects to activities",
      possibleSourceTypes: ["dataObject", "task", "subprocess"],
      possibleTargetTypes: ["dataObject", "task", "subprocess"],
    },
  ],

  validationRules: {
    validateConnection: validateBPMNConnection,
  },

  diagramTypes: [
    {
      id: "process-diagram",
      name: "Process Diagram",
      description: "Model business processes and workflows",
      nodeTypes: ["startEvent", "endEvent", "task", "subprocess", "gateway", "dataObject"],
    },
    {
      id: "collaboration-diagram",
      name: "Collaboration Diagram",
      description: "Model interactions between multiple participants",
      nodeTypes: ["pool", "lane", "startEvent", "endEvent", "task", "subprocess", "gateway"],
    },
    {
      id: "choreography-diagram",
      name: "Choreography Diagram",
      description: "Model message exchanges between participants",
      nodeTypes: ["startEvent", "endEvent", "task", "gateway"],
    },
  ],
} 