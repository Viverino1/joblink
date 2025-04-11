import { NextResponse } from 'next/server';
import { getJobs, createJob, createJobsTable } from '@/lib/db';

// Initialize database tables on startup
export async function GET() {
  try {
    // Create tables if they don't exist
    await createJobsTable();
    
    const jobs = await getJobs();
    return NextResponse.json(jobs || []);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ 
      msg: 'Failed to fetch jobs', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const job = await request.json();
    console.log('Received job data:', job); // Add debug logging

    if (!job || typeof job !== 'object') {
      return NextResponse.json({ 
        msg: 'Invalid job data', 
        error: 'Job data must be a valid object' 
      }, { status: 400 });
    }

    // Format the data to match the database schema
    const formattedJob = {
      title: job.title,
      company: job.company,
      location: {
        city: job.location_city,
        state: job.location_state
      },
      isRemote: job.is_remote,
      description: job.description,
      requirements: job.requirements,
      jobType: job.job_type,
      salary: job.salary,
      applicants: {
        total: job.applicants_total,
        filled: job.applicants_filled
      },
      status: job.status || "pending",
      contactEmail: job.contact_email,
      applyLink: job.apply_link
    };

    console.log('Creating job with formatted data:', formattedJob); // Debug log

    const newJob = await createJob(formattedJob);
    console.log('Created job:', newJob); // Add debug logging

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ 
      msg: 'Failed to create job', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}