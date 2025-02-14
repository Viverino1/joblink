import { NextResponse } from 'next/server';
import { getJob } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const id = request.url.split('/').pop();
    const job = await getJob(id || "");
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}