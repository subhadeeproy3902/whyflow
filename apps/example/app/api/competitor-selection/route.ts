import { NextRequest } from "next/server";
import { CompetitorSelectionService } from "@/lib/whyflow-service";
import {
  createSuccessResponse,
  createErrorResponse,
  withErrorHandling,
  HTTP_STATUS,
  ERROR_CODES,
} from "@/lib/utils";

/**
 * GET endpoint for retrieving competitor selection execution
 * @returns Decision execution data with success/error response
 */

export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get("filter");
  const limit = searchParams.get("limit");

  const execution = await CompetitorSelectionService.getExecution();
  return createSuccessResponse(execution);
});

/**
 * POST endpoint for creating competitor selection execution with custom parameters
 * @returns Decision execution data with success/error response
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json().catch(() => ({}));
  const validation = CompetitorSelectionService.validateRequest(body);
  if (!validation.isValid) {
    return createErrorResponse(
      "Invalid request parameters",
      ERROR_CODES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      { errors: validation.errors }
    );
  }

  const execution = await CompetitorSelectionService.getExecution(body);
  return createSuccessResponse(execution);
});
