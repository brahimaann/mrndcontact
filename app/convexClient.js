"use client";
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
    "Please run 'npx convex dev' to set up your Convex project, or add NEXT_PUBLIC_CONVEX_URL to your .env.local file."
  );
}

export const convex = new ConvexReactClient(convexUrl);
