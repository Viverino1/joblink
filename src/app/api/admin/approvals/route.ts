import { NextResponse } from "next/server";
import { getAllAdminApprovals } from "@/lib/db";

export async function GET() {
  try {
    const approvals = await getAllAdminApprovals();
    return NextResponse.json(approvals);
  } catch (error) {
    console.error("Error fetching admin approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin approvals" },
      { status: 500 }
    );
  }
}