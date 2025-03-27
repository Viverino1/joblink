import { NextResponse } from "next/server";
import { createJobApproval } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { jobId, approverId } = await request.json();
    const approval = await createJobApproval(jobId, approverId);
    return NextResponse.json(approval);
  } catch {
    return NextResponse.json(
      { error: "Failed to approve job" },
      { status: 500 }
    );
  }
}