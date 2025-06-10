// Utility function to generate SVG path from points
export function generatePath(points: [number, number][]): string {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point[0]},${point[1]}`).join(" ") + " Z"
}

// Utility function to create a rounded rectangle path
export function generateRoundedRectPath(width: number, height: number, radius: number): string {
  if (radius > height / 2) radius = height / 2
  if (radius > width / 2) radius = width / 2

  return `
    M ${radius},0
    L ${width - radius},0
    Q ${width},0 ${width},${radius}
    L ${width},${height - radius}
    Q ${width},${height} ${width - radius},${height}
    L ${radius},${height}
    Q 0,${height} 0,${height - radius}
    L 0,${radius}
    Q 0,0 ${radius},0
    Z
  `
}

// Utility function to create an ellipse path
export function generateEllipsePath(width: number, height: number): string {
  const rx = width / 2
  const ry = height / 2
  const cx = width / 2
  const cy = height / 2

  // SVG ellipse path using arc commands
  return `
    M ${cx - rx},${cy}
    A ${rx},${ry} 0 1,0 ${cx + rx},${cy}
    A ${rx},${ry} 0 1,0 ${cx - rx},${cy}
    Z
  `
}
