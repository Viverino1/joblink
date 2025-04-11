import { NextResponse } from "next/server";
import { createAdminApproval } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    
    // Get user ID from email using Clerk
    const userResponse = await fetch(
      `https://api.clerk.com/v1/users?email_address=${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const users = await userResponse.json();
    if (!users.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newAdminId = users[0].id;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Set expiry to 1 year from now

    const approval = await createAdminApproval(newAdminId, userId, expiresAt);
    return NextResponse.json(approval);
  } catch (error) {
    console.error("Error adding admin:", error);
    return NextResponse.json(
      { error: "Failed to add admin" },
      { status: 500 }
    );
  }
}