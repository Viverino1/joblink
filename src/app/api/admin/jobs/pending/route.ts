import { NextResponse } from "next/server";
import { getPendingJobs } from "@/lib/db";

export async function GET() {
  try {
    const jobs = await getPendingJobs();
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch pending jobs" },
      { status: 500 }
    );
  }
}