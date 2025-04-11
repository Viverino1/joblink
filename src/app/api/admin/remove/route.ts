import { NextResponse } from "next/server";
import { deleteAdminApprovals } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { approvalIds } = await request.json();
    
    if (!Array.isArray(approvalIds) || approvalIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: approvalIds must be a non-empty array" },
        { status: 400 }
      );
    }

    await deleteAdminApprovals(approvalIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing admins:", error);
    return NextResponse.json(
      { error: "Failed to remove admins" },
      { status: 500 }
    );
  }
}
