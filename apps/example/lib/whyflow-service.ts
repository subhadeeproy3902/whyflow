import { generateCompetitorSelectionExecution } from "@/lib/demo-data";
import type { DecisionExecution } from "@whyflow/core";
import type { CompetitorSelectionRequestBody } from "@/types";

/**
 * Service layer for competitor selection operations
 */
export class CompetitorSelectionService {
  /**
   * Generates a competitor selection execution
   * @param params - Optional parameters for customizing the execution
   * @returns Decision execution data
   */
  static async getExecution(
    params?: CompetitorSelectionRequestBody
  ): Promise<DecisionExecution> {
    try {
      // Future enhancement: Use params to customize execution
      // For now, using the demo data generator
      const execution = generateCompetitorSelectionExecution();

      // Validate execution structure
      if (!execution || !execution.executionId) {
        throw new Error("Invalid execution data generated");
      }

      return execution;
    } catch (error) {
      // Log error for monitoring (in production, use proper logging service)
      console.error("Error generating competitor selection execution:", error);
      throw new Error("Failed to generate competitor selection execution");
    }
  }

  /**
   * Validates request parameters
   * @param body - Request body to validate
   * @returns Validation result
   */
  static validateRequest(body: unknown): {
    isValid: boolean;
    errors?: string[];
  } {
    const errors: string[] = [];

    // Basic validation logic
    if (body && typeof body === "object") {
      const requestBody = body as Partial<CompetitorSelectionRequestBody>;

      if (
        requestBody.productTitle &&
        typeof requestBody.productTitle !== "string"
      ) {
        errors.push("productTitle must be a string");
      }

      if (requestBody.category && typeof requestBody.category !== "string") {
        errors.push("category must be a string");
      }

      if (requestBody.options && typeof requestBody.options !== "object") {
        errors.push("options must be an object");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
