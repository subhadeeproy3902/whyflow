# WhyFlow

> A decision observability layer for systems where outcomes are produced through multiple rules, evaluations, or ranking steps.

## What is WhyFlow?

WhyFlow is a **decision observability system** that captures and visualizes *why* a system produced a specific outcome.

It is **not AI-specific**. It works for **AI-driven, rule-based, heuristic, and hybrid decision pipelines**.

Traditional logging tells you *what* happened. Distributed tracing tells you *what functions* were called.

**WhyFlow tells you *why* a decision was made.**

## The Problem

Modern software relies on multi-step, non-deterministic processes:

- An LLM generates search keywords from a product description
- A search API returns thousands of results
- Filters narrow down candidates based on business rules
- A ranking algorithm selects the final output

These systems are notoriously difficult to debug. When the final output is wrong, you're left reverse-engineering the entire pipeline.

**WhyFlow gives you visibility into each decision point**, making it easy to identify where things went wrong.

## Installation

```bash
pnpm add @whyflow/core
```

## Quick Start

```typescript
import { Execution } from "@whyflow/core";

const execution = new Execution("Competitor Selection Pipeline");

execution.addStep({
  name: "Generate Search Keywords",
  input: {
    productTitle: "Stainless Steel Water Bottle 32oz",
  },
  output: {
    keywords: ["stainless steel water bottle", "insulated bottle"],
  },
  rationale: "Extracted key product attributes for search",
});

execution.addStep({
  name: "Apply Price Filter",
  input: { candidates: 50 },
  output: { qualified: 12, rejected: 38 },
  rationale: "Filtered products to $15-$60 range",
  metadata: {
    priceRange: { min: 15, max: 60 },
  },
});

const executionData = execution.toJSON();
```

## Features

- **Lightweight SDK** - Minimal, explicit API with no magic
- **Decision Trail Capture** - Record inputs, outputs, and reasoning at each step
- **Visual Dashboard** - Debug multi-step pipelines with a clear UI
- **General Purpose** - Works for any decision pipeline, not just AI
- **JSON-Safe** - Everything is serializable for storage and transmission

## Architecture

This monorepo contains:

- **`packages/core`** - The `@whyflow/core` SDK
- **`apps/example`** - Demo dashboard showing a competitor selection pipeline
- **`apps/docs`** - Documentation site built with Fumadocs
- **`packages/ui`** - Shared UI components

## Development

```bash
pnpm install
pnpm build
```

Run the example dashboard:

```bash
pnpm dev --filter example
```

Run the documentation site:

```bash
pnpm dev --filter docs
```

## Use Cases

WhyFlow is designed for systems that make decisions through multiple steps:

- **Competitor discovery** - Find and rank competitor products
- **Content recommendation** - Select relevant content from large datasets
- **Lead scoring** - Evaluate and prioritize sales leads
- **Fraud detection** - Assess risk through multiple rule layers
- **Search ranking** - Determine result ordering

Any system where you need to understand *why* a particular outcome was selected.

## What WhyFlow is Not

WhyFlow is **not**:

- A tracing system (use Jaeger, Zipkin for that)
- A logging framework (use Winston, Pino for that)
- A metrics platform (use Prometheus, Datadog for that)
- An AI framework
- A rules engine

## Documentation

Full documentation is available at `/apps/docs`:

- Introduction to decision observability
- Core concepts and mental model
- Integration guide
- Dashboard usage
- Data model reference

## License

MIT
