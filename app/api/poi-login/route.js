import { NextResponse } from "next/server";
import { PASSWORD_TO_SLUG } from "../../poi/poi_passwords";

export const runtime = "edge";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const slug = PASSWORD_TO_SLUG[String(password || "").toLowerCase()];

  if (!slug) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, slug });

  // Clear any old auth cookie name you might have used
  res.cookies.set("poi_auth", "", { path: "/poi", maxAge: 0 });

  // Set a simple cookie containing the allowed slug
  res.cookies.set("poi_slug", slug, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/poi",          // valid for all POI pages
    maxAge: 60 * 60 * 2,   // 2 hours
  });

  return res;
}
