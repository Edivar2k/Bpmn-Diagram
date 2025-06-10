import { memo } from "react"
import type { EdgeProps } from "reactflow"
import FloatingEdgeBase from "./floating-edge-base"

function AggregationEdge(props: EdgeProps) {
  return (
    <FloatingEdgeBase
      {...props}
      renderEdge={({ id, edgePath, style, markerEnd }) => {
        // Create a custom marker ID for the purple arrow
        const markerId = `aggregation-arrow-${id}`

        return (
          <>
            {/* Define the purple arrow marker */}
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
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
              </marker>
            </defs>

            <path
              id={id}
              style={{ ...style, strokeDasharray: "3,3", stroke: "#a855f7" }} // Keep purple for this edge
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
                fill="#a855f7"
              >
                Aggregation
              </textPath>
            </text>
          </>
        )
      }}
    />
  )
}

export default memo(AggregationEdge)
