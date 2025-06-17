"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const SubprocessNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[140px] min-h-[80px] bg-white border-2 rounded-lg shadow-sm transition-all duration-200 ${
        selected
          ? "border-purple-500 shadow-lg"
          : "border-purple-300 hover:border-purple-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
        borderWidth: "3px",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ top: "-6px" }}
      />

      <div className="p-3 text-center">
        <div className="text-sm font-medium text-gray-900 truncate">
          {data.label || "Subprocess"}
        </div>
        {data.subprocessType && (
          <div className="text-xs text-purple-600 mt-1 font-medium">
            {data.subprocessType}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {selected && (
        <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}

export default memo(SubprocessNode) 