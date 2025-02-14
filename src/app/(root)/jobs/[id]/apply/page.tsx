"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import ApplicationLoadingSkeleton from "./loading";

// Update the schema to accept File instead of URL
const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  resume: z
    .instanceof(File, { message: "Please upload your resume" })
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine((file) => file.size <= 5000000, "File size must be less than 5MB"),
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters"),
});

export default function ApplicationPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phone: "",
      resume: undefined, // Change from empty string to undefined
      coverLetter: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.setValue("firstName", user.firstName || "");
      form.setValue("lastName", user.lastName || "");
      form.setValue("email", user.emailAddresses[0]?.emailAddress || "");
    }
  }, [user, form]);

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    }
    fetchJob();
  }, [id]);

  if (!job) return <ApplicationLoadingSkeleton />;

  return (
    <div className="flex min-h-svh flex-col items-center overflow-auto mt-12 bg-background">
      <div className="flex w-full max-w-md flex-col gap-6 my-auto">
        <Card className="relative">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Apply to {job.company}</CardTitle>
            <CardDescription>{job.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="space-y-4 rounded-lg border bg-foreground/5"
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                    Basic Information
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-card/30 text-foreground/70"
                              required
                              placeholder="John"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-card/30 text-foreground/70"
                              required
                              placeholder="Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              className="bg-card/30 text-foreground/70"
                              placeholder="johndoe@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input required placeholder="123 456 7891" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Resume (PDF)</FormLabel>
                      <FormControl>
                        <FileUpload
                          accept=".pdf"
                          required
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-foreground/60">
                        Upload your resume (PDF, max 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea
                          required
                          placeholder="Tell us why you're interested in this position..."
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>Minimum 100 characters</FormDescription>
                    </FormItem>
                  )}
                />

                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
