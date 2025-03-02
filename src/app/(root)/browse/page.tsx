"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  DollarSign,
  Search,
  Briefcase,
  BookmarkIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobTypes, setSelectedJobTypes] = useState<Set<string>>(
    new Set()
  );
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(
    new Set()
  );
  // Change salaryRange to use Set like other filters
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState<Set<string>>(
    new Set()
  );

  // Update filtering effect
  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesJobType =
        selectedJobTypes.size === 0 || selectedJobTypes.has(job.jobType);

      const matchesLocation =
        selectedLocations.size === 0 ||
        selectedLocations.has(job.location.city);

      // Update salary matching logic
      const matchesSalary =
        selectedSalaryRanges.size === 0 ||
        Array.from(selectedSalaryRanges).some((range) =>
          matchSalaryRange(job.salary, range)
        );

      return (
        matchesSearch && matchesJobType && matchesLocation && matchesSalary
      );
    });

    setFilteredJobs(filtered);
  }, [
    jobs,
    searchQuery,
    selectedJobTypes,
    selectedLocations,
    selectedSalaryRanges,
  ]);

  // Add helper function for salary matching
  const matchSalaryRange = (salary: string, range: string) => {
    // Extract hourly rate from strings like "15.00/hr" or "$15.00/hr"
    const hourlyRate = parseFloat(salary.replace(/[^0-9.]/g, ""));

    switch (range) {
      case "0-15":
        return hourlyRate <= 15;
      case "15-20":
        return hourlyRate > 15 && hourlyRate <= 20;
      case "20-25":
        return hourlyRate > 20 && hourlyRate <= 25;
      case "25+":
        return hourlyRate > 25;
      default:
        return true;
    }
  };

  // Add toggle functions for new filters
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      if (next.has(location)) {
        next.delete(location);
      } else {
        next.add(location);
      }
      return next;
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedJobTypes(new Set());
    setSelectedLocations(new Set());
    setSelectedSalaryRanges(new Set());
  };

  // Add toggle function for salary ranges
  const toggleSalaryRange = (range: string) => {
    setSelectedSalaryRanges((prev) => {
      const next = new Set(prev);
      if (next.has(range)) {
        next.delete(range);
      } else {
        next.add(range);
      }
      return next;
    });
  };

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const { userId } = useAuth();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());

  // Add this useEffect to fetch existing bookmarks
  useEffect(() => {
    async function fetchBookmarks() {
      if (!userId) return;
      try {
        const response = await fetch("/api/bookmarks");
        const data = await response.json();
        setBookmarkedJobs(
          new Set(data.map((bookmark: { id: string }) => bookmark.id))
        );
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    }
    fetchBookmarks();
  }, [userId]);

  const toggleBookmark = async (jobId: string) => {
    if (!userId) return;

    // Optimistically update the UI
    setBookmarkedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const { isBookmarked } = await response.json();

      // If the server response doesn't match our optimistic update, revert it
      if (isBookmarked !== bookmarkedJobs.has(jobId)) {
        setBookmarkedJobs((prev) => {
          const next = new Set(prev);
          if (isBookmarked) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });
      }
    } catch (error) {
      // Revert the optimistic update on error
      setBookmarkedJobs((prev) => {
        const next = new Set(prev);
        if (next.has(jobId)) {
          next.delete(jobId);
        } else {
          next.add(jobId);
        }
        return next;
      });
      console.error("Error toggling bookmark:", error);
    }
  };

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/jobs");
        const data = await response.json();
        // Check if data is an array before setting it
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  function JobCardSkeleton() {
    return (
      <Card className="hover:bg-accent/5 transition-colors bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="h-14 w-14 rounded-md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-5 w-5 shrink-0" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-20 md:py-24">
      <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row md:gap-6 gap-4 md:px-6 px-4">
          {/* Add sticky positioning to the filters column */}
          <div className="w-full lg:max-w-64 space-y-6 lg:sticky top-20">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <Button
                        variant="badge"
                        size="sm"
                        className="text-xs"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Job Type</h4>
                    <div className="space-y-2">
                      {["All", "Part-time", "Intern"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={
                              type === "All"
                                ? selectedJobTypes.size === 0
                                : selectedJobTypes.has(type)
                            }
                            onCheckedChange={() => {
                              if (type === "All") {
                                setSelectedJobTypes(new Set());
                              } else {
                                toggleJobType(type);
                              }
                            }}
                            className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={type}
                            className="text-sm text-muted-foreground"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range Filter */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Salary Range</h4>
                    <div className="space-y-2">
                      {[
                        { label: "All", value: "all" },
                        { label: "Up to $15/hr", value: "0-15" },
                        { label: "$15/hr - $20/hr", value: "15-20" },
                        { label: "$20/hr - $25/hr", value: "20-25" },
                        { label: "$25/hr+", value: "25+" },
                      ].map((range) => (
                        <div
                          key={range.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`salary-${range.value}`}
                            checked={
                              range.value === "all"
                                ? selectedSalaryRanges.size === 0
                                : selectedSalaryRanges.has(range.value)
                            }
                            onCheckedChange={() => {
                              if (range.value === "all") {
                                setSelectedSalaryRanges(new Set());
                              } else {
                                toggleSalaryRange(range.value);
                              }
                            }}
                            className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`salary-${range.value}`}
                            className="text-sm text-muted-foreground"
                          >
                            {range.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Location</h4>
                    <div className="space-y-2">
                      {[
                        "All",
                        "Wildwood",
                        "Chesterfield",
                        "Ballwin",
                        "Manchester",
                        "Ellisville",
                        "Eureka",
                      ].map((location) => (
                        <div
                          key={location}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`location-${location}`}
                            checked={
                              location === "All"
                                ? selectedLocations.size === 0
                                : selectedLocations.has(location)
                            }
                            onCheckedChange={() => {
                              if (location === "All") {
                                setSelectedLocations(new Set());
                              } else {
                                toggleLocation(location);
                              }
                            }}
                            className="border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`location-${location}`}
                            className="text-sm text-muted-foreground"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex w-full">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 md:gap-6 gap-4 w-full h-fit ">
              {isLoading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : filteredJobs.length === 0 ? (
                <div className="col-span-full text-center py-8 space-y-2 w-full">
                  <p className="text-lg font-medium text-muted-foreground">
                    No matches found
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <Modal key={job.id}>
                    <ModalTrigger className="w-full h-full">
                      <Card
                        className={`h-full hover:bg-accent/5 transition-colors bg-card border-border w-full ${
                          job.status === "closed" ? "opacity-70" : ""
                        }`}
                      >
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Header Section */}
                          <div className="flex items-start gap-6">
                            <div className="h-14 w-14 rounded-md bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                              <span className="text-xl font-medium">
                                {job.company.charAt(0)}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-left">
                                  <h3 className="font-medium text-base leading-none mb-2">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-none">
                                    {job.company}
                                  </p>
                                </div>
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleBookmark(job.id);
                                  }}
                                  className="text-muted-foreground hover:text-primary cursor-pointer"
                                >
                                  <BookmarkIcon
                                    className={`h-5 w-5 transition ${
                                      bookmarkedJobs.has(job.id)
                                        ? "fill-current text-primary hover:text-primary/80"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="default" className="text-xs">
                                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                                <span>{job.salary}</span>
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                <Briefcase className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                {job.jobType}
                              </Badge>
                              <Badge variant="default" className="text-xs">
                                <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                {job.location.city}, {job.location.state}
                              </Badge>
                              {job.isRemote && (
                                <Badge variant="default" className="text-xs">
                                  <Globe className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                                  Remote
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Progress Section */}
                          <div className="mt-4 space-y-3">
                            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  job.status === "closed"
                                    ? "bg-destructive/80"
                                    : "bg-primary/80"
                                }`}
                                style={{
                                  width: `${
                                    (job.applicants.filled /
                                      job.applicants.total) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span
                                className={
                                  job.status === "closed"
                                    ? "text-destructive font-medium"
                                    : "text-muted-foreground"
                                }
                              >
                                {job.status === "closed"
                                  ? "Position Closed"
                                  : `${job.applicants.filled} of ${job.applicants.total} filled`}
                              </span>
                              <span
                                className={
                                  job.status === "closed"
                                    ? "hidden"
                                    : "text-muted-foreground"
                                }
                              >
                                Updated{" "}
                                {new Date(job.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ModalTrigger>
                    <ModalBody className="mx-4 rounded-2xl">
                      <ModalContent className="p-4 md:p-6 space-y-4 md:space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-6">
                          <div className="h-14 w-14 rounded-md bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                            <span className="text-xl font-medium">
                              {job.company.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="text-md text-muted-foreground">
                                  {job.company}
                                </h2>
                                <h1 className="text-xl font-medium text-foreground">
                                  {job.title}
                                </h1>
                              </div>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleBookmark(job.id);
                                }}
                                className="text-muted-foreground hover:text-primary cursor-pointer"
                              >
                                <BookmarkIcon
                                  className={`h-5 w-5 transition ${
                                    bookmarkedJobs.has(job.id)
                                      ? "fill-current text-primary hover:text-primary/80"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3">
                          <Badge variant="default" className="text-xs">
                            <DollarSign className="h-3.5 w-3.5 shrink-0" />
                            <span>{job.salary}</span>
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            <Briefcase className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                            {job.jobType}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                            {job.location.city}, {job.location.state}
                          </Badge>
                          {job.isRemote && (
                            <Badge variant="default" className="text-xs">
                              <Globe className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                              Remote
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <div className="space-y-4 w-full">
                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Description
                            </h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {job.description}
                            </p>
                          </div>

                          {/* Requirements */}
                          <div>
                            <h3 className="text-sm font-medium mb-2">
                              Requirements
                            </h3>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {/* Add Contact Section */}
                        <div>
                          <h3 className="text-sm font-medium mb-2">Contact</h3>
                          <div className="text-sm text-muted-foreground">
                            <a
                              href={`mailto:${job.contactEmail}`}
                              className="w-fit text-muted-foreground hover:text-primary flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {job.contactEmail}
                            </a>
                          </div>
                        </div>

                        <div className="space-y-1 md:hidden block">
                          <p className="text-xs text-muted-foreground">
                            Posted:{" "}
                            {new Date(job.postedDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last Updated:{" "}
                            {new Date(job.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </ModalContent>
                      <ModalFooter className="border-t border-border bg-card/50 p-4 md:p-6">
                        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
                          <div className="space-y-1 hidden md:block">
                            <p className="text-xs text-muted-foreground">
                              Posted:{" "}
                              {new Date(job.postedDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last Updated:{" "}
                              {new Date(job.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Button 
                              variant="outline" 
                              className="border-border"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `mailto:${job.contactEmail}`;
                              }}
                            >
                              Contact
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `/jobs/${job.id}/apply`;
                              }}
                            >
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </ModalFooter>
                    </ModalBody>
                  </Modal>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
