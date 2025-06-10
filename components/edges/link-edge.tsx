import { memo } from "react"
import type { EdgeProps } from "reactflow"
import FloatingEdgeBase from "./floating-edge-base"

function LinkEdge(props: EdgeProps) {
  return (
    <FloatingEdgeBase
      {...props}
      renderEdge={({ id, edgePath, style, markerEnd }) => {
        // Create a custom marker ID for the green arrow
        const markerId = `link-arrow-${id}`

        return (
          <>
            {/* Define the green arrow marker */}
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
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
              </marker>
            </defs>

            <path
              id={id}
              style={{ ...style, stroke: "#22c55e" }} // Keep green for this edge
              className="react-flow__edge-path"
              d={edgePath}
              markerEnd={`url(#${markerId})`}
              strokeWidth={2}
            />
            <text>
              <textPath
                href={`#${id}`}
                style={{ fontSize: 12 }}
                startOffset="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#22c55e"
              >
                Link
              </textPath>
            </text>
          </>
        )
      }}
    />
  )
}

export default memo(LinkEdge)
