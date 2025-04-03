export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      applicationName?: string;
      applicationType?: string;
    };
    publicMetadata: {
      onboardingComplete?: boolean;
      firstName?: string;
      lastName?: string;
      bio?: string;
      linkedin?: string;
    };
    firstName?: string;
  }

  interface JobPosting {
    id: string;
    title: string;
    company: string;
    location: {
      city: string;
      state: string;
    };
    isRemote: boolean;
    description: string;
    requirements: string[];
    postedDate: string;
    salary: string;
    jobType: "Intern" | "Part-time";
    applicants: {
      total: number;
      filled: number;
    };
    status: "open" | "closed";
    updatedAt: string;
    contactEmail: string;
    applyLink?: string; // Add this line
  }
}

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  pfp: string;
  bio: string;
  linkedin: string;
  onboardingComplete: boolean;
};
