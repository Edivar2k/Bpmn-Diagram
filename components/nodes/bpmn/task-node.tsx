"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const TaskNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[120px] min-h-[60px] bg-white border-2 rounded-lg shadow-sm transition-all duration-200 ${
        selected
          ? "border-blue-500 shadow-lg"
          : "border-gray-300 hover:border-gray-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ top: "-6px" }}
      />

      {/* Node content */}
      <div className="p-3 text-center">
        <div className="text-sm font-medium text-gray-900 truncate">
          {data.label || "Task"}
        </div>
        {data.description && (
          <div className="text-xs text-gray-500 mt-1 truncate">
            {data.description}
          </div>
        )}
        {data.taskType && (
          <div className="text-xs text-blue-600 mt-1 font-medium">
            {data.taskType}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {/* Selection indicator */}
      {selected && (
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}

export default memo(TaskNode) 