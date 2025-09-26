// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public (no sign-in required)
const isPublic = createRouteMatcher([
  "/",
  "/calander",
  "/portfolio(.*)",
  "/projects(.*)",
  "/blog(.*)",
  "/poi(.*)",
  "/contact",
  "/archive(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect everything NOT matched above
  if (!isPublic(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
