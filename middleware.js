import { NextResponse } from "next/server";

export function middleware(req) {
  // Only guard /poi/*
  if (!req.nextUrl.pathname.startsWith("/poi")) return NextResponse.next();

  // Path like /poi/<slug>/...
  const [, , pathSlug = ""] = req.nextUrl.pathname.split("/");
  const cookieSlug = req.cookies.get("poi_slug")?.value || "";

  // Allow only if cookie matches the slug in the URL
  if (cookieSlug && cookieSlug === pathSlug) {
    return NextResponse.next();
  }

  // Otherwise bounce to home with a flag
  const url = new URL("/", req.url);
  url.searchParams.set("unauthorized", "1");
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/poi/:path*"] };
