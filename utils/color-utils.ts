/**
 * Determines if a color is light or dark
 * @param color - Hex color code (e.g., "#FFFFFF")
 * @returns boolean - true if the color is light, false if dark
 */
export function isLightColor(color: string): boolean {
  // Default to assuming light if color is invalid
  if (!color || typeof color !== "string") return true

  // Handle different color formats
  let r, g, b

  // Handle hex colors
  if (color.startsWith("#")) {
    // Convert short hex (#RGB) to full hex (#RRGGBB) if needed
    const hex = color.length === 4 ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : color

    r = Number.parseInt(hex.slice(1, 3), 16)
    g = Number.parseInt(hex.slice(3, 5), 16)
    b = Number.parseInt(hex.slice(5, 7), 16)
  }
  // Handle rgb/rgba colors
  else if (color.startsWith("rgb")) {
    const rgbValues = color.match(/\d+/g)
    if (rgbValues && rgbValues.length >= 3) {
      r = Number.parseInt(rgbValues[0], 10)
      g = Number.parseInt(rgbValues[1], 10)
      b = Number.parseInt(rgbValues[2], 10)
    } else {
      return true // Default to light if parsing fails
    }
  }
  // Handle named colors by defaulting to light
  else {
    return true
  }

  // Calculate relative luminance using the formula from WCAG 2.0
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  // Return true if light, false if dark
  return luminance > 128
}

/**
 * Returns appropriate text color (black or white) based on background color
 * @param backgroundColor - Background color in any valid CSS format
 * @returns string - "#ffffff" for dark backgrounds, "#333333" for light backgrounds
 */
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? "#333333" : "#ffffff"
}

/**
 * Extracts fill color from SVG code
 * @param svgCode - SVG code as string
 * @returns string - Fill color or null if not found
 */
export function extractFillColorFromSvg(svgCode: string): string | null {
  if (!svgCode) return null

  // Try to find fill attribute
  const fillMatch = svgCode.match(/fill="([^"]+)"/)
  if (fillMatch && fillMatch[1]) {
    return fillMatch[1]
  }

  return null
}
