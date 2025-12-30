import type { DecisionExecution, DecisionStep } from "./types";

export class Execution {
  private execution: DecisionExecution;

  constructor(name: string, executionId?: string) {
    this.execution = {
      executionId: executionId || this.generateId(),
      name,
      timestamp: new Date().toISOString(),
      steps: [],
    };
  }

  addStep(step: DecisionStep): void {
    this.execution.steps.push(step);
  }

  toJSON(): DecisionExecution {
    return this.execution;
  }

  private generateId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
