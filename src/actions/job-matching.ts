'use server'

import { currentUser } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { getJobs as dbGetJobs, getServerSql } from "@/lib/db";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: {
    city: string;
    state: string;
  };
  isRemote: boolean;
  postedDate: string;
  jobType: "Intern" | "Part-time";
  salary: string;
  description: string;
  requirements: string[];
  status: "open" | "closed";
  applicants: {
    total: number;
    filled: number;
  };
  updatedAt: string;
  contactEmail: string;
}

interface FormValues {
  education: string;
  skills: string[];
  experience: string;
  jobType: string;
  isRemote: boolean;
}

interface JobMatchingData {
  formValues: FormValues;
}

interface JobMatchingRequest {
  userData: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  formValues: FormValues;
  jobs: Job[];
}

export async function getUser() {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function getJobs(): Promise<Job[]> {
  try {
    const jobs = await dbGetJobs();
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from database:", error);
    throw error;
  }
}

export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  try {
    // Get all jobs
    const jobs = await dbGetJobs();
    
    // Filter jobs by the provided IDs
    const filteredJobs = jobs.filter((job: Job) => ids.includes(job.id));
    
    return filteredJobs;
  } catch (error) {
    console.error("Error fetching jobs by IDs:", error);
    throw error;
  }
}

export async function getJobMatches(data: JobMatchingData) {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("User not found");
    }

    // Check if there are any jobs in the database
    const testJobs = await dbGetJobs();
    if (testJobs.length === 0) {
      // Create some sample jobs if none exist
      const sql = await getServerSql();
      await sql`
        INSERT INTO jobs (
          id, title, company, location_city, location_state, is_remote, 
          description, requirements, job_type, salary, status
        ) VALUES
        ('job-123', 'Software Engineer', 'Tech Corp', 'New York', 'NY', false,
         'Looking for a talented software engineer', 
         ARRAY['JavaScript', 'React', 'Node.js'], 'full-time', '100000', 'active'),
        ('job-456', 'Data Scientist', 'Data Analytics Inc', 'San Francisco', 'CA', true,
         'Seeking a data scientist with machine learning experience',
         ARRAY['Python', 'Machine Learning', 'Pandas'], 'full-time', '120000', 'active'),
        ('job-789', 'UI/UX Designer', 'Design Co', 'Los Angeles', 'CA', true,
         'Need an experienced UI/UX designer',
         ARRAY['Figma', 'Adobe XD', 'User Research'], 'full-time', '90000', 'active')
      `;
      console.log("Created sample jobs in the database");
    }

    // Get all jobs
    const jobs = await dbGetJobs();
    if (jobs.length === 0) {
      throw new Error("No jobs found in the database");
    }

    // Log all the data being collected
    console.log("User data:", {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    });
    console.log("Form values:", data.formValues);
    console.log("Jobs:", jobs);

    // Initialize Groq client
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Prepare the prompt for Groq's API
    const prompt = `Match the following job seeker with the most suitable jobs based on their profile:

Job Seeker Profile:
Education: ${data.formValues.education}
Skills: ${data.formValues.skills.join(', ')}
Experience: ${data.formValues.experience}
Preferred Job Type: ${data.formValues.jobType}
Remote Work Preference: ${data.formValues.isRemote ? 'Yes' : 'No'}

Available Jobs:
${jobs.map((job: Job) => `
- ID: ${job.id}
  Title: ${job.title}
  Company: ${job.company}
  Remote: ${job.isRemote ? 'Yes' : 'No'}
  Requirements: ${job.requirements.join(', ')}
  Type: ${job.jobType}
  Salary: ${job.salary}`).join('\n')}

Please return ONLY the IDs of the top 3 most suitable jobs for this candidate, one per line, with no other text. Example:
- job-123
- job-456
- job-789
`;

    console.log("Prompt sent to Groq:", prompt);

    // Call Groq's API
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that specializes in job matching. Analyze the job seeker's profile and available jobs to find the best matches. Return ONLY the job IDs, one per line, with no other text or explanations. Example:
- job-123
- job-456
- job-789`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 100,
    });

    // Extract job IDs from the response
    const responseText = completion.choices[0]?.message?.content;
    console.log("Raw response from Groq:", responseText);
    
    if (!responseText) {
      throw new Error("No response received from Groq API");
    }

    // Parse the response to get job IDs
    const jobIds = responseText
      .split(/\n/g)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-"))
      .map((line) => line.replace(/^\s*-\s*/g, '')); // Remove only the leading dash and whitespace

    console.log("Extracted job IDs:", jobIds);

    if (jobIds.length === 0) {
      throw new Error("No job matches found in the response");
    }

    // Return only the job IDs array
    return jobIds;
  } catch (error) {
    console.error("Error in job matching:", error);
    throw error;
  }
}
