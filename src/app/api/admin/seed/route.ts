import { NextResponse } from "next/server";
import { getServerSql } from "@/lib/db";

export async function GET() {
  return POST();
}

export async function POST() {
  const sql = await getServerSql();
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS admin_approvals (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id TEXT NOT NULL,
        approver_id TEXT NOT NULL,
        approved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE(user_id)
      );
    `;

    // Insert admin
    const result = await sql`
      INSERT INTO admin_approvals (user_id, approver_id, expires_at)
      VALUES (
        'user_2urhrzWpnOzX4HEJrNEULSSY3oq',
        'user_2urhrzWpnOzX4HEJrNEULSSY3oq',
        CURRENT_TIMESTAMP + INTERVAL '1 year'
      )
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *;
    `;

    return NextResponse.json({ 
      message: "Admin seeded successfully",
      admin: result[0] 
    });
  } catch (error) {
    console.error("Error seeding admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin" },
      { status: 500 }
    );
  }
}