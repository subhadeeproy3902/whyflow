# @whyflow/core

The core SDK for WhyFlow decision observability.

## Installation

```bash
pnpm add @whyflow/core
```

## Usage

```typescript
import { Execution } from "@whyflow/core";

const execution = new Execution("My Decision Pipeline");

execution.addStep({
  name: "Apply Business Rules",
  input: { candidates: 100 },
  output: { qualified: 25 },
  rationale: "Applied quality and pricing filters",
});

const data = execution.toJSON();
```

## API

### Execution

```typescript
class Execution {
  constructor(name: string, executionId?: string);
  addStep(step: DecisionStep): void;
  toJSON(): DecisionExecution;
}
```

### Types

```typescript
interface DecisionExecution {
  executionId: string;
  name: string;
  timestamp: string;
  steps: DecisionStep[];
}

interface DecisionStep {
  name: string;
  input?: unknown;
  output?: unknown;
  rationale?: string;
  metadata?: Record<string, unknown>;
}
```

## License

MIT
