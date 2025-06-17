"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const LaneNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[180px] min-h-[100px] bg-white border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-blue-400 shadow-lg"
          : "border-blue-200 hover:border-blue-300"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
        borderWidth: "2px",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
        style={{ top: "-6px" }}
      />

      <div className="p-3 text-center">
        <div className="text-sm font-medium text-gray-900 truncate">
          {data.label || "Lane"}
        </div>
        {data.laneId && (
          <div className="text-xs text-blue-500 mt-1 font-medium">
            ID: {data.laneId}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {selected && (
        <div className="absolute inset-0 border-2 border-blue-400 pointer-events-none" />
      )}
    </div>
  )
}

export default memo(LaneNode) 