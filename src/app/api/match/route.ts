import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

interface Job {
  id: string;
  title: string;
  company: string;
  location_city: string;
  location_state: string;
  is_remote: boolean;
  description: string;
  requirements: string[];
  job_type: string;
  salary: string;
  status: string;
  applicants_total: number;
  applicants_filled: number;
}

interface JobMatchingRequest {
  userData: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  formValues: {
    education: string;
    skills: string[];
    experience: string;
    jobType: string;
    isRemote: boolean;
  };
  jobs: Job[];
}

export async function POST(request: Request) {
  try {
    const { userData, formValues, jobs } = await request.json() as JobMatchingRequest;

    // Initialize Groq client
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Prepare the prompt for Groq's API
    const prompt = `Match the following job seeker with the most suitable jobs based on their profile:

Job Seeker Profile:
Education: ${formValues.education}
Skills: ${formValues.skills.join(', ')}
Experience: ${formValues.experience}
Preferred Job Type: ${formValues.jobType}
Remote Work Preference: ${formValues.isRemote ? 'Yes' : 'No'}

Available Jobs:
${jobs.map((job) => `
- ${job.title} at ${job.company}
  Location: ${job.location_city}, ${job.location_state}
  Remote: ${job.is_remote ? 'Yes' : 'No'}
  Requirements: ${job.requirements.join(', ')}
  Type: ${job.job_type}
  Salary: ${job.salary}`).join('\n')}

Please return the IDs of the top 3 most suitable jobs for this candidate, ranked by compatibility.
`;

    // Call Groq's API
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that specializes in job matching. Analyze the job seeker's profile and available jobs to find the best matches.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    // Extract job IDs from the response
    const responseText = chatCompletion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response received from Groq API");
    }

    const jobIds = responseText
      .split(/\n/g)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-"))
      .map((line) => line.replace(/-/g, '').trim());

    return NextResponse.json({ jobIds });
  } catch (error) {
    console.error("Error in match endpoint:", error);
    return NextResponse.json(
      { error: "Failed to process job matching request" },
      { status: 500 }
    );
  }
}
