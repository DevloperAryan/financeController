/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cleanStatement } from "@/lib/cleanStatement";
import { matchRecords } from "@/lib/matchRecords";
import { findExceptions } from "@/lib/exceptions";   // same yahan

export async function POST() {
  try {
    console.log("Process started...");

    console.log("Step 1: Cleaning bank statement...");
    const cleanResult = await cleanStatement();

    console.log("Step 2: Matching records...");
    const matchResult = await matchRecords();

    console.log("Step 3: Finding exceptions...");
    const exceptionResult = await findExceptions();

    console.log("Pipeline done.");

    return NextResponse.json({
      success: true,
      clean: cleanResult,
      match: matchResult,
      exceptions: exceptionResult,
    });
  } catch (err: any) {
    console.error("Pipeline failed:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}