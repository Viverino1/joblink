import { createJobsTable, createJob } from '@/lib/db';
import { NextResponse } from 'next/server';

const sampleJobs = [
  {
    title: "UI/UX Designer",
    company: "Tech Solutions Inc.",
    location: { city: "Wildwood", state: "MO" },
    isRemote: false,
    description: "The User Experience Designer position exists to create compelling and elegant digital user experiences through design...",
    requirements: ["Design skills", "Prototyping", "User Research"],
    jobType: "Intern",
    salary: "15.00/hr",
    applicants: { total: 10, filled: 2 },
    status: "open"
  },
  {
    title: "Marketing Intern",
    company: "Local Buzz Marketing",
    location: { city: "Clayton", state: "MO" },
    isRemote: false,
    description: "Join our marketing team to learn about digital marketing strategies and social media management...",
    requirements: ["Social Media", "Content Creation", "Basic Analytics"],
    jobType: "Intern",
    salary: "16.50/hr",
    applicants: { total: 8, filled: 3 },
    status: "open"
  },
  {
    title: "Student Assistant",
    company: "City Library",
    location: { city: "St. Louis", state: "MO" },
    isRemote: false,
    description: "Help manage library resources and assist visitors with their needs...",
    requirements: ["Customer Service", "Organization", "Basic Computer Skills"],
    jobType: "Part-time",
    salary: "14.00/hr",
    applicants: { total: 5, filled: 1 },
    status: "open"
  }
];

export async function GET() {
  try {
    // First, ensure the table exists
    await createJobsTable();
    
    // Then add sample jobs one by one to better handle errors
    const jobs = [];
    for (const job of sampleJobs) {
      try {
        const newJob = await createJob(job);
        jobs.push(newJob);
        console.log(`Created job: ${job.title}`);
      } catch (error) {
        console.error(`Failed to create job ${job.title}:`, error);
      }
    }
    
    if (jobs.length === 0) {
      throw new Error('No jobs were created');
    }
    
    return NextResponse.json({ 
      message: `Successfully created ${jobs.length} jobs`,
      jobs 
    });
  } catch (error) {
    console.error('Error in seed route:', error);
    return NextResponse.json({ 
      error: 'Failed to seed database', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}