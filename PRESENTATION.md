Presentation Script — WhyFlow SDK & Dashboard Demo

Duration: ~8–12 minutes (adjust per slot)
Audience: Product managers, engineers, or stakeholders — non-technical parts are highlighted.

---

1) Opening (30s)
- Start: "Hi — I'm Subhadeep Roy. Today I'll demo WhyFlow: a small SDK for capturing decision traces and an interactive dashboard to inspect them." (Point to yourself.)
- Cue: quick one-line elevator pitch: "WhyFlow helps teams record why each decision happened and then inspect the decision trail to debug, audit, and improve models and automations." (Point to the slide title or the app header.)

2) What you'll see (15s)
- "I'll show the SDK, a demo execution (sample pipeline), and the dashboard UI that lets you explore each step's input, output and rationale." (Point to the three zones: code/SDK slide, demo JSON, and the dashboard.)

3) SDK overview — quick tour (90s)
- File: `packages/core/src/execution.ts` (reference)
- Say: "The SDK is minimal and intentionally small — the main class is `Execution`. You create an `Execution` with a name and id, and then call `addStep()` to append `DecisionStep` records."
  - Point at the code sample or slide showing `new Execution('Name', 'id')` and `execution.addStep({ name, input, output, rationale, metadata })`.
- Explain types: `DecisionExecution` contains `executionId`, `name`, `timestamp`, and `steps[]`. Each `DecisionStep` has `name`, `input`, `output`, optional `rationale`, and flexible `metadata` and other step-level fields like `filters_applied` or `evaluations`.
  - Point to the `types.ts` snippet or show the JSON example.
- Emphasize: "The design keeps steps as plain JSON-friendly objects so they can represent API calls, LLM prompts, filter stages, etc." (Gesture to the demo JSON on-screen.)

4) Demo data (60s)
- Open: `demo.competitor.json` and `demo.simple.json` in repo root.
- Show: "These are ready-to-upload examples — `demo.simple.json` is tiny and `demo.competitor.json` mirrors the competitor-selection pipeline from the assignment." (Point to the file list or the uploader area.)
- Mention key fields to call out: `executionId`, `name`, `timestamp`, and each step's `input/output/rationale` plus step-specific keys like `ranking_criteria`.

5) Launch the dashboard and uploader (15s)
- Show how to run the example app (or tell the audience):

```bash
cd apps/example
pnpm dev
# open http://localhost:3001 (or the URL your dev server prints)
```

- Point to the left sidebar and top header: these are navigation and execution metadata.

6) Dashboard walkthrough (3–4 minutes)
- Sidebar (left): "This lists the decision steps in chronological order. Click a step to select it." (Point to the sidebar and click step 1.)
  - Note: We simplified the sidebar to show demo-relevant links and team info; the creator link is in the footer.
- Main panel — Step header: "Step number and name are shown prominently." (Point to badge + title.)
- Rationale: "Rendered as markdown so you can write rich rationales — bold, lists, code blocks — and they render nicely." (Point to the rationale box; mention you can include a code block or numbered list.)
  - Tip: "Use the rationale to explain the intent of the step — e.g., 'Remove accessories, keep true competitors.'"
- Input / Output blocks: "These show raw JSON input and output for the step, with syntax highlighting for readability." (Point to the two JSON panels.)
  - Demonstrate: show a JSON property such as `candidates` and explain how to inspect a candidate's `asin`, `price`, `rating`.
- Additional Data: "Any non-standard step fields such as `filters_applied`, `evaluations`, or `ranked_candidates` are shown below under Additional Data — each entry is highlighted as JSON too." (Scroll down.)
- Metadata: "Structured metadata like `step_type` and `model` are shown in the metadata card; `step_type` is treated as the type label and other entries are surfaced." (Point to metadata card.)

7) Uploader and custom demos (30s)
- Point to the uploader above the step view: "You can paste JSON or upload a `.json` file (e.g., `demo.competitor.json`). That replaces the execution being viewed so you can demo different pipelines on the fly." (Upload demo.comp... and show it load.)
- Mention validation: "The uploader expects an object with `steps` array — it will load and select the first step automatically." (Point at uploader.)

8) Developer notes (45s)
- SDK usage example (show code):

```ts
const ex = new Execution('Competitor Selection','exec_001');
ex.addStep({ name: 'Search', input: { q:'x' }, output: { candidates:[] }, rationale: '...' });
const json = ex.toJSON();
```
- Export: "`toJSON()` gives you a plain object you can persist, upload, or feed into the dashboard." (Point to the saved JSON file or code.)
- Extensibility: "Because steps accept arbitrary keys, you can add `filters_applied`, `evaluations`, or `ranked_candidates` for richer visualization without changing SDK types." (Point at an example step with `ranking_criteria`.)

9) Where to point during the demo (quick cue list)
- Slide or app title: Opening pitch.
- Sidebar (left): show number of steps and step list.
- Step header: point to the step name + badge (step index).
- Rationale box: emphasize markdown rendering.
- Input / Output: point to JSON panels; expand/collapse or scroll to examples.
- Additional Data / Metadata: call out `filters_applied` / `evaluations` / `ranked_candidates` as domain-specific diagnostics.
- Uploader: point to paste/upload control when swapping demo JSONs.

10) Live Q&A prompts (closing — 30s)
- "Would you like to see a different demo JSON? I can upload one now." (Use uploader.)
- "Do you want this to connect to a live pipeline or persist executions to S3/DB?" (If yes, discuss simple persistence hooks: write JSON to storage and re-load.)

11) Appendix: Troubleshooting & run commands
- Dev server:

```bash
cd apps/example
pnpm install
pnpm dev
```

- If syntax highlighting or markdown don't render, ensure packages are installed: `react-markdown`, `remark-gfm`, `react-syntax-highlighter`.

---

Notes for presenter:
- Keep the demo focused: show 2–3 steps deeply rather than scrolling through all of them.
- Use the uploader to swap `demo.simple.json` and `demo.competitor.json` to contrast a tiny vs real-style execution.
- If asked about production: explain the SDK is intentionally small — strengthen it with validation, a persistence layer, or a backend ingestion API for production use.

Files referenced in the repo:
- `packages/core/src/execution.ts`
- `packages/core/src/types.ts`
- `apps/example/app/page.tsx`
- `apps/example/components/DemoDataUploader.tsx`
- `demo.simple.json` and `demo.competitor.json` (repo root)

---

End of script. Good luck — tell me if you want a slide deck or speaker-notes version (with timestamps per slide).