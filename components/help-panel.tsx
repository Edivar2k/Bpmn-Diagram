"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HelpPanel() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            <span>KAOS</span>
            <span>forge</span> Help
          </DialogTitle>
          <DialogDescription>Learn how to use the KAOS diagram editor effectively</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Basic Operations</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>Drag elements from the sidebar to add them to the canvas</li>
                <li>Double-click a node to edit its label</li>
                <li>Click a node to edit its properties in the side panel</li>
                <li>Connect nodes by dragging from one handle to another</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Connection Handles</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>Each node has a target handle at the top and a source handle at the bottom</li>
                <li>Target handles (top) receive incoming connections</li>
                <li>Source handles (bottom) create outgoing connections</li>
                <li>To connect nodes, drag from a source handle to a target handle</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Custom Nodes</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>Create custom nodes in the Custom Nodes section of the Nodes tab</li>
                <li>Define your own SVG shape, color, and name</li>
                <li>Custom nodes are saved and available for reuse</li>
                <li>Drag custom nodes onto the canvas just like standard nodes</li>
                <li>Delete custom nodes using the trash icon in the sidebar</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Custom Connections</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>Create custom connections in the Custom Connections section of the Connections tab</li>
                <li>Define line style (solid, dashed, dotted), color, and name</li>
                <li>Add optional SVG decorations for the line and end markers</li>
                <li>Select a custom connection before creating connections between nodes</li>
                <li>Delete custom connections using the trash icon in the sidebar</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Connection Types</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">Refinement:</span> Dark grey line with yellow arrow and circle for
                  decomposing goals into subgoals
                </li>
                <li>
                  <span className="font-medium">Conflict:</span> Dark grey line with red lightning bolt icon
                </li>
                <li>
                  <span className="font-medium">Responsibility:</span> Dark grey line with red arrow pointing to the
                  target node and red circle in the middle, showing agent responsibility for goals/requirements
                </li>
                <li>
                  <span className="font-medium">Operationalization:</span> Dark grey line with blue arrow pointing to
                  the target node and blue circle in the middle, showing how operations implement requirements
                </li>
                <li>
                  <span className="font-medium">Link:</span> Green line showing general relationships
                </li>
                <li>
                  <span className="font-medium">Aggregation:</span> Purple dashed line for grouping related elements
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Diagram Types</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">Goal Diagrams:</span> Model system goals, requirements, expectations,
                  domain properties, and obstacles
                </li>
                <li>
                  <span className="font-medium">Responsibility Diagrams:</span> Show which agents are responsible for
                  which requirements and expectations
                </li>
                <li>
                  <span className="font-medium">Object Diagrams:</span> Model the entities and their relationships in
                  the system
                </li>
                <li>
                  <span className="font-medium">Operation Diagrams:</span> Show how operations performed by agents
                  implement requirements and manipulate entities
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                For more detailed information, refer to the{" "}
                <a
                  href="https://www.objectiver.com/fileadmin/download/documents/KaosTutorial.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-700 hover:underline"
                >
                  KAOS Tutorial documentation
                </a>
                .
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
