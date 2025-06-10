"use client"

import { useEffect } from "react"

/**
 * Custom hook to suppress ResizeObserver loop errors
 * This is a more aggressive approach that completely prevents these errors from surfacing
 */
export function useResizeObserverErrorSuppressor() {
  useEffect(() => {
    // Original console.error function
    const originalConsoleError = console.error

    // Override console.error to filter out ResizeObserver errors
    console.error = (...args) => {
      // Check if this is a ResizeObserver error
      if (
        args[0] &&
        typeof args[0] === "string" &&
        (args[0].includes("ResizeObserver loop") ||
          args[0].includes("ResizeObserver loop completed with undelivered notifications") ||
          args[0].includes("ResizeObserver loop limit exceeded"))
      ) {
        // Ignore this error
        return
      }

      // Pass through all other errors to the original console.error
      originalConsoleError.apply(console, args)
    }

    // Error event handler for window errors
    const errorHandler = (e: ErrorEvent) => {
      if (
        e.message.includes("ResizeObserver loop") ||
        e.message.includes("ResizeObserver loop completed with undelivered notifications") ||
        e.message.includes("ResizeObserver loop limit exceeded")
      ) {
        // Prevent the error from propagating
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }

    // Unhandled rejection handler
    const rejectionHandler = (e: PromiseRejectionEvent) => {
      if (e.reason && typeof e.reason.message === "string" && e.reason.message.includes("ResizeObserver")) {
        e.preventDefault()
      }
    }

    window.addEventListener("error", errorHandler, true)
    window.addEventListener("unhandledrejection", rejectionHandler, true)

    return () => {
      // Restore original console.error
      console.error = originalConsoleError

      window.removeEventListener("error", errorHandler, true)
      window.removeEventListener("unhandledrejection", rejectionHandler, true)
    }
  }, [])
}
