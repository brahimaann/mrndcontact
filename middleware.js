import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/user(.*)",
  "/auth/callback(.*)",
  '/works(.*)',
  '/cities(.*)',
  '/admin/talents(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect(); // ✅ <-- fix
  }
});

export const config = {
  matcher: [
    // recommended matcher from Clerk docs — skips static files, runs on API too
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
