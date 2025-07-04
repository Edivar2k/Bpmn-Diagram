import type { ShapeProps } from "./types"
import { generatePath } from "@/utils/shape-utils"

function Parallelogram({ width, height, ...svgAttributes }: ShapeProps) {
  // This determines where to place the top-left and bottom-right points of the parallelogram
  const skew = width * 0.25

  const parallelogramPath = generatePath([
    [0, height],
    [skew, 0],
    [width, 0],
    [width - skew, height],
  ])

  return <path d={parallelogramPath} {...svgAttributes} />
}

export default Parallelogram
