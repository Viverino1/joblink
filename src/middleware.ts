import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/post", "/admin"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && isPrivateRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Only redirect to onboarding for post and admin routes
  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    isPrivateRoute(req) &&
    req.nextUrl.pathname !== "/onboarding"
  ) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
