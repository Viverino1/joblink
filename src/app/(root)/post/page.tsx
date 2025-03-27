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
// Add this import at the top with other imports
import { Switch } from "@/components/ui/switch";

// Update the schema to include applicants
const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
  }),
  isRemote: z.boolean(),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z
    .array(z.string())
    .min(1, "At least one requirement is needed"),
  jobType: z.enum(["Intern", "Part-time"]),
  salary: z.string().min(1, "Salary is required"),
  contactEmail: z.string().email("Invalid email address"),
  applyLink: z.string().url("Invalid URL").optional(),
  applicants: z
    .object({
      total: z.number().min(1, "Must have at least 1 position"),
      filled: z.number().min(0, "Cannot be negative"),
    })
    .refine((data) => data.filled <= data.total, {
      message: "Filled positions cannot exceed total positions",
      path: ["filled"],
    }),
});

export default function Post() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([""]);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      isRemote: false,
      jobType: "Intern",
      requirements: [""],
      applicants: {
        total: 1,
        filled: 0,
      },
    },
  });

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  const onSubmit = async (data: z.infer<typeof jobSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create job posting");

      router.push("/browse");
    } catch (error) {
      console.error("Error creating job:", error);
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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

                <div className="space-y-2">
                  <FormLabel>Requirements</FormLabel>
                  {requirements.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g. First Aid"
                        value={form.watch(`requirements.${index}`)}
                        onChange={(e) =>
                          form.setValue(`requirements.${index}`, e.target.value)
                        }
                      />
                      {requirements.length > 1 && (
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
                    </div>
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
                  name="applyLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        External Application Link (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://your-careers-page.com/job"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        If provided, applicants will be redirected to this URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            min={1}
                            placeholder="e.g. 5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of positions available
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
                        <FormLabel>Positions Filled</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={form.watch("applicants.total")}
                            placeholder="e.g. 0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Job Posting"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
