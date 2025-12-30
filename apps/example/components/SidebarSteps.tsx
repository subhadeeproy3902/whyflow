"use client";

import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import type { DecisionExecution } from "@whyflow/core";

export default function SidebarSteps({
  execution,
  selected,
  onSelect,
}: {
  execution: DecisionExecution;
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <aside className="border-r w-80 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{execution.name}</h2>
          <p className="text-muted-foreground text-xs">
            {new Date(execution.timestamp).toLocaleString()}
          </p>
        </div>
        <Separator className="mb-4" />
        <h3 className="mb-3 text-sm font-semibold">Decision Steps</h3>
        <div className="space-y-2">
          {execution.steps.map((step, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selected === index ? "border-border bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-sm font-medium">{step.name}</div>
                  {step.metadata && typeof step.metadata.step_type === "string" && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      {step.metadata.step_type}
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {index + 1}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
