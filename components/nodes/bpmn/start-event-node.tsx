"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const StartEventNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[80px] min-h-[80px] bg-white border-2 rounded-full shadow-sm transition-all duration-200 ${
        selected
          ? "border-green-500 shadow-lg"
          : "border-green-300 hover:border-green-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
      }}
    >
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {/* Node content */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-900 truncate">
            {data.label || "Start"}
          </div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-full pointer-events-none" />
      )}
    </div>
  )
}

export default memo(StartEventNode) 