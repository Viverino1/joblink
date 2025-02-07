import { NextResponse } from 'next/server';
import { getJobs, createJob } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json(jobs || []);
  } catch (error) {
    return NextResponse.json({ msg: 'Failed to fetch jobs', error: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const job = await request.json();
    const newJob = await createJob(job);
    return NextResponse.json(newJob);
  } catch (error) {
    return NextResponse.json({ msg: 'Failed to create job', error: error }, { status: 500 });
  }
}