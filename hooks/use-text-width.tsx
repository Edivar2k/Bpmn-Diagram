"use client"

import { useState, useEffect, useRef } from "react"

/**
 * Custom hook to measure text width with debouncing
 * @param text The text to measure
 * @param deps Additional dependencies to trigger remeasurement
 * @param minWidth Minimum width to return
 * @returns The measured width or minWidth, whichever is larger
 */
export function useTextWidth(text: string, deps: any[] = [], minWidth = 120): number {
  const [width, setWidth] = useState(minWidth)
  const textRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce the measurement
    timeoutRef.current = setTimeout(() => {
      if (textRef.current) {
        const textWidth = textRef.current.scrollWidth
        const newWidth = Math.max(minWidth, textWidth + 40) // Add padding

        // Only update if width has changed significantly (prevent minor fluctuations)
        if (Math.abs(newWidth - width) > 5) {
          setWidth(newWidth)
        }
      }
    }, 50)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, minWidth, ...deps])

  return { width, textRef }
}
