import { NextResponse } from 'next/server';
import { createJobsTable, createBookmarksTable, createJobApprovalsTable } from '@/lib/db';

export async function POST() {
  try {
    await createJobsTable();
    await createBookmarksTable();
    await createJobApprovalsTable();
    
    return NextResponse.json({ 
      message: 'Database tables created successfully' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}