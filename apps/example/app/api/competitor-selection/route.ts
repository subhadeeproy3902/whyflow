import { generateCompetitorSelectionExecution } from "@/lib/demo-data";
import { NextResponse } from "next/server";

export async function GET() {
  const execution = generateCompetitorSelectionExecution();
  return NextResponse.json(execution);
}
