**Architecture — WhyFlow (Codebase Overview)**

**Overview**
- **Purpose:** A decision-observability monorepo that captures, stores, and visualizes the reasoning behind outcomes produced by rule-based, heuristic, and AI-driven pipelines.
- **Monorepo toolchain:** `pnpm` workspace + `turbo` for orchestration. UI primitives provided by `shadcn/ui` and shared components in `packages/ui`.

**Top-level layout**
- **`apps/`**: runnable apps and frontends.
  - **`apps/example`**: focused decision debugger dashboard using `packages/ui` and deterministic demo fixtures.
  - **`apps/docs`**: documentation site (Fumadocs) with MDX content under `apps/docs/content/docs`.
- **`packages/`**: shared libraries and tooling.
  - **`packages/core`**: minimal SDK (`@whyflow/core`) for constructing `DecisionExecution` payloads.
  - **`packages/ui`**: shared UI components (shadcn wrappers and project-specific components).
  - **`packages/*`**: other workspace packages such as lint/config and TypeScript presets.

**Core responsibilities**
- **`@whyflow/core`** (packages/core)
  - Construct and validate JSON-safe payloads: `DecisionExecution` and `DecisionStep`.
  - Provide small helpers (serializers, types) only — no global state, no auto-instrumentation.
- **UI layer** (packages/ui + apps/example)
  - UI implements visualization rules (Execution Overview, Step Timeline, Step Detail) and consumes deterministic fixtures.
  - Use only approved tokens: `primary`, `secondary`, `card`, `muted`, `border`, `foreground`.
- **Docs** (apps/docs)
  - All docs are MDX and live under `apps/docs/content/docs`.
  - Engineering-first pages: mental model, SDK usage, data model, dashboard guide.

**Data model & flow**
- Integrator builds a `DecisionExecution` object (serializable) containing an ordered list of `DecisionStep` objects.
- `DecisionExecution` is passed to the dashboard (or stored in fixtures) — dashboard renders deterministic views from that payload.
- No runtime capture by default: integrator chooses what to record to avoid private-data leakage.

**Demo and fixtures**
- Demo data must be deterministic, static fixtures within `apps/example/lib`.
- No network, randomness, async simulations, or LLM calls in fixtures.

**Build, dev, and testing**
- Use `pnpm` at the workspace root to install and run scripts across packages.
- `turbo` handles tasks like building, linting, and typechecks across packages for speed.
- Tests (if present) should be package-scoped and runnable via `pnpm -w test`.

**Code & review rules (enforced practices)**
- No `console` logs in committed code.
- No TODOs or placeholder AI text in code or docs.
- No unused exports, dead code, or unnecessary abstractions.
- PR reviewers check: JSON-safety of payloads, no global state, usage of `packages/ui`, deterministic fixtures.

**Developer workflow (recommended)**
- Add UI components using `pnpm ui add <component-name>` (do not copy shadcn internals).
- Keep SDK usage explicit — calls to create `DecisionExecution` are invoked by integrators (no hidden instrumentation).
- Place documentation only under `apps/docs/content/docs` and author in MDX.

**Operational considerations**
- Keep demo apps runnable offline and deterministic across runs.
- Avoid collecting private data by default; provide clear guidance in README on what integrators may record.

**Files and hotspots to inspect when working**
- `packages/core/src` — SDK types and constructors.
- `packages/ui/src` — shared UI components and tokens.
- `apps/example/lib` — demo fixtures and demo helper utilities.
- `apps/docs/content/docs` — MDX documentation pages.

**Next practical actions**
- Add `FINAL_RESULT.md` describing verification steps and intern-friendly walkthrough (if desired).
- Add a small example `DecisionExecution` fixture to `apps/example/lib/demo-data.ts` showing required fields.

---

This file summarizes the whole-repo architecture and where responsibilities live. Use it as a quick reference when making changes, opening PRs, or onboarding new contributors.
