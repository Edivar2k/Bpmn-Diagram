"use client"

import { memo } from "react"
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow"
import type { EdgeProps } from "reactflow"
import type { BPMNEdgeData } from "@/types/bpmn-types"

const SequenceFlowEdge = ({
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
          stroke: selected ? "#3b82f6" : "#6b7280",
          strokeWidth: selected ? 3 : 2,
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
          {data?.conditionExpression && (
            <div className="bg-yellow-100 px-2 py-1 rounded border shadow-sm text-xs mt-1">
              [{data.conditionExpression}]
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(SequenceFlowEdge) 