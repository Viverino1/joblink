//TODO: Split up form into multiple screens. Prolly abt 3 form screens and a preivew screen before posting.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
  }),
  isRemote: z.boolean(),
  description: z.string().min(1, "Job description is required"),
  jobType: z.enum(["Intern", "Part-time"]),
  requirements: z.array(z.string().min(1, "Requirement is required")).min(1, "At least one requirement is required"),
  salary: z.string().min(1, "Salary is required"),
  contactEmail: z.string().email("Invalid email address"),
  hasExternalLink: z.boolean().default(false),
  applyLink: z.string().url("Invalid URL").optional(),
  applicants: z.object({
    total: z.number().min(1, "Total positions must be at least 1"),
    filled: z.number().min(0, "Filled positions cannot be negative"),
  }),
});

export default function PostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: {
        city: "",
        state: "",
      },
      isRemote: false,
      description: "",
      jobType: "Intern",
      requirements: [""],
      salary: "",
      contactEmail: "",
      hasExternalLink: false,
      applyLink: "",
      applicants: {
        total: 1,
        filled: 0,
      },
    },
    mode: "onSubmit", // Ensure validation happens on submit
  });

  const addRequirement = () => {
    form.setValue("requirements", [...form.watch("requirements"), ""]);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = form.watch("requirements").filter((_, i) => i !== index);
    form.setValue("requirements", newRequirements);
  };

  const toggleExternalLink = () => {
    form.setValue("hasExternalLink", !form.watch("hasExternalLink"));
    if (!form.watch("hasExternalLink")) {
      form.setValue("applyLink", "");
    }
  };

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    setLoading(true);
    setError(null);
    try {
      // Format the data to match the API schema
      const jobData = {
        title: data.title,
        company: data.company,
        location_city: data.location.city,
        location_state: data.location.state,
        is_remote: data.isRemote,
        description: data.description,
        requirements: data.requirements,
        job_type: data.jobType,
        salary: data.salary,
        applicants_total: 0,
        applicants_filled: 0,
        status: "pending",
        contact_email: data.contactEmail,
        apply_link: data.applyLink
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Failed to create job posting");
      }

      const result = await response.json();
      console.log('Job created successfully:', result);
      
      // Reset the form and redirect to browse page
      form.reset();
      router.push("/browse");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background p-4 mt-16">
      <div className="mx-auto max-w-xl mt-4 mb-6">
        <div className="flex flex-col gap-3 text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground">
            Create a new job listing for students to discover opportunities.
            <br />
            All listings will be screened by Lafayette High School.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Junior Web Developer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Remote Position
                        </FormLabel>
                        <FormDescription>
                          Allow working from home
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role and responsibilities"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="Intern">Intern</option>
                          <option value="Part-time">Part-time</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Requirements</FormLabel>
                  {form.watch("requirements").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`requirements.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="e.g. First Aid"
                              {...field}
                            />
                          </FormControl>
                          {form.watch("requirements").length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => removeRequirement(index)}
                              size="icon"
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRequirement}
                  >
                    Add Requirement
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 20.00/hr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasExternalLink"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          External Application Link
                        </FormLabel>
                        <FormDescription>
                          Add a link to your company's application page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={toggleExternalLink}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("hasExternalLink") && (
                  <FormField
                    control={form.control}
                    name="applyLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Link</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://company.com/apply"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="applicants.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Positions</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Total number of positions available
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicants.filled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filled Positions</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of positions already filled
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <FormItem>
                    <FormMessage className="text-red-500">{error}</FormMessage>
                  </FormItem>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Job Posting"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Error</h2>
              <p className="text-red-500">{error}</p>
              <Button onClick={() => setError(null)} className="mt-4">Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
