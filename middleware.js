// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "./lib/poiAuth";

export async function middleware(req) {
  if (!req.nextUrl.pathname.startsWith("/poi")) return NextResponse.next();
  const token = req.cookies.get("poi_auth")?.value || "";
  const data = await verifyToken(token);
  if (!data) {
    const url = new URL("/", req.url);
    url.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/poi/:path*"] };
