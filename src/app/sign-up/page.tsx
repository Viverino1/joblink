import { SignUp } from "@clerk/nextjs";

//Problem: If a user who has previously authenticated forgets they have an account and signs in through the sign up page, the authentication fails.
//The user is redirected to a sign in page without an explanation and after the user attempts to log in a second time through this page, they are redirected to a 404 page.
//TODO: Give the user a toast (popup) or some other warning to tell them they already have an account and prompt them to sign in instead of sign up.
//TODO: Make it all redirect correctly, reliably, and cleanly.

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
}
