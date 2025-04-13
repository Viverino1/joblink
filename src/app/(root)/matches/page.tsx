"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { JobCardSkeleton } from "@/components/job-card-skeleton";
import { Job } from "@/actions/job-matching";
import { getJobsByIds } from "@/actions/job-matching";

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jobIds = searchParams.get("jobIds");
    if (!jobIds) {
      setIsLoading(false);
      return;
    }

    const idsArray = jobIds.split(",");
    fetchJobs(idsArray);
  }, [searchParams]);

  const fetchJobs = async (ids: string[]) => {
    try {
      setIsLoading(true);
      const jobs = await getJobsByIds(ids);
      setJobs(jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 md:py-24">
      <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row md:gap-6 gap-4 md:px-6 px-4">
          <div className="w-full">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Job Matches</h1>
                <p className="text-muted-foreground text-sm">Based on your preferences and experience</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))
                ) : jobs.length === 0 ? (
                  <div className="text-center p-4">
                    <h2 className="text-xl font-semibold mb-2">No Matches Found</h2>
                    <p className="text-muted-foreground">
                      We couldn't find any job matches for you. Try adjusting your preferences and try again.
                    </p>
                    <button onClick={() => router.push("/match")} className="mt-4">
                      Try Again
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
