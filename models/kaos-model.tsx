import {
  ParallelogramIcon,
  TrapezoidIcon,
  EllipseIcon,
  HexagonIcon,
  RectangleIcon,
} from "@/components/icons/kaos-icons"
import GoalNode from "@/components/nodes/goal-node"
import ObstacleNode from "@/components/nodes/obstacle-node"
import DomainPropertyNode from "@/components/nodes/domain-property-node"
import ExpectationNode from "@/components/nodes/expectation-node"
import RequirementNode from "@/components/nodes/requirement-node"
import AgentNode from "@/components/nodes/agent-node"
import EntityNode from "@/components/nodes/entity-node"
import OperationNode from "@/components/nodes/operation-node"
import CustomNode from "@/components/nodes/custom-node"
import ConflictEdge from "@/components/edges/conflict-edge"
import RefinementEdge from "@/components/edges/refinement-edge"
import LinkEdge from "@/components/edges/link-edge"
import AggregationEdge from "@/components/edges/aggregation-edge"
import ResponsibilityEdge from "@/components/edges/responsibility-edge"
import OperationalizationEdge from "@/components/edges/operationalization-edge"
import CustomEdge from "@/components/edges/custom-edge"
import { validateConnection } from "@/utils/connection-validation"
import { Zap, GitMerge, Wrench, LinkIcon, Layers } from "lucide-react"
import type { ModelDefinition } from "@/types/model-types"

export const kaosModel: ModelDefinition = {
  id: "kaos",
  name: "KAOS",
  description: "Keep All Objectives Satisfied - A goal-oriented requirements engineering methodology",
  thumbnail: "/models/kaos-thumbnail.png",

  nodeTypes: {
    goal: GoalNode,
    obstacle: ObstacleNode,
    domainProperty: DomainPropertyNode,
    expectation: ExpectationNode,
    requirement: RequirementNode,
    agent: AgentNode,
    entity: EntityNode,
    operation: OperationNode,
    custom: CustomNode,
  },

  edgeTypes: {
    conflict: ConflictEdge,
    refinement: RefinementEdge,
    link: LinkEdge,
    aggregation: AggregationEdge,
    responsibility: ResponsibilityEdge,
    operationalization: OperationalizationEdge,
    custom: CustomEdge,
  },

  defaultNodes: [
    {
      type: "goal",
      label: "Goal",
      category: "Goal Diagram",
      diagramType: "Goal Diagram",
      component: GoalNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-blue-500" />,
      color: "#3b82f6",
      description: "A prescriptive statement of intent that the system should satisfy",
    },
    {
      type: "requirement",
      label: "Requirement",
      category: "Goal Diagram",
      diagramType: "Goal Diagram",
      component: RequirementNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-blue-500" strokeWidth={3} />,
      color: "#3b82f6",
      description: "A goal assigned to an agent in the software-to-be",
    },
    {
      type: "expectation",
      label: "Expectation",
      category: "Goal Diagram",
      diagramType: "Goal Diagram",
      component: ExpectationNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-yellow-500" strokeWidth={3} />,
      color: "#eab308",
      description: "A goal assigned to an agent in the environment",
    },
    {
      type: "domainProperty",
      label: "Domain Property",
      category: "Goal Diagram",
      diagramType: "Goal Diagram",
      component: DomainPropertyNode,
      icon: <TrapezoidIcon className="h-5 w-5 text-blue-700" />,
      color: "#1d4ed8",
      description: "A descriptive statement about the environment",
    },
    {
      type: "obstacle",
      label: "Obstacle",
      category: "Goal Diagram",
      diagramType: "Goal Diagram",
      component: ObstacleNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-orange-500" />,
      color: "#f97316",
      description: "A condition that prevents a goal from being satisfied",
    },
    {
      type: "agent",
      label: "Agent",
      category: "Responsibility Diagram",
      diagramType: "Responsibility Diagram",
      component: AgentNode,
      icon: <HexagonIcon className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      description: "An active system component that carries out operations",
    },
    {
      type: "expectation",
      label: "Expectation",
      category: "Responsibility Diagram",
      diagramType: "Responsibility Diagram",
      component: ExpectationNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-yellow-500" strokeWidth={3} />,
      color: "#eab308",
      description: "A goal assigned to an agent in the environment",
    },
    {
      type: "requirement",
      label: "Requirement",
      category: "Responsibility Diagram",
      diagramType: "Responsibility Diagram",
      component: RequirementNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-blue-500" strokeWidth={3} />,
      color: "#3b82f6",
      description: "A goal assigned to an agent in the software-to-be",
    },
    {
      type: "entity",
      label: "Entity",
      category: "Object Diagram",
      diagramType: "Object Diagram",
      component: EntityNode,
      icon: <RectangleIcon className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      description: "A passive system component that operations act upon",
    },
    {
      type: "operation",
      label: "Operation",
      category: "Operation Diagram",
      diagramType: "Operation Diagram",
      component: OperationNode,
      icon: <EllipseIcon className="h-5 w-5 text-purple-500" />,
      color: "#a855f7",
      description: "An action performed by an agent to satisfy a requirement",
    },
    {
      type: "entity",
      label: "Entity",
      category: "Operation Diagram",
      diagramType: "Operation Diagram",
      component: EntityNode,
      icon: <RectangleIcon className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      description: "A passive system component that operations act upon",
    },
    {
      type: "requirement",
      label: "Requirement",
      category: "Operation Diagram",
      diagramType: "Operation Diagram",
      component: RequirementNode,
      icon: <ParallelogramIcon className="h-5 w-5 text-blue-500" strokeWidth={3} />,
      color: "#3b82f6",
      description: "A goal assigned to an agent in the software-to-be",
    },
    {
      type: "agent",
      label: "Agent",
      category: "Operation Diagram",
      diagramType: "Operation Diagram",
      component: AgentNode,
      icon: <HexagonIcon className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      description: "An active system component that carries out operations",
    },
  ],

  defaultConnections: [
    {
      type: "conflict",
      label: "Conflict",
      component: ConflictEdge,
      icon: <Zap className="h-5 w-5 text-red-500" />,
      color: "#ef4444",
      description: "Indicates conflicting goals",
      possibleSourceTypes: ["goal"],
      possibleTargetTypes: ["goal"],
    },
    {
      type: "refinement",
      label: "Refinement",
      component: RefinementEdge,
      icon: <GitMerge className="h-5 w-5 text-yellow-500" />,
      color: "#eab308",
      description: "Decomposes goals into subgoals",
    },
    {
      type: "responsibility",
      label: "Responsibility",
      component: ResponsibilityEdge,
      icon: <GitMerge className="h-5 w-5 text-red-500" />,
      color: "#ef4444",
      description: "Shows agent responsibility for goals/requirements",
    },
    {
      type: "operationalization",
      label: "Operationalization",
      component: OperationalizationEdge,
      icon: <Wrench className="h-5 w-5 text-blue-500" />,
      color: "#3b82f6",
      description: "Shows how operations implement requirements",
    },
    {
      type: "link",
      label: "Link",
      component: LinkEdge,
      icon: <LinkIcon className="h-5 w-5 text-green-500" />,
      color: "#22c55e",
      description: "General relationship",
    },
    {
      type: "aggregation",
      label: "Aggregation",
      component: AggregationEdge,
      icon: <Layers className="h-5 w-5 text-purple-500" />,
      color: "#a855f7",
      description: "Groups related elements",
    },
  ],

  validationRules: {
    validateConnection,
  },

  diagramTypes: [
    {
      id: "goal-diagram",
      name: "Goal Diagram",
      description: "Model system goals, requirements, and obstacles",
      nodeTypes: ["goal", "requirement", "expectation", "domainProperty", "obstacle"],
    },
    {
      id: "responsibility-diagram",
      name: "Responsibility Diagram",
      description: "Show agent responsibilities for requirements",
      nodeTypes: ["agent", "expectation", "requirement"],
    },
    {
      id: "object-diagram",
      name: "Object Diagram",
      description: "Model entities and their relationships",
      nodeTypes: ["entity"],
    },
    {
      id: "operation-diagram",
      name: "Operation Diagram",
      description: "Show operations that implement requirements",
      nodeTypes: ["operation", "entity", "requirement", "agent"],
    },
  ],
}
