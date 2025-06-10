import { memo } from "react"
import type { EdgeProps } from "reactflow"
import FloatingEdgeBase from "./floating-edge-base"

function ConflictEdge(props: EdgeProps) {
  return (
    <FloatingEdgeBase
      {...props}
      renderEdge={({ id, edgePath, sourceX, sourceY, targetX, targetY, style, markerEnd }) => {
        // Calculate the midpoint of the path for placing the lightning bolt
        const midX = (sourceX + targetX) / 2
        const midY = (sourceY + targetY) / 2

        return (
          <>
            <path
              id={id}
              style={{ ...style, stroke: "#9ca3af" }} // Lighter grey color
              className="react-flow__edge-path"
              d={edgePath}
              markerEnd={markerEnd}
              strokeWidth={2}
            />

            {/* Red lightning bolt icon at the middle of the path - standardized size */}
            <svg
              x={midX - 9} // Centered for the new size
              y={midY - 9} // Centered for the new size
              width="18" // Standardized size
              height="18" // Standardized size
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 3V10H20L11 21V14H4L13 3Z"
                fill="#ef4444"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )
      }}
    />
  )
}

export default memo(ConflictEdge)
