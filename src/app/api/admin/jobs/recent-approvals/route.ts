import { NextResponse } from "next/server";
import { getRecentApprovals } from "@/lib/db";

export async function GET() {
  try {
    const jobs = await getRecentApprovals();
    return NextResponse.json(jobs);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recent approvals" },
      { status: 500 }
    );
  }
}