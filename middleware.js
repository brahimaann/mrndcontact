import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Make all routes public (disable authentication)
const isPublic = createRouteMatcher([
  "/(.*)", // Match all routes
]);

export default clerkMiddleware(async (auth, req) => {
  // Authentication is disabled - all routes are public
  // if (!isPublic(req)) {
  //   await auth.protect();
  // }
});

export const config = {
  matcher: [
    // recommended matcher from Clerk docs — skips static files, runs on API too
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
