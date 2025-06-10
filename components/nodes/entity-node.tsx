"use client"

import type React from "react"

import { memo, useState, useEffect, useRef } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import type { NodeData } from "@/types/kaos-types"
import Shape from "@/components/shapes"
import { useFixedNodeSize } from "@/hooks/use-fixed-node-size"

// Add this helper function before the component
const renderStereotypeAndTaggedValues = (data: NodeData) => {
  const hasStereotype = data.stereotype && data.stereotype.trim()
  const hasTaggedValues = data.taggedValues && data.taggedValues.length > 0

  if (!hasStereotype && !hasTaggedValues) return null

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
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

function EntityNode({ data, selected, id }: NodeProps<NodeData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  // Use our fixed node size hook with significantly increased padding
  const nodeWidth = useFixedNodeSize(data.label, {
    minWidth: 180,
    extraWidthForMetadata: (data.attributes?.length || 0) * 20,
    padding: 100,
  })

  // Calculate height based on number of attributes
  const getNodeHeight = () => {
    const baseHeight = 60
    const attributeHeight = 20
    const attributeCount = data.attributes?.length || 0
    return baseHeight + (attributeCount > 0 ? attributeHeight * attributeCount + 10 : 0)
  }

  const nodeHeight = getNodeHeight()

  // Initialize attributes if they don't exist
  useEffect(() => {
    if (!data.attributes) {
      data.attributes = []
    }
  }, [data])

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

  // Update the node dimensions in React Flow
  useEffect(() => {
    const nodeElement = document.querySelector(`[data-id="${id}"]`)
    if (nodeElement) {
      // Set the node dimensions to match the content dimensions
      nodeElement.style.width = `${nodeWidth}px`
      nodeElement.style.height = `${nodeHeight}px`
    }
  }, [id, nodeWidth, nodeHeight])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (label.trim() !== data.label) {
      data.label = label.trim() || "Entity"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      data.label = label.trim() || "Entity"
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  return (
    <div
      className="relative"
      onDoubleClick={handleDoubleClick}
      style={{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
    >
      {/* Standard rectangular selection outline */}
      {selected && (
        <div className="absolute -inset-2 rounded-md border-2 border-yellow-500 border-dashed pointer-events-none" />
      )}

      {/* Shape container - ensure it fills the entire node area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Shape type="rectangle" width={nodeWidth} height={nodeHeight} fill="#fef9c3" stroke="#eab308" strokeWidth={2} />
      </div>

      {renderStereotypeAndTaggedValues(data)}

      {/* Standard top target and bottom source handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-yellow-500 react-flow__handle-top"
        style={{ top: -4 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-yellow-500 react-flow__handle-bottom"
        style={{ bottom: -4 }}
      />

      <div className="absolute inset-0 flex flex-col py-2">
        <div className="p-2 border-b-2 border-yellow-500">
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm font-medium outline-none border-b border-yellow-500 text-center text-gray-600"
            />
          ) : (
            <div className="text-sm font-medium text-center px-8 text-gray-600 break-words">{data.label}</div>
          )}
        </div>
        {/* Attributes section */}
        {data.attributes && data.attributes.length > 0 && (
          <div className="p-2 text-xs">
            {data.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between px-4">
                <span className="text-gray-600 break-words">{attr.name}</span>
                <span className="text-gray-500 ml-1">{attr.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(EntityNode)
