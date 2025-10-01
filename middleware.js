import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublic = createRouteMatcher([
  "/",
  "/user(.*)",
  "/auth/callback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) {
    await auth.protect(); // ✅ <-- fix
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
