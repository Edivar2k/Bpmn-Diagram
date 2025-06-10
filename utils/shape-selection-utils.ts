import type { ShapeType } from "@/components/shapes/types"

// Get the path for shape-based selection
export function getShapeSelectionPath(type: ShapeType, width: number, height: number, padding = 4): string {
  // Add padding to the shape dimensions
  const paddedWidth = width + padding * 2
  const paddedHeight = height + padding * 2

  // Adjust position to account for padding
  const offsetX = -padding
  const offsetY = -padding

  switch (type) {
    case "parallelogram": {
      // This determines where to place the top-left and bottom-right points of the parallelogram
      const skew = paddedWidth * 0.25
      return `M ${offsetX + skew} ${offsetY} 
              L ${offsetX + paddedWidth} ${offsetY} 
              L ${offsetX + paddedWidth - skew} ${offsetY + paddedHeight} 
              L ${offsetX} ${offsetY + paddedHeight} Z`
    }
    case "trapezoid": {
      // This determines how much to indent the top edge
      const indent = paddedWidth * 0.15
      return `M ${offsetX + indent} ${offsetY} 
              L ${offsetX + paddedWidth - indent} ${offsetY} 
              L ${offsetX + paddedWidth} ${offsetY + paddedHeight} 
              L ${offsetX} ${offsetY + paddedHeight} Z`
    }
    case "hexagon": {
      const sideWidth = paddedWidth * 0.2
      return `M ${offsetX + sideWidth} ${offsetY}
              L ${offsetX + paddedWidth - sideWidth} ${offsetY}
              L ${offsetX + paddedWidth} ${offsetY + paddedHeight / 2}
              L ${offsetX + paddedWidth - sideWidth} ${offsetY + paddedHeight}
              L ${offsetX + sideWidth} ${offsetY + paddedHeight}
              L ${offsetX} ${offsetY + paddedHeight / 2} Z`
    }
    case "rectangle": {
      // Use a small radius for slightly rounded corners
      const radius = 4
      return `M ${offsetX + radius} ${offsetY}
              L ${offsetX + paddedWidth - radius} ${offsetY}
              Q ${offsetX + paddedWidth} ${offsetY} ${offsetX + paddedWidth} ${offsetY + radius}
              L ${offsetX + paddedWidth} ${offsetY + paddedHeight - radius}
              Q ${offsetX + paddedWidth} ${offsetY + paddedHeight} ${offsetX + paddedWidth - radius} ${offsetY + paddedHeight}
              L ${offsetX + radius} ${offsetY + paddedHeight}
              Q ${offsetX} ${offsetY + paddedHeight} ${offsetX} ${offsetY + paddedHeight - radius}
              L ${offsetX} ${offsetY + radius}
              Q ${offsetX} ${offsetY} ${offsetX + radius} ${offsetY} Z`
    }
    case "ellipse": {
      // For ellipse, we'll use an SVG ellipse path
      const rx = paddedWidth / 2
      const ry = paddedHeight / 2
      const cx = offsetX + paddedWidth / 2
      const cy = offsetY + paddedHeight / 2
      return `M ${cx - rx} ${cy}
              A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}
              A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`
    }
    default:
      // Default to rectangle if shape type is not recognized
      return `M ${offsetX} ${offsetY} 
              L ${offsetX + paddedWidth} ${offsetY} 
              L ${offsetX + paddedWidth} ${offsetY + paddedHeight} 
              L ${offsetX} ${offsetY + paddedHeight} Z`
  }
}
