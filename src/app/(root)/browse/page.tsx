"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  jobType: string;
  experience: string;
  postedDate: string;
}

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: "1",
      title: "UI/UX Designer",
      company: "Tech Solutions Inc.",
      location: "Lafayette, IN",
      description:
        "The User Experience Designer position exists to create compelling and elegant digital user experiences through design...",
      requirements: ["Design skills", "Prototyping", "User Research"],
      jobType: "Full Time",
      experience: "Senior Level",
      postedDate: "2024-02-15",
    },
    {
      id: "2",
      title: "Summer Marketing Intern",
      company: "Local Marketing Agency",
      location: "Lafayette, IN",
      description:
        "Looking for a creative and enthusiastic high school student to assist with social media management and content creation...",
      requirements: [
        "Social Media Knowledge",
        "Basic Design Skills",
        "Strong Writing",
      ],
      jobType: "Internship",
      experience: "Student Level",
      postedDate: "2024-02-16",
    },
    {
      id: "3",
      title: "Part-Time Retail Associate",
      company: "Fashion Boutique",
      location: "Lafayette, IN",
      description:
        "Join our team in providing exceptional customer service and maintaining store operations. Perfect for students!",
      requirements: ["Customer Service", "Basic Math", "Reliability"],
      jobType: "Part Time Jobs",
      experience: "Entry Level",
      postedDate: "2024-02-14",
    },
    {
      id: "4",
      title: "Remote Web Developer",
      company: "Digital Solutions Co.",
      location: "Remote",
      description:
        "Seeking a talented web developer to work on various projects from home. Flexible hours available.",
      requirements: ["HTML/CSS", "JavaScript", "React"],
      jobType: "Remote Jobs",
      experience: "Mid Level",
      postedDate: "2024-02-17",
    },
    {
      id: "5",
      title: "Contract Graphic Designer",
      company: "Creative Studios",
      location: "Lafayette, IN",
      description:
        "3-month contract position for creating marketing materials and social media content...",
      requirements: ["Adobe Creative Suite", "Typography", "Brand Design"],
      jobType: "Contract",
      experience: "Mid Level",
      postedDate: "2024-02-13",
    },
    {
      id: "6",
      title: "Student IT Help Desk",
      company: "Lafayette High School",
      location: "Lafayette, IN",
      description:
        "Help fellow students and staff with basic technical issues. Great opportunity to gain IT experience!",
      requirements: [
        "Basic IT Knowledge",
        "Communication Skills",
        "Problem Solving",
      ],
      jobType: "Part Time Jobs",
      experience: "Student Level",
      postedDate: "2024-02-18",
    },
  ]);

  return (
    <div className="container mx-auto py-24 px-4">
      {/* Search Bar */}
      <div className="mb-8 w-full">
        <Card className="bg-card hover:bg-accent/10 transition-colors">
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 border-none bg-transparent focus-visible:ring-0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-64 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Type of Employment</h2>
            <div className="space-y-2">
              {[
                "Full Time Jobs",
                "Part Time Jobs",
                "Remote Jobs",
                "Internship",
                "Contract",
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type} 
                    className="border-muted-foreground/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" 
                  />
                  <label htmlFor={type} className="text-sm text-muted-foreground">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Seniority Level</h2>
            <div className="space-y-2">
              {[
                "Student Level",
                "Entry Level",
                "Mid Level",
                "Senior Level",
              ].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={level} 
                    className="border-muted-foreground/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent" 
                  />
                  <label htmlFor={level} className="text-sm text-muted-foreground">
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="flex-1 space-y-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="bg-card hover:bg-accent/10 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-2xl font-semibold">
                      {job.title}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      {job.company}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.location}
                    </p>
                    <p className="text-base text-foreground/80 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge>{job.jobType}</Badge>
                      <Badge>{job.experience}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="card"
                        className="text-muted-foreground"
                      >
                        Messages
                      </Button>
                      <Button>Apply Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
