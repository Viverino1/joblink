import { NextResponse } from "next/server";
import { createJob } from "@/lib/db";

const dummyJobs = [
  {
    title: "Junior Web Developer",
    company: "TechStart Solutions",
    location: { city: "Wildwood", state: "MO" },
    isRemote: false,
    description:
      "Looking for an enthusiastic junior web developer to join our growing team. You'll work on real projects, learn from experienced developers, and gain hands-on experience with modern web technologies. Great opportunity for students interested in software development.",
    requirements: [
      "HTML/CSS",
      "JavaScript",
      "React basics",
      "Good communication skills",
    ],
    jobType: "Intern",
    salary: "18.50/hr",
    contactEmail: "careers@techstart.com",
    applicants: { total: 10, filled: 3 },
    status: "open",
  },
  {
    title: "Content Writer Intern",
    company: "Media Minds",
    location: { city: "Clayton", state: "MO" },
    isRemote: true,
    description: "Join our creative team to develop engaging content for various digital platforms. Perfect opportunity for aspiring writers to gain real-world experience in digital marketing and content creation.",
    requirements: ["Strong writing skills", "SEO knowledge", "Social media familiarity", "Creative mindset"],
    jobType: "Intern",
    salary: "16.75/hr",
    contactEmail: "hiring@mediaminds.com",
    applicants: { total: 7, filled: 2 },
    status: "open"
  },
  {
    title: "Healthcare Administrative Assistant",
    company: "Wellness Center STL",
    location: { city: "Kirkwood", state: "MO" },
    isRemote: false,
    description: "Part-time position supporting our healthcare administration team. Great opportunity for students interested in healthcare management.",
    requirements: ["MS Office proficiency", "Healthcare terminology", "Customer service", "Organization skills"],
    jobType: "Part-time",
    salary: "19.50/hr",
    contactEmail: "jobs@wellnessstl.com",
    applicants: { total: 9, filled: 4 },
    status: "open"
  },
  {
    title: "Finance Intern",
    company: "Gateway Financial",
    location: { city: "Clayton", state: "MO" },
    isRemote: false,
    description: "Learn financial analysis and reporting while working with our experienced team. Excellent opportunity for finance and accounting students.",
    requirements: ["Excel proficiency", "Basic accounting", "Attention to detail", "Analytics skills"],
    jobType: "Intern",
    salary: "20.00/hr",
    contactEmail: "careers@gatewayfinancial.com",
    applicants: { total: 12, filled: 3 },
    status: "open"
  },
  {
    title: "Event Planning Assistant",
    company: "Premier Events",
    location: { city: "Webster Groves", state: "MO" },
    isRemote: false,
    description: "Assist in planning and executing various corporate and social events. Flexible hours perfect for students.",
    requirements: ["Organization skills", "Communication", "Multi-tasking", "Customer service"],
    jobType: "Part-time",
    salary: "17.25/hr",
    contactEmail: "events@premierevents.com",
    applicants: { total: 6, filled: 2 },
    status: "open"
  },
  {
    title: "Laboratory Research Assistant",
    company: "BioTech Solutions",
    location: { city: "Chesterfield", state: "MO" },
    isRemote: false,
    description: "Support ongoing research projects in our state-of-the-art laboratory. Ideal for biology and chemistry students.",
    requirements: ["Lab safety knowledge", "Basic lab techniques", "Data recording", "Attention to detail"],
    jobType: "Intern",
    salary: "19.75/hr",
    contactEmail: "lab@biotechsolutions.com",
    applicants: { total: 8, filled: 3 },
    status: "open"
  },
  {
    title: "UI/UX Design Intern",
    company: "Digital Innovations",
    location: { city: "Clayton", state: "MO" },
    isRemote: true,
    description: "Create user-centered designs for web and mobile applications. Work with our design team on real client projects.",
    requirements: ["Figma/Sketch", "Basic HTML/CSS", "User research", "Portfolio required"],
    jobType: "Intern",
    salary: "21.00/hr",
    contactEmail: "design@digitalinnovations.com",
    applicants: { total: 15, filled: 5 },
    status: "open"
  },
  {
    title: "Environmental Project Assistant",
    company: "EcoSmart Solutions",
    location: { city: "Kirkwood", state: "MO" },
    isRemote: false,
    description: "Support environmental conservation projects and sustainability initiatives. Perfect for environmental science students.",
    requirements: ["Environmental knowledge", "Data collection", "Report writing", "Field work experience"],
    jobType: "Part-time",
    salary: "18.25/hr",
    contactEmail: "projects@ecosmart.com",
    applicants: { total: 5, filled: 2 },
    status: "open"
  },
  {
    title: "Supply Chain Intern",
    company: "Global Logistics Co",
    location: { city: "Manchester", state: "MO" },
    isRemote: false,
    description: "Learn supply chain management and logistics operations. Hands-on experience with inventory and shipping processes.",
    requirements: ["Excel skills", "Analytical thinking", "Process improvement", "Team player"],
    jobType: "Intern",
    salary: "18.75/hr",
    contactEmail: "logistics@globallogistics.com",
    applicants: { total: 7, filled: 2 },
    status: "open"
  },
  {
    title: "Youth Sports Coach",
    company: "Community Athletics",
    location: { city: "Webster Groves", state: "MO" },
    isRemote: false,
    description: "Lead youth sports programs and activities. Perfect for physical education or sports management students.",
    requirements: ["Sports background", "First Aid/CPR", "Leadership skills", "Working with children"],
    jobType: "Part-time",
    salary: "16.50/hr",
    contactEmail: "sports@communityathletics.com",
    applicants: { total: 10, filled: 4 },
    status: "open"
  },
  {
    title: "Veterinary Assistant",
    company: "Caring Paws Clinic",
    location: { city: "Ballwin", state: "MO" },
    isRemote: false,
    description: "Assist veterinarians in animal care and clinic operations. Great experience for veterinary medicine students.",
    requirements: ["Animal handling", "Basic medical terms", "Compassionate nature", "Physical stamina"],
    jobType: "Part-time",
    salary: "17.75/hr",
    contactEmail: "careers@caringpaws.com",
    applicants: { total: 8, filled: 3 },
    status: "open"
  }
];

export async function POST() {
  try {
    const createdJobs = [];
    for (const job of dummyJobs) {
      try {
        console.log("Attempting to create job:", job.title);
        const createdJob = await createJob(job);
        createdJobs.push(createdJob);
        console.log("Successfully created job:", job.title);
      } catch (jobError) {
        console.error("Error creating job:", job.title, jobError);
        throw jobError; // Re-throw to see the actual error
      }
    }

    if (createdJobs.length === 0) {
      return NextResponse.json(
        {
          error: "No jobs were created",
          details: "Check server logs for specific errors",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdJobs.length} jobs`,
      jobs: createdJobs,
    });
  } catch (error) {
    console.error("Error in seed route:", error);
    return NextResponse.json(
      {
        error: "Failed to seed jobs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
