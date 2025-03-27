import { NextResponse } from "next/server";
import { revokeJobApproval } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();
    await revokeJobApproval(jobId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to revoke job approval" },
      { status: 500 }
    );
  }
}