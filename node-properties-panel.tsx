import { useStore } from "reactflow"

const NodePropertiesPanel = () => {
  const selectedNode = useStore((s) => s.getNode(s.selectedElements?.[0]?.id))

  if (!selectedNode) return null

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
      <h4>Node Properties</h4>
      {selectedNode && (
        <div>
          <p>
            <strong>ID:</strong> {selectedNode.id}
          </p>
          <p>
            <strong>Type:</strong> {selectedNode.type}
          </p>
          {/* Add more properties as needed based on your node data */}
        </div>
      )}
    </div>
  )
}

export default NodePropertiesPanel
