import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();
    const response = await fetch(
      `https://api.clerk.com/v1/users/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const user = await response.json();
    
    return NextResponse.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email_addresses[0]?.email_address,
      imageUrl: user.image_url,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}