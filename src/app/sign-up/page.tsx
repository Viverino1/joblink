import { SignUp } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUp routing="hash" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
