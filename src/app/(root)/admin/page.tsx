"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCardSkeleton } from "@/components/job-card-skeleton";
import { UserChip } from "@/components/user-chip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Mail, Plus, Search, Loader2, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";

export default function Admin() {
  const { user } = useUser();
  const [pendingJobs, setPendingJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [recentApprovals, setRecentApprovals] = useState<JobPosting[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminApprovals, setAdminApprovals] = useState<any[]>([]);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [selectedTab, setSelectedTab] = useState("pending");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [removingAdmins, setRemovingAdmins] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Add this new function to fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const response = await fetch(`/api/admin/check?userId=${user?.id}`);
        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin);
        if (isAdmin) {
          await Promise.all([
            fetchPendingJobs(),
            fetchRecentApprovals(),
            fetchAdminApprovals(), // Add this new function call
          ]);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  // Add this new function
  // Modify fetchAdminApprovals function
  const fetchAdminApprovals = async () => {
    try {
      const response = await fetch("/api/admin/approvals");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAdminApprovals(data);

      // Fetch user data for each unique user ID
      const userIds = [
        ...new Set([
          ...data.map((a: any) => a.user_id),
          ...data.map((a: any) => a.approver_id),
        ]),
      ];
      const userDataPromises = userIds.map(async (userId) => {
        const userData = await fetchUserData(userId);
        return [userId, userData];
      });

      const userDataEntries = await Promise.all(userDataPromises);
      setUserData(Object.fromEntries(userDataEntries));

      return data;
    } catch (error) {
      console.error("Error fetching admin approvals:", error);
      return null;
    }
  };

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

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    
    try {
      setError(null);
      setAddingAdmin(true);
      const response = await fetch("/api/admin/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newAdminEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError("This email is not registered on the platform. Please invite the user to register first.");
        } else {
          setError("Failed to add admin. Please try again.");
        }
        return;
      }

      // Refresh admin list
      await fetchAdminApprovals();
      setNewAdminEmail("");
      setError(null);
      
      // Close modal by clicking its parent
      const modalElement = document.querySelector("[data-state='open']");
      if (modalElement) {
        const closeButton = modalElement.querySelector("button[aria-label='Close']");
        if (closeButton) {
          (closeButton as HTMLButtonElement).click();
        }
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleSelectAdmin = (approvalId: string, checked: boolean) => {
    setSelectedAdmins(prev => 
      checked 
        ? [...prev, approvalId]
        : prev.filter(id => id !== approvalId)
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedAdmins.length === 0) return;

    try {
      setRemovingAdmins(true);
      const response = await fetch("/api/admin/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approvalIds: selectedAdmins }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove admins");
      }

      // Refresh admin list and clear selection
      await fetchAdminApprovals();
      setSelectedAdmins([]);
    } catch (error) {
      console.error("Error removing admins:", error);
    } finally {
      setRemovingAdmins(false);
    }
  };

  const filteredAdminApprovals = useMemo(() => {
    if (!searchQuery.trim()) return adminApprovals;

    const query = searchQuery.toLowerCase().trim();
    return adminApprovals.filter(approval => {
      const user = userData[approval.user_id];
      if (!user) return false;

      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      
      return fullName.includes(query) || email.includes(query);
    });
  }, [adminApprovals, userData, searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto mt-16 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Job Approvals</h1>
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto mt-16 p-4">
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">Admin Access Required</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You currently don't have admin privileges. Request access to
                manage and approve job postings.
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  (window.location.href = `mailto:admin@joblink.com?subject=Admin Access Request&body=User ID: ${user?.id}`)
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Request Admin Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 p-4">
      <Tabs
        defaultValue="pending"
        className="space-y-6"
        onValueChange={setSelectedTab}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {selectedTab === "manage"
              ? "Manage Admins"
              : selectedTab == "recent"
              ? "Approved Jobs"
              : "Pending Job Approvals"}
          </h1>
          <TabsList className="bg-card">
            <TabsTrigger value="pending">
              {pendingJobs.length} Pending
            </TabsTrigger>
            <TabsTrigger value="recent">
              {recentApprovals.length} Approved
            </TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
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

        <TabsContent value="manage">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search admins..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleRemoveSelected}
                  disabled={removingAdmins || selectedAdmins.length === 0}
                >
                  {removingAdmins ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <Modal>
                  <ModalTrigger>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </ModalTrigger>
                  <ModalBody className="w-full max-w-md mx-auto h-auto">
                    <ModalContent className="bg-card">
                      <div className="space-y-3">
                        <h2 className="text-xl font-semibold">Add New Admin</h2>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">
                            Enter user email address
                          </label>
                          <Input
                            placeholder="email@example.com"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                          />
                        </div>
                        {error && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <Button 
                          className="w-full" 
                          onClick={handleAddAdmin}
                          disabled={addingAdmin || !newAdminEmail}
                        >
                          {addingAdmin ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Admin"
                          )}
                        </Button>
                      </div>
                    </ModalContent>
                  </ModalBody>
                </Modal>
              </div>
            </div>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50">
                <div className="flex items-center gap-4">
                  <Checkbox 
                    className="h-4 w-4 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted-foreground"
                    checked={adminApprovals.length > 0 && selectedAdmins.length === adminApprovals.filter(a => a.user_id !== user?.id).length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Select all except current user
                        setSelectedAdmins(adminApprovals
                          .filter(a => a.user_id !== user?.id)
                          .map(a => a.id)
                        );
                      } else {
                        setSelectedAdmins([]);
                      }
                    }}
                  />
                  <div className="font-medium text-sm">User</div>
                </div>
                <div className="font-medium text-sm">Email</div>
                <div className="font-medium text-sm">Date Added</div>
                <div className="font-medium text-sm">Date of Expiry</div>
              </div>

              {filteredAdminApprovals.length === 0 ? (
                <div className="p-3 text-center text-muted-foreground">
                  {searchQuery.trim() 
                    ? "No matching admins found" 
                    : "No admin approvals found"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredAdminApprovals.map((approval: any) => (
                    <div
                      key={approval.id}
                      className="grid grid-cols-4 gap-4 p-2 items-center"
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox 
                          className="h-4 w-4 ml-1 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted-foreground"
                          checked={selectedAdmins.includes(approval.id)}
                          onCheckedChange={(checked) => handleSelectAdmin(approval.id, checked as boolean)}
                          disabled={approval.user_id === user?.id}
                        />
                        {userData[approval.user_id] ? (
                          <UserChip
                            firstName={userData[approval.user_id].firstName}
                            lastName={userData[approval.user_id].lastName}
                            imageUrl={userData[approval.user_id].imageUrl}
                          />
                        ) : (
                          "Loading..."
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        {userData[approval.user_id]?.email || "Loading..."}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(approval.approved_at).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(approval.expires_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
