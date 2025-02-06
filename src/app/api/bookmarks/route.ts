import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { toggleBookmark, getUserBookmarks } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await request.json();
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const isBookmarked = await toggleBookmark(userId, jobId);
    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await getUserBookmarks(userId);
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Bookmark fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}