import type { Node, Edge } from "reactflow"
import type { CustomNodeDefinition, CustomConnectionDefinition } from "@/types/kaos-types"

export interface DiagramData {
  nodes: Node[]
  edges: Edge[]
  customNodes: CustomNodeDefinition[]
  customConnections: CustomConnectionDefinition[]
  version: string
}

/**
 * Prepares diagram data for export
 */
export function prepareDiagramForExport(
  nodes: Node[],
  edges: Edge[],
  customNodes: CustomNodeDefinition[],
  customConnections: CustomConnectionDefinition[],
): DiagramData {
  return {
    nodes,
    edges,
    customNodes,
    customConnections,
    version: "1.0.0", // Version for future compatibility checks
  }
}

/**
 * Exports diagram data as a JSON file
 */
export function exportDiagramToJson(data: DiagramData, filename = "kaos-diagram.json"): void {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2)

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a")
    a.href = url
    a.download = filename || "kaos-diagram.json" // Ensure we have a default filename

    // Append to body, click, and remove
    document.body.appendChild(a)
    a.click()

    // Small timeout to ensure the click event is processed
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error("Error exporting diagram:", error)
    throw new Error("Failed to export diagram")
  }
}

// Find the validateImportedData function and update it to be more lenient with SVG content

export function validateImportedData(data: any): { valid: boolean; message?: string } {
  // Check if data is an object
  if (!data || typeof data !== "object") {
    return { valid: false, message: "Invalid data format" }
  }

  // Check for required properties
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    return { valid: false, message: "Missing nodes or edges data" }
  }

  // Check for version compatibility
  if (!data.version) {
    return { valid: false, message: "Missing version information" }
  }

  // Ensure customNodes array exists and has valid SVG code
  if (Array.isArray(data.customNodes)) {
    data.customNodes.forEach((node: any) => {
      // Ensure SVG code is a string
      if (node.svgCode && typeof node.svgCode !== "string") {
        node.svgCode = String(node.svgCode)
      }
    })
  }

  // Basic validation passed
  return { valid: true }
}

/**
 * Imports diagram data from a JSON file
 */
export async function importDiagramFromJson(file: File): Promise<DiagramData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("Failed to read file"))
          return
        }

        const jsonData = JSON.parse(event.target.result as string)

        // Validate the imported data
        const validation = validateImportedData(jsonData)
        if (!validation.valid) {
          reject(new Error(validation.message || "Invalid diagram data"))
          return
        }

        resolve(jsonData as DiagramData)
      } catch (error) {
        reject(new Error("Invalid JSON format"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}
