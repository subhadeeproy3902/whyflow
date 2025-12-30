import { NextResponse } from "next/server";
import type {
  ApiResponse,
  CompetitorSelectionResponse,
  ErrorResponse,
} from "@/types";
import type { DecisionExecution } from "@whyflow/core";

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error codes for the API
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
} as const;

/**
 * Creates a standardized success response
 * @param data - Decision execution data
 * @returns NextResponse with success payload
 */
export function createSuccessResponse(
  data: DecisionExecution
): NextResponse<CompetitorSelectionResponse> {
  const response: CompetitorSelectionResponse = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: HTTP_STATUS.OK });
}

/**
 * Creates a standardized error response
 * @param message - Error message
 * @param code - Error code
 * @param status - HTTP status code
 * @param details - Optional error details
 * @returns NextResponse with error payload
 */
export function createErrorResponse(
  message: string,
  code: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown
): NextResponse<ErrorResponse> {
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}

/**
 * Wraps async route handlers with error handling
 * @param handler - Route handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse>>
) {
  return async (
    ...args: T
  ): Promise<NextResponse<ApiResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("Unhandled error in route handler:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return createErrorResponse(
        errorMessage,
        ERROR_CODES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  };
}
