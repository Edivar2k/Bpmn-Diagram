"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { BPMNNodeData } from "@/types/bpmn-types"

const GatewayNode = ({ data, selected }: NodeProps<BPMNNodeData>) => {
  return (
    <div
      className={`relative min-w-[80px] min-h-[80px] bg-white border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-orange-500 shadow-lg"
          : "border-orange-300 hover:border-orange-400"
      }`}
      style={{
        backgroundColor: data.nodeColor || "#ffffff",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      }}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
        style={{ top: "-6px" }}
      />

      {/* Node content */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div className="text-center">
          <div className="text-xs font-medium text-gray-900 truncate">
            {data.label || "Gateway"}
          </div>
          {data.gatewayType && (
            <div className="text-xs text-orange-600 mt-1 font-medium">
              {data.gatewayType}
            </div>
          )}
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
        style={{ bottom: "-6px" }}
      />

      {/* Selection indicator */}
      {selected && (
        <div 
          className="absolute inset-0 border-2 border-orange-500 pointer-events-none"
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
        />
      )}
    </div>
  )
}

export default memo(GatewayNode) 