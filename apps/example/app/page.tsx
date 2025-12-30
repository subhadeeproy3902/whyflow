"use client";

import DemoDataUploader from "@/components/DemoDataUploader";
import StepWiseWorkflow from "@/components/StepWiseWorkflow";
import { AppSidebar } from "@repo/ui/components/app-sidebar";
import { Badge } from "@repo/ui/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@repo/ui/components/ui/breadcrumb";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import type { DecisionExecution, DecisionStep } from "@whyflow/core";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoaderCircle } from "lucide-react";

export default function Page() {
  const [execution, setExecution] = useState<DecisionExecution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const handleRunDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/competitor-selection");
      const data = await response.json();
      setExecution(data);
      setSelectedStep(0);
    } catch (error) {
      console.error("Failed to fetch demo data:", error);
      // You could add a user-facing error message here
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetExecution = (newExecution: DecisionExecution) => {
    setExecution(newExecution);
    setSelectedStep(0);
  }

  const currentStep = execution?.steps[selectedStep]!;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden! h-screen">
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
          {execution && (
            <div className="ml-auto flex items-center gap-2 px-4">
              <Badge variant="secondary">{execution.steps.length} steps</Badge>
              <span className="text-muted-foreground text-xs">
                {execution.executionId}
              </span>
            </div>
          )}
        </header>

        {execution ? (
          <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            <aside className="border-r h-full relative flex flex-2 flex-col bg-background">
              <div className="p-4 border-b bg-muted/20 z-10">
                <h2 className="font-semibold text-sm">Workflow View</h2>
                <p className="text-xs text-muted-foreground">
                  Select a node to view details
                </p>
              </div>
              <div className="flex-1 relative">
                <StepWiseWorkflow
                  execution={execution}
                  selected={selectedStep}
                  onSelect={(i) => setSelectedStep(i)}
                />
              </div>
            </aside>

            <main className="overflow-y-auto flex-1 h-full p-4">
              <div className="mb-6">
                <DemoDataUploader
                  onLoad={(json) => {
                    if (json && Array.isArray(json.steps)) {
                      handleSetExecution(json);
                    }
                  }}
                />
              </div>
              <StepDetail step={currentStep} stepNumber={selectedStep + 1} />
            </main>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/20">
            <Card className="w-full max-w-md text-center shadow-lg animate-in fade-in zoom-in-95">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome to WhyFlow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Run the interactive demo to see how WhyFlow visualizes a
                  decision-making process, or upload your own execution data.
                </p>
                <div className="flex flex-col gap-4">
                  <Button onClick={handleRunDemo} disabled={isLoading} size="lg">
                    {isLoading ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Run Interactive Demo
                  </Button>
                  <Separator>
                    <span className="text-xs text-muted-foreground">OR</span>
                  </Separator>
                  <DemoDataUploader
                    onLoad={(json) => {
                      if (json && Array.isArray(json.steps)) {
                        handleSetExecution(json);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in duration-500">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge className="text-base px-3 py-1 bg-primary">{stepNumber}</Badge>
          <h2 className="text-2xl font-semibold">{step.name}</h2>
        </div>
        {step.rationale && (
          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900 p-4 shadow-sm">
            <p className="text-sm font-semibold text-primary mb-2">Rationale & Logic:</p>
            <div className="text-foreground prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{String(step.rationale)}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-6 w-full">
        <Card className="shadow-sm w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
               Input Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{borderRadius:8, padding:12, maxHeight: '24rem', overflow:'auto', fontSize:12, margin:0}}>
              {JSON.stringify(step.input, null, 2)}
            </SyntaxHighlighter>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
               Output Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{borderRadius:8, padding:12, maxHeight: '24rem', overflow:'auto', fontSize:12, margin:0}}>
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
          <div key={index} className="border-b border-foreground">
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
          <div key={key} className="flex justify-between border-b pb-2 last:border-0">
            <span className="text-muted-foreground text-sm capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-sm font-medium max-w-[200px]" title={String(value)}>{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}