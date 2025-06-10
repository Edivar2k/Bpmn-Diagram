"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Package, Check, AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { useDiagramContext } from "@/components/diagram-context"
import type { DiagramData } from "@/utils/import-export-utils"

// Interface for GitHub API response
interface GitHubFileInfo {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
}

// Interface for extension data with metadata
interface Extension {
  id: string
  title: string
  description: string
  author: string
  link?: string
  tags?: string[]
  data: DiagramData
}

export function ExtensionsRepository() {
  const [isOpen, setIsOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<Record<string, "idle" | "success" | "error">>({})
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { importDiagram } = useDiagramContext()

  // Fetch extensions from GitHub when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchExtensions()
    }
  }, [isOpen])

  /**
   * Manual JSON parser that can handle trailing commas
   * This is a simplified implementation that focuses on fixing the specific issue
   */
  const parseJsonWithTrailingCommas = (jsonString: string) => {
    // First, try to parse it normally
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      // If that fails, try to fix common issues

      // Fix trailing commas before closing braces or brackets
      const fixedJson = jsonString
        // Replace ",}" with "}"
        .replace(/,(\s*})/g, "$1")
        // Replace ",]" with "]"
        .replace(/,(\s*\])/g, "$1")

      // Try parsing again
      try {
        return JSON.parse(fixedJson)
      } catch (e2) {
        // If that still fails, try a more aggressive approach
        // This is a last resort and might not work for all cases

        // Try to manually parse the JSON by evaluating it
        // This is not ideal but can handle some cases that JSON.parse can't
        try {
          // Use Function constructor to create a function that returns the parsed JSON
          // This is safer than using eval directly
          const jsonFunc = new Function(`
            try {
              return ${fixedJson};
            } catch (e) {
              throw new Error("Failed to parse JSON: " + e.message);
            }
          `)

          return jsonFunc()
        } catch (e3) {
          // If all else fails, throw the original error
          throw e
        }
      }
    }
  }

  // Improved fetchExtensions function with better error handling
  const fetchExtensions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch the list of files in the extensions directory
      const response = await fetch(
        "https://api.github.com/repos/guiRodrigues/KAOSforge-extensions/contents/extensions",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Meta4Model-App",
          },
        },
      )

      if (!response.ok) {
        // Handle specific error codes with more helpful messages
        if (response.status === 403) {
          const rateLimitError = "GitHub API rate limit exceeded. Please try again later."
          console.error(rateLimitError)
          throw new Error(rateLimitError)
        } else if (response.status === 404) {
          throw new Error("Extensions repository not found. The repository may have been moved or renamed.")
        } else {
          throw new Error(`Failed to fetch extensions: ${response.status} ${response.statusText}`)
        }
      }

      const files: GitHubFileInfo[] = await response.json()

      // Filter for JSON files only
      const jsonFiles = files.filter((file) => file.name.endsWith(".json"))

      if (jsonFiles.length === 0) {
        setExtensions([])
        return
      }

      // Fetch the content of each JSON file using GitHub's API instead of raw URLs
      const extensionsPromises = jsonFiles.map(async (file) => {
        try {
          // Instead of using download_url, use the GitHub API to get the file content
          // This avoids CORS issues with raw.githubusercontent.com
          const contentResponse = await fetch(file.url, {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Meta4Model-App",
            },
          })

          if (!contentResponse.ok) {
            if (contentResponse.status === 403) {
              throw new Error("GitHub API rate limit exceeded")
            } else {
              throw new Error(`HTTP error ${contentResponse.status}`)
            }
          }

          const contentData = await contentResponse.json()

          // GitHub API returns content as base64 encoded
          if (!contentData.content || contentData.encoding !== "base64") {
            throw new Error("Invalid content format from GitHub API")
          }

          // Decode the base64 content
          const decodedContent = atob(contentData.content.replace(/\n/g, ""))

          // Parse the JSON content with improved error handling
          let fileData
          try {
            // Use our custom JSON parser that can handle trailing commas
            fileData = parseJsonWithTrailingCommas(decodedContent)
          } catch (parseError) {
            // Log detailed error information
            console.error(`Failed to parse JSON for ${file.name}:`, parseError)

            // For debugging: log the problematic part of the JSON
            if (file.name === "awesome.json") {
              const lines = decodedContent.split("\n")
              // Log lines around line 54 (the problematic area)
              console.error("JSON content around line 54:")
              for (let i = Math.max(0, 50); i < Math.min(lines.length, 58); i++) {
                console.error(`Line ${i + 1}: ${lines[i]}`)
              }
            }

            // If parsing failed, throw the error
            throw parseError
          }

          // Create extension object with metadata
          return {
            id: file.sha,
            title: fileData.extenstionName || fileData.extensionName || file.name.replace(".json", ""),
            description: fileData.extensionDescription || "No description provided",
            author: fileData.author || "Unknown",
            link: fileData.link || null,
            tags: Array.isArray(fileData.tags) ? fileData.tags : [], // Ensure tags is an array
            data: {
              nodes: Array.isArray(fileData.nodes) ? fileData.nodes : [],
              edges: Array.isArray(fileData.edges) ? fileData.edges : [],
              customNodes: Array.isArray(fileData.customNodes) ? fileData.customNodes : [],
              customConnections: Array.isArray(fileData.customConnections) ? fileData.customConnections : [],
              version: fileData.version || "1.0.0",
            },
          }
        } catch (err) {
          console.error(`Failed to load extension ${file.name}:`, err)
          // Return null for failed extensions - we'll filter these out
          return null
        }
      })

      // Wait for all promises to resolve, even if some fail
      const results = await Promise.all(extensionsPromises)

      // Filter out null results (failed extensions)
      const successfulExtensions = results.filter((ext) => ext !== null) as Extension[]

      setExtensions(successfulExtensions)

      // If some extensions failed but others succeeded, show a partial error
      const failedCount = results.filter((r) => r === null).length
      if (failedCount > 0 && successfulExtensions.length > 0) {
        setError(
          `Note: ${failedCount} extension${failedCount > 1 ? "s" : ""} failed to load, but ${successfulExtensions.length} loaded successfully.`,
        )
      } else if (failedCount > 0 && successfulExtensions.length === 0) {
        setError("All extensions failed to load. Please try again later.")
      }
    } catch (err) {
      console.error("Error fetching extensions:", err)
      setError(err instanceof Error ? err.message : "Failed to load extensions")
      setExtensions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportExtension = (extension: Extension) => {
    try {
      // Generate new IDs for imported nodes to avoid conflicts
      const importedNodes = extension.data.nodes.map((node) => ({
        ...node,
        id: `${node.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }))

      // Generate new IDs for imported edges and update their source/target references
      const idMap: Record<string, string> = {}
      extension.data.nodes.forEach((node, index) => {
        idMap[node.id] = importedNodes[index].id
      })

      const importedEdges = extension.data.edges.map((edge) => ({
        ...edge,
        id: `${edge.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        source: idMap[edge.source] || edge.source,
        target: idMap[edge.target] || edge.target,
      }))

      // Ensure custom nodes have their SVG code preserved
      const customNodesWithSvg = extension.data.customNodes.map((node) => ({
        ...node,
        // Ensure SVG code is properly preserved as-is
        svgCode: node.svgCode || "",
      }))

      // Create a modified version of the extension data with the new IDs
      const modifiedData = {
        ...extension.data,
        nodes: importedNodes,
        edges: importedEdges,
        // Use the processed custom nodes
        customNodes: customNodesWithSvg || [],
        customConnections: extension.data.customConnections || [],
      }

      // Import the modified data (the importDiagram function will now merge instead of replace)
      importDiagram(modifiedData)

      setImportStatus((prev) => ({ ...prev, [extension.id]: "success" }))

      // Reset status after 2 seconds
      setTimeout(() => {
        setImportStatus((prev) => ({ ...prev, [extension.id]: "idle" }))
      }, 2000)
    } catch (error) {
      console.error("Failed to import extension:", error)
      setImportStatus((prev) => ({ ...prev, [extension.id]: "error" }))

      // Reset error status after 2 seconds
      setTimeout(() => {
        setImportStatus((prev) => ({ ...prev, [extension.id]: "idle" }))
      }, 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Package className="h-4 w-4" />
          <span>Extensions Repository</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Extensions Repository</DialogTitle>
          <DialogDescription>Browse and import community-created extensions for your KAOS diagrams</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 pt-0 pb-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading extensions...</p>
              </div>
            ) : error && extensions.length > 0 ? (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
                <p className="text-sm text-red-500 mb-2">Failed to load extensions</p>
                <p className="text-xs text-muted-foreground text-center max-w-md">{error}</p>
                {error.includes("rate limit") && (
                  <p className="text-xs text-muted-foreground text-center max-w-md mt-2">
                    GitHub limits API requests. Try again in a few minutes or check the repository directly at{" "}
                    <a
                      href="https://github.com/guiRodrigues/KAOSforge-extensions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      github.com/guiRodrigues/Meta4Model-extensions
                    </a>
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchExtensions()}>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5" />
                  Retry
                </Button>
              </div>
            ) : extensions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No extensions found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {extensions.map((extension) => (
                  <li key={extension.id} className="py-4 first:pt-2 last:pb-2">
                    <div className="flex justify-between items-center gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold">{extension.title}</h3>

                          {/* Display tags right after the title */}
                          {extension.tags && extension.tags.length > 0 && (
                            <>
                              {extension.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </>
                          )}

                          <span className="text-xs text-muted-foreground">created by {extension.author}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1.5">
                          {extension.description}{" "}
                          {extension.link && (
                            <a
                              href={extension.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 underline inline-flex items-center text-xs ml-1"
                            >
                              More info
                              <ExternalLink className="h-3 w-3 ml-0.5" />
                            </a>
                          )}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleImportExtension(extension)}
                        size="sm"
                        variant={importStatus[extension.id] === "success" ? "outline" : "default"}
                        disabled={importStatus[extension.id] === "success"}
                        className={`h-8 flex-shrink-0 ${
                          importStatus[extension.id] !== "success" && importStatus[extension.id] !== "error"
                            ? "bg-[#cca8f0] text-[#330a5c] hover:bg-[#bc98e0] hover:text-[#330a5c]"
                            : ""
                        }`}
                      >
                        {importStatus[extension.id] === "success" ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                            Imported
                          </>
                        ) : importStatus[extension.id] === "error" ? (
                          <>
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                            Failed
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
