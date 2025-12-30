"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";

export default function DemoDataUploader({ onLoad }: { onLoad: (json: any) => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleLoadFromText() {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onLoad(parsed);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  }

  function handleFile(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const textContent = String(reader.result || "");
        const parsed = JSON.parse(textContent);
        setText(JSON.stringify(parsed, null, 2));
        setError(null);
        onLoad(parsed);
      } catch (err: any) {
        setError(err?.message || "Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold mb-2">Load Demo Data</h4>

      <label className="mb-2 inline-block text-xs text-muted-foreground">Paste JSON</label>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full h-40 rounded border p-2 text-xs"
        placeholder='Paste a DecisionExecution JSON here (executionId, name, steps[])'
      />

      <div className="mt-2 flex items-center gap-2">
        <Button onClick={handleLoadFromText}>Load from Paste</Button>
        <label className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">or upload</span>
          <input type="file" accept="application/json,.json" onChange={handleFile} className="ml-2" />
        </label>
      </div>

      {error && <div className="text-destructive text-sm mt-2">{error}</div>}
    </div>
  );
}
