'use client';

import Hero from "./components/hero";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: {
    city: string;
    state: string;
  };
  isRemote: boolean;
  description: string;
  requirements: string[];
  postedDate: string;
  salary: string;
  jobType: "Intern" | "Part-time";
  applicants: {
    total: number;
    filled: number;
  };
  status: "open" | "closed";
  updatedAt: string;
  contactEmail: string;
  applyLink?: string;
}

const mockJobs: JobPosting[] = [
  {
    id: "1",
    title: "Junior Software Developer",
    company: "Tech Solutions",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: false,
    description: "Looking for a motivated high school student to join our development team. This is a great opportunity to gain real-world experience in software development.",
    requirements: [
      "Basic knowledge of programming",
      "Good communication skills",
      "Ability to work independently"
    ],
    postedDate: "2025-04-13",
    salary: "$15/hour",
    jobType: "Part-time",
    applicants: {
      total: 5,
      filled: 2
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@techsolutions.com",
    applyLink: "https://techsolutions.com/apply"
  },
  {
    id: "2",
    title: "Social Media Manager",
    company: "Marketing Pro",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: true,
    description: "Help us manage our social media presence and create engaging content for our clients.",
    requirements: [
      "Basic understanding of social media",
      "Creative content creation",
      "Good communication skills"
    ],
    postedDate: "2025-04-13",
    salary: "$12/hour",
    jobType: "Part-time",
    applicants: {
      total: 3,
      filled: 1
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@marketingpro.com",
    applyLink: "https://marketingpro.com/apply"
  },
  {
    id: "3",
    title: "Tutor",
    company: "Academic Support",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: true,
    description: "Help students with their homework and study for exams in various subjects.",
    requirements: [
      "Strong academic background",
      "Patient and understanding",
      "Good communication skills"
    ],
    postedDate: "2025-04-13",
    salary: "$18/hour",
    jobType: "Part-time",
    applicants: {
      total: 4,
      filled: 0
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@academicsupport.com",
    applyLink: "https://academicsupport.com/apply"
  },
  {
    id: "4",
    title: "Graphic Designer",
    company: "Creative Co.",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: false,
    description: "Create engaging visual content for our clients' marketing needs.",
    requirements: [
      "Basic design skills",
      "Creativity",
      "Attention to detail"
    ],
    postedDate: "2025-04-13",
    salary: "$16/hour",
    jobType: "Part-time",
    applicants: {
      total: 6,
      filled: 3
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@creativeco.com",
    applyLink: "https://creativeco.com/apply"
  },
  {
    id: "5",
    title: "Customer Service Representative",
    company: "Customer First",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: true,
    description: "Provide excellent customer service and support for our clients.",
    requirements: [
      "Great communication skills",
      "Problem-solving ability",
      "Professional demeanor"
    ],
    postedDate: "2025-04-13",
    salary: "$14/hour",
    jobType: "Part-time",
    applicants: {
      total: 8,
      filled: 4
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@customerfirst.com",
    applyLink: "https://customerfirst.com/apply"
  },
  {
    id: "6",
    title: "Event Staff",
    company: "Event Pro",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: false,
    description: "Help organize and manage events for our clients.",
    requirements: [
      "Organizational skills",
      "Team player",
      "Flexible schedule"
    ],
    postedDate: "2025-04-13",
    salary: "$13/hour",
    jobType: "Part-time",
    applicants: {
      total: 7,
      filled: 2
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@eventpro.com",
    applyLink: "https://eventpro.com/apply"
  },
  {
    id: "7",
    title: "Content Writer",
    company: "WordSmith",
    location: {
      city: "Lafayette",
      state: "MO"
    },
    isRemote: true,
    description: "Create engaging content for our clients' websites and social media.",
    requirements: [
      "Strong writing skills",
      "Creativity",
      "Research ability"
    ],
    postedDate: "2025-04-13",
    salary: "$17/hour",
    jobType: "Part-time",
    applicants: {
      total: 5,
      filled: 1
    },
    status: "open",
    updatedAt: "2025-04-13",
    contactEmail: "jobs@wordsmith.com",
    applyLink: "https://wordsmith.com/apply"
  }
];

export default function Landing() {
  const handleApprove = (id: string) => {
    console.log(`Approve job with id ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete job with id ${id}`);
  };

  const handleEdit = (id: string) => {
    console.log(`Edit job with id ${id}`);
  };

  const handleRevoke = (id: string) => {
    console.log(`Revoke approval for job with id ${id}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Hero />
      <div className="w-full px-4 mt-48 mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-rows-2 grid-cols-3 gap-4 h-[70vh]">
            <Card className="p-6 col-span-2 overflow-hidden bg-card/30 relative">
              <div className="absolute -bottom-[250px] -right-[800px] w-[2000px] h-[400px] rounded-full bg-primary/30 blur-3xl pointer-events-none -rotate-[10deg]"></div>
              <CardHeader className="p-0">
                <CardTitle className="font-mont text-2xl md:text-3xl">Extensive Job Network</CardTitle>
                <CardDescription>Access hundreds of local job opportunities perfect for high school students</CardDescription>
                <div className="mt-4">
                  <a href="/browse" className="text-primary font-light text-sm inline-flex items-center gap-2 hover:gap-3 transition-all duration-200">
                    Browse Jobs
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </CardHeader>
              <div className="mt-4 relative h-[400px]">
                <div className="absolute top-0 left-0 transform -translate-x-[60px] translate-y-[80px]">
                  {mockJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className={`absolute top-0 left-0 w-[500px] transition-none duration-0 select-none pointer-events-none`}
                      style={{
                        transform: `translateX(${index * 100}px) rotate(${index * 12}deg) scale(0.80)`,
                        zIndex: index,
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="absolute -top-2 -right-2 w-[150px] h-[150px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none"></div>
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/30 row-span-2 flex flex-col items-center justify-center">
              <div className="h-64 w-48 absolute bg-primary/30 blur-3xl"></div>
              <CardHeader className="p-0">
                <CardTitle className="font-mont text-2xl md:text-3xl">AI Job Matching</CardTitle>
                <CardDescription>Our AI technology finds the perfect jobs matching your skills and interests</CardDescription>
              </CardHeader>
              <div className="mt-4 py-8 relative h-full overflow-hidden">
                <img 
                  src="/images/ai-matching-form.png" 
                  alt="AI Job Matching Form" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-4">
                <a href="/match" className="text-primary font-light text-sm inline-flex items-center gap-2 hover:gap-3 transition-all duration-200">
                  Try AI Matching
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </Card>
            <Card className="p-6 bg-card/30 col-span-2 flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <CardTitle className="font-mont text-2xl md:text-3xl">Verified for Safety</CardTitle>
                <CardDescription>Every opportunity is pre-approved by Lafayette High School staff for your safety</CardDescription>
              </CardHeader>
              <div className="flex w-full h-full gap-4 justify-center mt-4">
                <div className="h-full pb-20 relative">
                  <div className="absolute bg-primary/20 blur-3xl rounded-full w-full h-full"></div>
                  <div className="h-full rounded-lg overflow-clip">
                    <img 
                      src="/images/approve.png" 
                      alt="Approve" 
                      className="h-full object-contain relative z-10" 
                    />
                  </div>
                </div>
                <div className="h-full pb-20 relative">
                  <div className="absolute bg-primary/20 blur-3xl rounded-full w-full h-full"></div>
                  <div className="h-full rounded-lg overflow-clip">
                    <img 
                      src="/images/revoke.png" 
                      alt="Revoke" 
                      className="h-full object-contain relative z-10" 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <a href="/verified-jobs" className="text-primary font-light text-sm inline-flex items-center gap-2 hover:gap-3 transition-all duration-200">
                  View Verified Jobs
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
