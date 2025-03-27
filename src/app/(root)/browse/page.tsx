//TODO: Add a "bookmarked" filter

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
} from "lucide-react";
import { JobCard } from "@/components/job-card";
import { JobCardSkeleton } from "@/components/job-card-skeleton";

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
                filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
