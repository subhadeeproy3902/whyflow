export interface DecisionStep {
  name: string;
  input?: unknown;
  output?: unknown;
  rationale?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DecisionExecution {
  executionId: string;
  name: string;
  timestamp: string;
  steps: DecisionStep[];
}
