import { BaseEdge, BezierEdge, type EdgeProps } from "reactflow"

export default function SelfConnectingEdge(props: EdgeProps) {
  // we are using the default bezier edge when source and target ids are different
  if (props.source !== props.target) {
    return <BezierEdge {...props} />
  }

  const { sourceX, sourceY, targetX, targetY, id, markerEnd, data } = props

  // Create a self-loop with a nice curve
  const radiusX = 40 // Fixed radius for consistency
  const radiusY = 40

  // Adjust the path to create a proper self-loop
  const edgePath = `M ${sourceX} ${sourceY} 
                   C ${sourceX + radiusX} ${sourceY - radiusY} 
                     ${sourceX + radiusX} ${sourceY + radiusY} 
                     ${targetX} ${targetY}`

  // Use data from the edge if available, otherwise use defaults
  const color = data?.color || "#555"
  const lineStyle = data?.lineStyle || "solid"
  const label = data?.label || ""

  // Determine stroke dash array based on line style
  let strokeDasharray = ""
  if (lineStyle === "dashed") strokeDasharray = "5,5"
  if (lineStyle === "dotted") strokeDasharray = "1,3"

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeDasharray,
          strokeWidth: 2,
        }}
      />
      {/* Label for self-connecting edge */}
      {label && (
        <text
          x={sourceX + radiusX}
          y={sourceY - radiusY / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="12"
          fontFamily="sans-serif"
          className="react-flow__edge-text"
        >
          {label}
        </text>
      )}
    </>
  )
}
