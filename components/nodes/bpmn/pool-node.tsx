"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const PoolNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[200px] min-h-[120px] bg-white border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-blue-600 shadow-lg"
          : "border-blue-300 hover:border-blue-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
        borderWidth: "3px",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-600 border-2 border-white"
        style={{ top: "-6px" }}
      />

      <div className="p-4 text-center">
        <div className="text-sm font-medium text-gray-900 truncate">
          {data.label || "Pool"}
        </div>
        {data.poolType && (
          <div className="text-xs text-blue-600 mt-1 font-medium">
            {data.poolType}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-600 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {selected && (
        <div className="absolute inset-0 border-2 border-blue-600 pointer-events-none" />
      )}
    </div>
  )
}

export default memo(PoolNode) 