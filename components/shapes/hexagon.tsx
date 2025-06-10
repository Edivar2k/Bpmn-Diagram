import type { ShapeProps } from "./types"
import { generatePath } from "@/utils/shape-utils"

function Hexagon({ width, height, ...svgAttributes }: ShapeProps) {
  const sideWidth = width * 0.2

  const hexagonPath = generatePath([
    [sideWidth, 0],
    [width - sideWidth, 0],
    [width, height / 2],
    [width - sideWidth, height],
    [sideWidth, height],
    [0, height / 2],
  ])

  return <path d={hexagonPath} {...svgAttributes} />
}

export default Hexagon
