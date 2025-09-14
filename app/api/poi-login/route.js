// app/api/poi-login/route.js
import { NextResponse } from "next/server";
import { PASSWORD_TO_SLUG } from "../../poi/poi_passwords";
import { issueToken } from "../../../lib/poiAuth";

export const runtime = "edge";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const slug = PASSWORD_TO_SLUG[String(password || "").toLowerCase()];
  if (!slug) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const token = await issueToken(slug, 120);
  const res = NextResponse.json({ ok: true, slug });
  res.cookies.set("poi_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/poi",
    maxAge: 60 * 60 * 2,
  });
  return res;
}
