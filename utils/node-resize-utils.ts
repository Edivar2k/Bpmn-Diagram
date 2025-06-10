import type { Node } from "reactflow"

/**
 * Updates the DOM element dimensions of a node to match its internal dimensions
 * @param nodeId The ID of the node to update
 * @param width The desired width
 * @param height The desired height
 */
export function updateNodeDimensions(nodeId: string, width: number, height: number): void {
  // Use setTimeout to ensure this runs after React Flow has rendered the node
  setTimeout(() => {
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`)
    if (nodeElement) {
      // Set the node dimensions to match the content dimensions
      nodeElement.style.width = `${width}px`
      nodeElement.style.height = `${height}px`
    }
  }, 0)
}

/**
 * Updates the dimensions of a node in the nodes array
 * @param nodes The array of nodes
 * @param nodeId The ID of the node to update
 * @param width The desired width
 * @param height The desired height
 * @returns A new array with the updated node
 */
export function updateNodeDimensionsInState(nodes: Node[], nodeId: string, width: number, height: number): Node[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        width,
        height,
      }
    }
    return node
  })
}
