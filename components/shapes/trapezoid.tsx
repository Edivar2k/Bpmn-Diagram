import type { ShapeProps } from "./types"
import { generatePath } from "@/utils/shape-utils"

function Trapezoid({ width, height, ...svgAttributes }: ShapeProps) {
  // This determines how much to indent the top edge
  const indent = width * 0.15

  const trapezoidPath = generatePath([
    [0, height],
    [indent, 0],
    [width - indent, 0],
    [width, height],
  ])

  return <path d={trapezoidPath} {...svgAttributes} />
}

export default Trapezoid
