"use client"

import type React from "react"

import { memo, useState, useEffect, useRef } from "react"
import type { NodeProps } from "reactflow"
import type { NodeData } from "@/types/kaos-types"
import Shape from "@/components/shapes"
import { useFixedNodeSize } from "@/hooks/use-fixed-node-size"

// Add this helper function before the component
const renderStereotypeAndTaggedValues = (data: NodeData) => {
  const hasStereotype = data.stereotype && data.stereotype.trim()
  const hasTaggedValues = data.taggedValues && data.taggedValues.length > 0

  if (!hasStereotype && !hasTaggedValues) return null

  return (
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
      {hasStereotype && (
        <div className="text-xs text-gray-500 bg-white/80 px-2 py-0.5 rounded border whitespace-nowrap">
          {data.stereotype}
        </div>
      )}
      {hasTaggedValues && (
        <div className="flex flex-wrap gap-1 justify-center max-w-48">
          {data.taggedValues.slice(0, 3).map((tv, index) => (
            <div
              key={index}
              className="text-xs text-gray-500 bg-white/80 px-1.5 py-0.5 rounded border whitespace-nowrap"
            >
              {tv.key}={tv.value}
            </div>
          ))}
          {data.taggedValues.length > 3 && (
            <div className="text-xs text-gray-500 bg-white/80 px-1.5 py-0.5 rounded border">
              +{data.taggedValues.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OperationNode({ data, selected, id }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  // Use our fixed node size hook with significantly increased padding
  const nodeWidth = useFixedNodeSize(data.label, {
    padding: 100,
    minWidth: 180,
  })

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Enable editing when the node is newly created
  useEffect(() => {
    if (mounted && data.isNew) {
      const timer = setTimeout(() => {
        setIsEditing(true)
        data.isNew = false
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [data, mounted])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (label.trim() !== data.label) {
      data.label = label.trim() || "Operation"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      data.label = label.trim() || "Operation"
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  // Fixed height for operation node
  const nodeHeight = 80

  return (
    <div
      className="relative"
      onDoubleClick={handleDoubleClick}
      style={{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
    >
      {/* Standard rectangular selection outline */}
      {selected && (
        <div className="absolute -inset-2 rounded-md border-2 border-purple-500 border-dashed pointer-events-none" />
      )}

      {/* Shape container - ensure it fills the entire node area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Shape type="ellipse" width={nodeWidth} height={nodeHeight} fill="#f3e8ff" stroke="#a855f7" strokeWidth={2} />
      </div>

      {renderStereotypeAndTaggedValues(data)}

      {/* Content overlay for the label */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-4/5 bg-transparent text-sm font-medium outline-none border-b border-purple-500 text-center text-gray-600"
          />
        ) : (
          <div className="px-12 text-sm font-medium text-center max-w-full flex flex-col justify-center h-full">
            <div className="text-gray-600 break-words">{data.label}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(OperationNode)
