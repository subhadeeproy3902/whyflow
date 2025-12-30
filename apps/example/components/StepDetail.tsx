"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import type { DecisionStep } from "@whyflow/core";

function CodeBlock({ language, value }: { language?: string; value: string }) {
  return (
    <SyntaxHighlighter language={language || "text"} style={atomOneLight} wrapLongLines>
      {value}
    </SyntaxHighlighter>
  );
}

export default function StepDetail({ step, stepNumber }: { step: DecisionStep; stepNumber: number }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge className="text-base px-3 py-1">{stepNumber}</Badge>
          <h2 className="text-2xl font-semibold">{step.name}</h2>
        </div>
        {step.rationale && (
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
            <p className="text-sm font-semibold text-primary">Why this decision was made:</p>
            <div className="text-foreground mt-2 text-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                }}
              >
                {String(step.rationale)}
              </ReactMarkdown>
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
            <pre className="bg-muted text-xs overflow-auto rounded p-3 max-h-96">{JSON.stringify(step.input, null, 2)}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-xs overflow-auto rounded p-3 max-h-96">{JSON.stringify(step.output, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>

      {Object.keys(step).filter(k => !["name", "input", "output", "rationale", "metadata"].includes(k)).map(key => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-sm capitalize">{key.replace(/_/g, " ")}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-xs overflow-auto rounded p-3 max-h-96">{JSON.stringify(step[key], null, 2)}</pre>
          </CardContent>
        </Card>
      ))}

      {step.metadata && Object.keys(step.metadata).filter(k => k !== "step_type").length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Additional Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-xs overflow-auto rounded p-3 max-h-96">{JSON.stringify(step.metadata, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
