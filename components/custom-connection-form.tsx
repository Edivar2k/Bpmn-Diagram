"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { CustomConnectionDefinition, CustomNodeDefinition } from "@/types/kaos-types"
// Add these imports at the top of the file
import { Checkbox } from "@/components/ui/checkbox"

interface CustomConnectionFormProps {
  onSave: (connection: CustomConnectionDefinition) => void
  customNodes: CustomNodeDefinition[] // Add this line
  isCustomModel?: boolean
}

export function CustomConnectionForm({ onSave, customNodes, isCustomModel = false }: CustomConnectionFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [label, setLabel] = useState("") // Add this line for the label
  const [lineSvgCode, setLineSvgCode] = useState("")
  const [markerSvgCode, setMarkerSvgCode] = useState("")
  const [color, setColor] = useState("#4b5563") // Default gray color
  const [lineStyle, setLineStyle] = useState<"solid" | "dashed" | "dotted">("solid")
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [previewLineSvg, setPreviewLineSvg] = useState<string | null>(null)
  const [previewMarkerSvg, setPreviewMarkerSvg] = useState<string | null>(null)
  const svgContainerRef = useRef<HTMLDivElement>(null)

  // Add these state variables after the other useState declarations
  const [isEdgeLabelExpanded, setIsEdgeLabelExpanded] = useState(false)
  const [isLineDecorationExpanded, setIsLineDecorationExpanded] = useState(false)
  const [isEndMarkerExpanded, setIsEndMarkerExpanded] = useState(false)
  // Update the useState declarations to include the new state variables
  const [possibleSourceTypes, setPossibleSourceTypes] = useState<string[]>([])
  const [possibleTargetTypes, setPossibleTargetTypes] = useState<string[]>([])
  const [isNodeConstraintsExpanded, setIsNodeConstraintsExpanded] = useState(false)

  // Reset form when dialog is opened - update to include description
  useEffect(() => {
    if (isOpen) {
      setName("")
      setDescription("")
      setLabel("") // Add this line
      setLineSvgCode("")
      setMarkerSvgCode("")
      setColor("#4b5563")
      setLineStyle("solid")
      setError(null)
      setPreviewLineSvg(null)
      setPreviewMarkerSvg(null)
    }
  }, [isOpen])

  // Add this after the other useEffect hooks
  // Reset form when dialog is opened - update to include source and target types
  useEffect(() => {
    if (isOpen) {
      setName("")
      setDescription("")
      setLabel("")
      setLineSvgCode("")
      setMarkerSvgCode("")
      setColor("#4b5563")
      setLineStyle("solid")
      setPossibleSourceTypes([])
      setPossibleTargetTypes([])
      setError(null)
      setPreviewLineSvg(null)
      setPreviewMarkerSvg(null)
    }
  }, [isOpen])

  // Update preview when SVG code changes
  useEffect(() => {
    if (lineSvgCode.trim()) {
      try {
        // Basic validation
        if (!lineSvgCode.includes("<svg") || !lineSvgCode.includes("</svg>")) {
          setPreviewLineSvg(null)
          return
        }

        setPreviewLineSvg(lineSvgCode)
      } catch (err) {
        setPreviewLineSvg(null)
      }
    } else {
      setPreviewLineSvg(null)
    }
  }, [lineSvgCode])

  // Update marker preview when SVG code changes
  useEffect(() => {
    if (markerSvgCode.trim()) {
      try {
        // Basic validation
        if (!markerSvgCode.includes("<svg") || !markerSvgCode.includes("</svg>")) {
          setPreviewMarkerSvg(null)
          return
        }

        setPreviewMarkerSvg(markerSvgCode)
      } catch (err) {
        setPreviewMarkerSvg(null)
      }
    } else {
      setPreviewMarkerSvg(null)
    }
  }, [markerSvgCode])

  const validateSvg = (svg: string): boolean => {
    if (!svg.trim()) return true // Empty SVG is valid (will use default)

    // Basic validation
    if (!svg.includes("<svg") || !svg.includes("</svg>")) {
      setError("Invalid SVG code. Must contain <svg> tags.")
      return false
    }

    try {
      // Create a DOM parser
      const parser = new DOMParser()
      const doc = parser.parseFromString(svg, "image/svg+xml")

      // Check for parsing errors
      const parserError = doc.querySelector("parsererror")
      if (parserError) {
        setError("Invalid SVG code. Parser error.")
        return false
      }

      // Check if the root element is an SVG
      const rootElement = doc.documentElement
      if (rootElement.tagName !== "svg") {
        setError("Invalid SVG code. Root element must be <svg>.")
        return false
      }

      return true
    } catch (err) {
      setError("Invalid SVG code. Could not parse.")
      return false
    }
  }

  // Update the handleSave function to include the description
  // Update the handleSave function to include the source and target types
  const handleSave = () => {
    // Reset error
    setError(null)

    // Validate inputs
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    // Validate SVGs if provided
    if (lineSvgCode.trim() && !validateSvg(lineSvgCode)) {
      return
    }

    if (markerSvgCode.trim() && !validateSvg(markerSvgCode)) {
      return
    }

    // Create custom connection definition
    const customConnection: CustomConnectionDefinition = {
      id: `custom-connection-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      label: label.trim() || undefined,
      lineSvgCode: lineSvgCode.trim() || undefined,
      markerSvgCode: markerSvgCode.trim() || undefined,
      color,
      lineStyle,
      createdAt: Date.now(),
      possibleSourceTypes: possibleSourceTypes.length > 0 ? possibleSourceTypes : undefined,
      possibleTargetTypes: possibleTargetTypes.length > 0 ? possibleTargetTypes : undefined,
    }

    // Save the custom connection
    onSave(customConnection)
    setIsOpen(false)
  }

  // Add this function to handle checkbox changes for source types
  const handleSourceTypeChange = (type: string, checked: boolean) => {
    setPossibleSourceTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  // Add this function to handle checkbox changes for target types
  const handleTargetTypeChange = (type: string, checked: boolean) => {
    setPossibleTargetTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  // Update the nodeTypes useMemo function to use the correct format for custom node values:

  // Replace the nodeTypes constant with this:
  const nodeTypes = useMemo(() => {
    // For custom models, only show custom nodes
    if (isCustomModel) {
      return customNodes.map((node) => {
        // Extract the ID without the "custom-" prefix if it exists
        const nodeId = node.id.startsWith("custom-") ? node.id : `custom-${node.id}`
        return {
          value: nodeId,
          label: `Custom: ${node.name}`,
        }
      })
    }

    // Standard node types for KAOS model
    const standardTypes = [
      { value: "goal", label: "Goal" },
      { value: "requirement", label: "Requirement" },
      { value: "expectation", label: "Expectation" },
      { value: "domainProperty", label: "Domain Property" },
      { value: "obstacle", label: "Obstacle" },
      { value: "agent", label: "Agent" },
      { value: "entity", label: "Entity" },
      { value: "operation", label: "Operation" },
    ]

    // Add custom node types - use the correct format for the value
    // IMPORTANT: Fix the format to avoid double "custom-" prefix
    const customTypes = customNodes.map((node) => {
      // Extract the ID without the "custom-" prefix if it exists
      const nodeId = node.id.startsWith("custom-") ? node.id : `custom-${node.id}`
      return {
        value: nodeId, // Use the node ID directly, not "custom-{node.id}"
        label: `Custom: ${node.name}`,
      }
    })

    return [...standardTypes, ...customTypes]
  }, [customNodes, isCustomModel])

  // Custom button style class for the purple buttons
  const purpleButtonClass = "bg-[#cca8f0] text-[#330a5c] hover:bg-[#bc98e0] hover:text-[#330a5c]"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex w-full justify-start gap-2">
          <Plus className="h-5 w-5" />
          <span>Create Custom Connection</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <div className="sticky top-0 z-10 bg-white border-b">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Create Custom Connection</DialogTitle>
            <DialogDescription>
              Define a custom connection with your own SVG decorations, color, and line style.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 pt-0">
          <div className="grid gap-6 py-4 pb-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">Basic Information</h3>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="My Custom Connection"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Describes the purpose of this connection"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-16"
                  />
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1"
                    placeholder="#4b5563"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Line Style</Label>
                <RadioGroup
                  value={lineStyle}
                  onValueChange={(value) => setLineStyle(value as "solid" | "dashed" | "dotted")}
                  className="col-span-3 flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="solid" className="border-[#cca8f0] text-[#cca8f0]" />
                    <Label htmlFor="solid" className="cursor-pointer flex items-center">
                      <svg width="40" height="20" viewBox="0 0 40 20" className="mr-1">
                        <line x1="5" y1="10" x2="35" y2="10" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Solid
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dashed" id="dashed" className="border-[#cca8f0] text-[#cca8f0]" />
                    <Label htmlFor="dashed" className="cursor-pointer flex items-center">
                      <svg width="40" height="20" viewBox="0 0 40 20" className="mr-1">
                        <line
                          x1="5"
                          y1="10"
                          x2="35"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="5,3"
                        />
                      </svg>
                      Dashed
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dotted" id="dotted" className="border-[#cca8f0] text-[#cca8f0]" />
                    <Label htmlFor="dotted" className="cursor-pointer flex items-center">
                      <svg width="40" height="20" viewBox="0 0 40 20" className="mr-1">
                        <line
                          x1="5"
                          y1="10"
                          x2="35"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="1,3"
                        />
                      </svg>
                      Dotted
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Connection Appearance Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">Connection Advanced Configs</h3>

              {/* Edge Label Subsection */}
              <div className="border rounded-md p-4">
                <button
                  type="button"
                  onClick={() => setIsEdgeLabelExpanded(!isEdgeLabelExpanded)}
                  className="flex w-full items-center justify-between text-sm font-medium mb-2 text-left focus:outline-none"
                >
                  <span>Edge Label (Optional)</span>
                  <span className="text-muted-foreground">{isEdgeLabelExpanded ? "−" : "+"}</span>
                </button>

                {isEdgeLabelExpanded && (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">
                      Add a text label that will be displayed along the connection line. The label will inherit the
                      connection color.
                    </p>

                    <div className="mt-4">
                      <Label htmlFor="label" className="block mb-2">
                        Label Text
                      </Label>
                      <Input
                        id="label"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g., 'connects to' or 'depends on'"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Line Decoration Subsection */}
              <div className="border rounded-md p-4">
                <button
                  type="button"
                  onClick={() => setIsLineDecorationExpanded(!isLineDecorationExpanded)}
                  className="flex w-full items-center justify-between text-sm font-medium mb-2 text-left focus:outline-none"
                >
                  <span>Line Decoration (Optional)</span>
                  <span className="text-muted-foreground">{isLineDecorationExpanded ? "−" : "+"}</span>
                </button>

                {isLineDecorationExpanded && (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">
                      The SVG will be placed at the midpoint of the connection. Use "currentColor" for fill/stroke to
                      inherit the connection color.
                    </p>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-8">
                        <Label htmlFor="lineSvg" className="mb-2 block">
                          Line Decoration SVG
                        </Label>
                        <Textarea
                          id="lineSvg"
                          value={lineSvgCode}
                          onChange={(e) => setLineSvgCode(e.target.value)}
                          className="font-mono text-xs h-[120px]"
                          placeholder='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="4" fill="currentColor" />
</svg>'
                        />
                      </div>

                      <div className="col-span-4">
                        <Label className="mb-2 block">Preview</Label>
                        <div className="border rounded-md p-4 flex items-center justify-center bg-gray-50 h-[120px]">
                          {previewLineSvg ? (
                            <div
                              className="w-16 h-16 flex items-center justify-center"
                              style={{ color: color }}
                              dangerouslySetInnerHTML={{ __html: previewLineSvg }}
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground text-center">No SVG preview available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* End Marker Subsection */}
              <div className="border rounded-md p-4">
                <button
                  type="button"
                  onClick={() => setIsEndMarkerExpanded(!isEndMarkerExpanded)}
                  className="flex w-full items-center justify-between text-sm font-medium mb-2 text-left focus:outline-none"
                >
                  <span>End Marker (Optional)</span>
                  <span className="text-muted-foreground">{isEndMarkerExpanded ? "−" : "+"}</span>
                </button>

                {isEndMarkerExpanded && (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">
                      The SVG will be placed at the end of the connection. Use "currentColor" for fill/stroke to inherit
                      the connection color.
                    </p>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-8">
                        <Label htmlFor="markerSvg" className="mb-2 block">
                          End Marker SVG
                        </Label>
                        <Textarea
                          id="markerSvg"
                          value={markerSvgCode}
                          onChange={(e) => setMarkerSvgCode(e.target.value)}
                          className="font-mono text-xs h-[120px]"
                          placeholder='<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
</svg>'
                        />
                      </div>

                      <div className="col-span-4">
                        <Label className="mb-2 block">Preview</Label>
                        <div className="border rounded-md p-4 flex items-center justify-center bg-gray-50 h-[120px]">
                          {previewMarkerSvg ? (
                            <div
                              className="w-16 h-16 flex items-center justify-center"
                              style={{ color: color }}
                              dangerouslySetInnerHTML={{ __html: previewMarkerSvg }}
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground text-center">No SVG preview available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Add this JSX after the End Marker Subsection in the render part */}
              {/* Add this after the End Marker Subsection and before the Connection Preview */}
              <div className="border rounded-md p-4">
                <button
                  type="button"
                  onClick={() => setIsNodeConstraintsExpanded(!isNodeConstraintsExpanded)}
                  className="flex w-full items-center justify-between text-sm font-medium mb-2 text-left focus:outline-none"
                >
                  <span>Node Type Constraints (Optional)</span>
                  <span className="text-muted-foreground">{isNodeConstraintsExpanded ? "−" : "+"}</span>
                </button>

                {isNodeConstraintsExpanded && (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">
                      Specify which node types can be used as sources and targets for this connection. If none are
                      selected, all node types will be allowed.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="mb-2 block font-medium">Possible Source Types</Label>
                        <div className="space-y-2 border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                          {nodeTypes.map((type) => (
                            <div key={`source-${type.value}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`source-${type.value}`}
                                checked={possibleSourceTypes.includes(type.value)}
                                onCheckedChange={(checked) => handleSourceTypeChange(type.value, checked === true)}
                                className="data-[state=checked]:bg-black data-[state=checked]:text-[#cca8f0] border-gray-300"
                              />
                              <Label htmlFor={`source-${type.value}`} className="text-sm cursor-pointer">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block font-medium">Possible Target Types</Label>
                        <div className="space-y-2 border rounded-md p-3 bg-gray-50 max-h-[200px] overflow-y-auto">
                          {nodeTypes.map((type) => (
                            <div key={`target-${type.value}`} className="flex items-center space-x-2">
                              <Checkbox
                                id={`target-${type.value}`}
                                checked={possibleTargetTypes.includes(type.value)}
                                onCheckedChange={(checked) => handleTargetTypeChange(type.value, checked === true)}
                                className="data-[state=checked]:bg-black data-[state=checked]:text-[#cca8f0] border-gray-300"
                              />
                              <Label htmlFor={`target-${type.value}`} className="text-sm cursor-pointer">
                                {type.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Connection Preview */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium border-b pb-2">Connection Preview</h3>
              <div className="border rounded-md p-4 flex items-center justify-center bg-gray-50 h-[80px]">
                <svg width="300" height="60" viewBox="0 0 300 60">
                  <defs>
                    {previewMarkerSvg && (
                      <marker
                        id="preview-marker"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        markerWidth="10"
                        markerHeight="10"
                        orient="auto"
                      >
                        <g style={{ color }} dangerouslySetInnerHTML={{ __html: markerSvgCode }} />
                      </marker>
                    )}
                  </defs>

                  <line
                    x1="30"
                    y1="30"
                    x2="270"
                    y2="30"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={lineStyle === "dashed" ? "5,5" : lineStyle === "dotted" ? "1,3" : undefined}
                    markerEnd={previewMarkerSvg ? "url(#preview-marker)" : undefined}
                  />

                  {previewLineSvg && (
                    <foreignObject width="20" height="20" x="140" y="20">
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color,
                        }}
                        dangerouslySetInnerHTML={{ __html: lineSvgCode }}
                      />
                    </foreignObject>
                  )}

                  {/* Add label text to the preview */}
                  {label && (
                    <text
                      x="150"
                      y="20"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={color}
                      fontSize="12"
                      fontFamily="sans-serif"
                    >
                      {label}
                    </text>
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-white border-t p-4">
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className={purpleButtonClass}>
              Save Custom Connection
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
