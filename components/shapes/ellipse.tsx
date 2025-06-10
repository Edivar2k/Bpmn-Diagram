import type { ShapeProps } from "./types"
import { generateEllipsePath } from "@/utils/shape-utils"

function Ellipse({ width, height, ...svgAttributes }: ShapeProps) {
  const ellipsePath = generateEllipsePath(width, height)

  return <path d={ellipsePath} {...svgAttributes} />
}

export default Ellipse
