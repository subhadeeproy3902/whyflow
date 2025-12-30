"use client";

import DemoDataUploader from "@/components/DemoDataUploader";
import SidebarSteps from "@/components/SidebarSteps";
import { generateCompetitorSelectionExecution } from "@/lib/demo-data";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@repo/ui/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import type { DecisionExecution, DecisionStep } from "@whyflow/core";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Page() {
  const [execution, setExecution] = useState<DecisionExecution>(
    generateCompetitorSelectionExecution()
  );
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const currentStep = execution.steps[selectedStep]!;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>WhyFlow Decision Debugger</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge variant="secondary">{execution.steps.length} steps</Badge>
            <span className="text-muted-foreground text-xs">{execution.executionId}</span>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <SidebarSteps execution={execution} selected={selectedStep} onSelect={i => setSelectedStep(i)} />

          <main className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <DemoDataUploader
                onLoad={json => {
                  // attempt to coerce into DecisionExecution shape if possible
                  if (json && Array.isArray(json.steps)) {
                    setExecution(json);
                    setSelectedStep(0);
                  }
                }}
              />
            </div>
            <StepDetail step={currentStep} stepNumber={selectedStep + 1} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function StepDetail({
  step,
  stepNumber,
}: {
  step: DecisionStep;
  stepNumber: number;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge className="text-base px-3 py-1">{stepNumber}</Badge>
          <h2 className="text-2xl font-semibold">{step.name}</h2>
        </div>
        {step.rationale && (
          <div className="bg-primary/5 rounded-lg border p-4">
            <p className="text-sm font-semibold text-primary">Why this decision was made:</p>
            <div className="text-foreground mt-2 prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(step.rationale)}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Input</CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{borderRadius:8, padding:12, maxHeight: '24rem', overflow:'auto', fontSize:12}}>
              {JSON.stringify(step.input, null, 2)}
            </SyntaxHighlighter>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{borderRadius:8, padding:12, maxHeight: '24rem', overflow:'auto', fontSize:12}}>
              {JSON.stringify(step.output, null, 2)}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      </div>

      <AdditionalStepData step={step} />

      {step.metadata && Object.keys(step.metadata).filter(k => k !== "step_type").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Additional Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <MetadataView metadata={step.metadata} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AdditionalStepData({ step }: { step: DecisionStep }) {
  const standardKeys = new Set(["name", "input", "output", "rationale", "metadata"]);
  const additionalKeys = Object.keys(step).filter(key => !standardKeys.has(key));

  if (additionalKeys.length === 0) return null;

  return (
    <>
      {additionalKeys.map(key => {
        const value = step[key];
        if (value === undefined || value === null) return null;

        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-sm capitalize">{key.replace(/_/g, " ")}</CardTitle>
            </CardHeader>
            <CardContent>
              <DataView value={value} />
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

function DataView({ value }: { value: unknown }) {
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {value.map((item, index) => (
          <div key={index} className="bg-muted rounded-lg p-3">
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{fontSize:12, padding:8}}>
              {JSON.stringify(item, null, 2)}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <SyntaxHighlighter language="json" style={atomDark} customStyle={{borderRadius:8, padding:12, maxHeight: '20rem', overflow:'auto', fontSize:12}}>
        {JSON.stringify(value, null, 2)}
      </SyntaxHighlighter>
    );
  }

  return <div className="text-sm">{String(value)}</div>;
}

function MetadataView({ metadata }: { metadata: Record<string, unknown> }) {
  const entries = Object.entries(metadata);

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => {
        if (key === "step_type") return null;

        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          return (
            <div key={key}>
              <h3 className="mb-2 text-sm font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {value.map((item, index) => (
                  <div key={index} className="bg-muted rounded-lg p-3">
                    <SyntaxHighlighter language="json" style={atomDark} customStyle={{fontSize:12, padding:8}}>
                      {JSON.stringify(item, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (typeof value === "object" && value !== null) {
          return (
            <div key={key}>
              <h3 className="mb-2 text-sm font-semibold capitalize">
                {key.replace(/_/g, " ")}
              </h3>
              <pre className="bg-muted text-xs overflow-auto rounded p-3 max-h-96">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        }

        return (
          <div key={key} className="flex justify-between">
            <span className="text-muted-foreground text-sm capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-medium">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
