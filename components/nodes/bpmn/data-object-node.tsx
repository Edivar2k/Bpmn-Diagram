"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const DataObjectNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[100px] min-h-[60px] bg-white border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-gray-500 shadow-lg"
          : "border-gray-300 hover:border-gray-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-500 border-2 border-white"
        style={{ top: "-6px" }}
      />

      <div className="p-2 text-center">
        <div className="text-xs font-medium text-gray-900 truncate">
          {data.label || "Data Object"}
        </div>
        {data.dataObjectType && (
          <div className="text-xs text-gray-600 mt-1 font-medium">
            {data.dataObjectType}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-500 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {selected && (
        <div className="absolute inset-0 border-2 border-gray-500 pointer-events-none" />
      )}
    </div>
  )
}

export default memo(DataObjectNode) 