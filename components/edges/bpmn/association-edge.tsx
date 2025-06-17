"use client"

import { memo } from "react"
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow"
import type { EdgeProps } from "reactflow"
import type { BPMNEdgeData } from "@/types/bpmn-types"

const AssociationEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps<BPMNEdgeData>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? "#6b7280" : "#9ca3af",
          strokeWidth: selected ? 2 : 1,
          strokeDasharray: "1,3",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <div className="bg-white px-2 py-1 rounded border shadow-sm text-xs">
              {data.label}
            </div>
          )}
          {data?.associationDirection && data.associationDirection !== "none" && (
            <div className="bg-gray-100 px-2 py-1 rounded border shadow-sm text-xs mt-1">
              {data.associationDirection}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(AssociationEdge) 