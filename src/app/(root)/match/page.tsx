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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { getJobMatches } from "@/actions/job-matching";

const jobMatchingSchema = z.object({
  education: z.string().min(1, "Grade level is required"),
  skills: z.array(z.string().min(1, "Please enter a skill")).min(1, "Please enter at least one skill"),
  experience: z.string().min(1, "Experience level is required"),
  jobType: z.string().min(1, "Job type is required"),
  isRemote: z.boolean(),
});

export default function Match() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(jobMatchingSchema),
    defaultValues: {
      education: "",
      skills: [""],
      experience: "",
      jobType: "",
      isRemote: false,
    },
  });

  const addSkill = () => {
    form.setValue("skills", [...form.watch("skills"), ""]);
  };

  const removeSkill = (index: number) => {
    const newSkills = form.watch("skills").filter((_, i) => i !== index);
    form.setValue("skills", newSkills);
  };

  async function onSubmit(values: z.infer<typeof jobMatchingSchema>) {
    try {
      setLoading(true);
      setError(null);

      // Prepare the data for the server action
      const data = {
        formValues: values,
      };

      // Call the server action
      const matches = await getJobMatches(data);
      
      // Redirect to matches page with job IDs as query parameter
      const jobIds = matches.join(",");
      router.push(`/matches?jobIds=${jobIds}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get job matches");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background p-4 mt-16">
      <div className="mx-auto max-w-md mt-4 mb-6">
        <div className="flex flex-col gap-3 text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Job Matching Questionnaire</h1>
          <p className="text-muted-foreground">Find jobs that match your skills and preferences</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select your grade level</option>
                          <option value="9">9th Grade (Freshman)</option>
                          <option value="10">10th Grade (Sophomore)</option>
                          <option value="11">11th Grade (Junior)</option>
                          <option value="12">12th Grade (Senior)</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Skills</FormLabel>
                  {form.watch("skills").map((_, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`skills.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="e.g. Graphic Design"
                              {...field}
                            />
                          </FormControl>
                          {form.watch("skills").length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => removeSkill(index)}
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
                    onClick={addSkill}
                  >
                    Add Skill
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Experience</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select your experience level</option>
                          <option value="none">No work experience</option>
                          <option value="intern">Completed an internship</option>
                          <option value="part-time">Have part-time work experience</option>
                          <option value="volunteer">Have volunteer experience</option>
                        </select>
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
                      <FormLabel>Preferred Job Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select your preferred job type</option>
                          <option value="intern">Internship</option>
                          <option value="part-time">Part-time</option>
                          <option value="full-time">Full-time</option>
                          <option value="volunteer">Volunteer</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remote Work</FormLabel>
                        <FormDescription>
                          Would you prefer remote work opportunities?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    "Find My Matches"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}