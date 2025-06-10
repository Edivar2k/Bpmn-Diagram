"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to provide fixed node sizes based on text length
 * This avoids using ResizeObserver completely
 */
export function useFixedNodeSize(text: string, options = {}) {
  const {
    minWidth = 180, // Increased default minimum width from 120 to 180
    maxWidth = 400, // Increased default maximum width from 300 to 400
    charWidth = 8, // Approximate width of a character in pixels
    padding = 100, // Increased default padding from 50 to 100
    extraWidthForMetadata = 0, // Extra width for metadata like priority, status, etc.
  } = options

  const [width, setWidth] = useState(minWidth)

  useEffect(() => {
    // Calculate width based on text length
    const textLength = text?.length || 0
    const estimatedWidth = Math.min(
      maxWidth,
      Math.max(minWidth, textLength * charWidth + padding + extraWidthForMetadata),
    )

    // Only update if the width has changed significantly
    if (Math.abs(estimatedWidth - width) > 10) {
      setWidth(estimatedWidth)
    }
  }, [text, minWidth, maxWidth, charWidth, padding, extraWidthForMetadata, width])

  return width
}
