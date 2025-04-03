import { NextResponse } from "next/server";
import { isUserAdmin } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ isAdmin: false });
  }

  const isAdmin = await isUserAdmin(userId);
  return NextResponse.json({ isAdmin });
}