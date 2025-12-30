import { DecisionExecution } from "@whyflow/core";

/**
 * Request query parameters for competitor selection API
 */
export interface CompetitorSelectionQueryParams {
  /**
   * Optional filter parameter (for future extensibility)
   */
  filter?: string;
  /**
   * Optional limit for number of results
   */
  limit?: number;
}

/**
 * Request body for competitor selection API (for POST requests)
 */
export interface CompetitorSelectionRequestBody {
  /**
   * Product title to analyze
   */
  productTitle?: string;
  /**
   * Product category
   */
  category?: string;
  /**
   * Additional options for execution
   */
  options?: {
    includeMetadata?: boolean;
    maxSteps?: number;
  };
}

/**
 * Success response for competitor selection API
 */
export interface CompetitorSelectionResponse {
  success: true;
  data: DecisionExecution;
  timestamp: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Union type for all possible API responses
 */
export type ApiResponse = CompetitorSelectionResponse | ErrorResponse;
