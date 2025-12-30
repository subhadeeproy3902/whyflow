"use client";

import { useMemo } from "react";
import { Canvas } from "@repo/ui/components/workflow/canvas";
import { Edge } from "@repo/ui/components/workflow/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@repo/ui/components/workflow/node";
import type { DecisionExecution } from "@whyflow/core";

interface StepWiseWorkflowProps {
  execution: DecisionExecution;
  selected: number;
  onSelect: (index: number) => void;
}

export default function StepWiseWorkflow({
  execution,
  selected,
  onSelect,
}: StepWiseWorkflowProps) {
  
  // 1. Generate Nodes dynamically from steps
  const nodes = useMemo(() => {
    return execution.steps.map((step, index) => ({
      id: index.toString(),
      type: "workflow",
      // Vertical positioning: X is constant (centered), Y increments
      position: { x: 100, y: index * 200 }, 
      data: {
        label: step.name,
        description: (step.metadata?.step_type as string) || "Process Step",
        // Logic for handles: First node has no target, Last node has no source
        handles: { 
          target: index > 0, 
          source: index < execution.steps.length - 1 
        },
        index: index, // Pass index for click handling
        selected: index === selected, // Pass selection state for styling
        inputSummary: step.input ? Object.keys(step.input).length + " fields" : "No input",
        outputSummary: step.output ? Object.keys(step.output).length + " fields" : "No output",
      },
    }));
  }, [execution, selected]);

  // 2. Generate Edges to connect steps sequentially
  const edges = useMemo(() => {
    return execution.steps.slice(0, -1).map((_, index) => ({
      id: `edge-${index}-${index + 1}`,
      source: index.toString(),
      target: (index + 1).toString(),
      type: "animated", // Use animated edges for flow visualization
    }));
  }, [execution]);

  // 3. Define Custom Node Component
  const nodeTypes = useMemo(() => ({
    workflow: ({ data }: { data: any }) => (
      // We wrap the Node in a div to handle the Click event and Selection styling
      <div 
        onClick={(e) => {
            e.stopPropagation(); // Prevent canvas click interference
            onSelect(data.index);
        }}
        className={`transition-all duration-200 cursor-pointer rounded-xl ${
          data.selected 
            ? "ring-2 ring-primary ring-offset-2 shadow-lg scale-105" 
            : "hover:ring-1 hover:ring-primary/50 opacity-90 hover:opacity-100"
        }`}
      >
        <Node handles={data.handles} className={data.selected ? "border-primary bg-primary/5" : ""}>
          <NodeHeader>
            <div className="flex items-center justify-between">
              <NodeTitle>{data.label}</NodeTitle>
              {data.selected && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Active</span>}
            </div>
            <NodeDescription>{data.description}</NodeDescription>
          </NodeHeader>
          <NodeContent>
             <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground mt-2">
                <div className="bg-muted/50 p-1 rounded">
                   <span className="font-semibold block">In</span>
                   {data.inputSummary}
                </div>
                <div className="bg-muted/50 p-1 rounded">
                   <span className="font-semibold block">Out</span>
                   {data.outputSummary}
                </div>
             </div>
          </NodeContent>
          <NodeFooter className="text-[10px] text-right text-muted-foreground">
            Step {data.index + 1}
          </NodeFooter>
        </Node>
      </div>
    ),
  }), [onSelect]);

  const edgeTypes = useMemo(() => ({
    animated: Edge.Animated,
    temporary: Edge.Temporary,
  }), []);

  return (
    <div className="h-full w-full bg-slate-50/50">
      <Canvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        // Center the graph initially
        fitViewOptions={{ padding: 0.2 }}
      />
    </div>
  );
}