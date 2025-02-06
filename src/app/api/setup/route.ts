import { NextResponse } from 'next/server';
import { createBookmarksTable } from '@/lib/db';

export async function GET() {
  try {
    await createBookmarksTable();
    return NextResponse.json({ message: 'Bookmarks table created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Failed to create bookmarks table' }, { status: 500 });
  }
}