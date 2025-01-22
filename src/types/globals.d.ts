export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
      applicationName?: string
      applicationType?: string
    }
    firstName?: string
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
}