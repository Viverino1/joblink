"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCardSkeleton } from "@/components/job-card-skeleton";

export default function Admin() {
  const { user } = useUser();
  const [pendingJobs, setPendingJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [recentApprovals, setRecentApprovals] = useState<JobPosting[]>([]);

  useEffect(() => {
    Promise.all([fetchPendingJobs(), fetchRecentApprovals()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchRecentApprovals = async () => {
    try {
      const response = await fetch("/api/admin/jobs/recent-approvals");
      const data = await response.json();
      // Ensure data is an array before setting state
      setRecentApprovals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching recent approvals:", error);
      setRecentApprovals([]); // Set empty array on error
    }
  };

  const fetchPendingJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs/pending");
      const data = await response.json();
      // Ensure data is an array before setting state
      setPendingJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching pending jobs:", error);
      setPendingJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    setApproving(jobId);
    try {
      const response = await fetch("/api/admin/jobs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, approverId: user?.id }),
      });
      if (response.ok) {
        // Find the job being approved
        const approvedJob = pendingJobs.find((job) => job.id === jobId);

        // Remove from pending jobs
        setPendingJobs((prev) => prev.filter((job) => job.id !== jobId));

        // Add to recent approvals if job was found
        if (approvedJob) {
          setRecentApprovals((prev) => [
            {
              ...approvedJob,
              approvedAt: new Date().toISOString(),
              approvedBy: user?.id || "",
            },
            ...prev,
          ]);
        }
      }
    } catch (error) {
      console.error("Error approving job:", error);
    } finally {
      setApproving(null);
    }
  };

  const handleRevoke = async (jobId: string) => {
    try {
      const response = await fetch("/api/admin/jobs/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (response.ok) {
        const revokedJob = recentApprovals.find((job) => job.id === jobId);
        if (revokedJob) {
          setRecentApprovals((prev) => prev.filter((job) => job.id !== jobId));
          setPendingJobs((prev) => [
            ...prev,
            {
              ...revokedJob,
              status: "open" as const,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error revoking approval:", error);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto mt-16 p-4">
  //       <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4">
  //         <JobCardSkeleton />
  //         <JobCardSkeleton />
  //         <JobCardSkeleton />
  //         <JobCardSkeleton />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto mt-16 p-4">
      <Tabs defaultValue="pending" className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Job Approvals</h1>
          <TabsList className="bg-card">
            <TabsTrigger value="pending" className="">
              {pendingJobs.length} Pending
            </TabsTrigger>
            <TabsTrigger value="recent" className="">
              {recentApprovals.length} Approved
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4">
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : pendingJobs.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No pending jobs to approve
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4">
              {pendingJobs.map((job) => (
                <div key={job.id} className="contents">
                  <JobCard
                    job={job}
                    action={
                      <Button
                        className="w-full"
                        onClick={() => handleApprove(job.id)}
                        disabled={approving === job.id}
                      >
                        {approving === job.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          "Approve Job"
                        )}
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recentApprovals.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No recent approvals
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4">
              {recentApprovals.map((job) => (
                <div key={job.id} className="contents">
                  <JobCard
                    job={job}
                    action={
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleRevoke(job.id)}
                      >
                        Revoke Approval
                      </Button>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
