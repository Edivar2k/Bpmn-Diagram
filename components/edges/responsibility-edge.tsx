import { memo } from "react"
import type { EdgeProps } from "reactflow"
import FloatingEdgeBase from "./floating-edge-base"

function ResponsibilityEdge(props: EdgeProps) {
  return (
    <FloatingEdgeBase
      {...props}
      renderEdge={({ id, edgePath, sourceX, sourceY, targetX, targetY, style }) => {
        // Create a custom marker ID for the red arrow
        const markerId = `responsibility-arrow-${id}`

        // Calculate the midpoint of the path for placing the red circle
        const midX = (sourceX + targetX) / 2
        const midY = (sourceY + targetY) / 2

        return (
          <>
            {/* Define the red arrow marker */}
            <defs>
              <marker
                id={markerId}
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="15" // Standardized size
                markerHeight="15" // Standardized size
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>

            <path
              id={id}
              style={{ ...style, stroke: "#9ca3af" }} // Lighter grey color
              className="react-flow__edge-path"
              d={edgePath}
              markerEnd={`url(#${markerId})`}
              strokeWidth={2}
            />

            {/* Red circle in the middle of the path - standardized size */}
            <circle cx={midX} cy={midY} r="9" fill="#ef4444" />
          </>
        )
      }}
    />
  )
}

export default memo(ResponsibilityEdge)
