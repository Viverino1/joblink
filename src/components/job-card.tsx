//TODO: Decrease bounce on popup.
//TODO: Add edit functionality.
//TODO: Add allow users to add a company logo.
//TODO: Add allow users to add an address.

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkIcon,
  Briefcase,
  DollarSign,
  Globe,
  MapPin,
} from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "./ui/animated-modal";
import { Button } from "./ui/button";
import { useBookmarks } from "@/contexts/bookmarks-context";

interface JobCardProps {
  job: JobPosting;
  action?: React.ReactNode;
}

export function JobCard({ job, action }: JobCardProps) {
  const { bookmarkedJobs, toggleBookmark } = useBookmarks();
  
  return (
    <div className="relative">
      <Modal key={job.id}>
        <div className="flex flex-col h-full">
          <ModalTrigger>
            <div className="w-full h-full cursor-pointer">
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
                            (job.applicants.filled / job.applicants.total) * 100
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
                        {new Date(job.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {action && <div className="mt-4 h-9"></div>}
                </CardContent>
              </Card>
            </div>
          </ModalTrigger>
        </div>
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
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-medium mb-2">Requirements</h3>
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
                {new Date(job.postedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                Last Updated:{" "}
                {new Date(job.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </ModalContent>
          <ModalFooter className="border-t border-border bg-card/50 p-4 md:p-6">
            <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
              <div className="space-y-1 hidden md:block">
                <p className="text-xs text-muted-foreground">
                  Posted:{" "}
                  {new Date(job.postedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last Updated:{" "}
                  {new Date(job.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
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
      {action && (
        <div className="absolute bottom-6 left-6 right-6 p-[1px]">{action}</div>
      )}
    </div>
  );
}
