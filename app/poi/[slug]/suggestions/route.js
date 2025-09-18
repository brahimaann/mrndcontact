import { POI_INDEX } from "../../poi_data";

export const runtime = "edge";

function readCookieStr(req, name) {
  const all = req.headers.get("cookie") || "";
  for (const p of all.split(/;\s*/)) {
    const [k, ...v] = p.split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

export async function POST(req, ctx) {
  try {
    const { slug } = ctx.params;

    const cookieSlug = readCookieStr(req, "poi_slug");
    if (!cookieSlug || cookieSlug !== slug) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { suggestion = "", extra = "", userId = "", timestamp = "" } =
      await req.json().catch(() => ({}));

    const poi = POI_INDEX[slug] || {};

    // ✅ Works on Vercel/Node *and* Netlify/Deno Edge:
    const scriptURL =
      (typeof process !== "undefined" && process.env && process.env.APPS_SCRIPT_URL) ||
      (typeof Deno !== "undefined" && Deno.env && Deno.env.get && Deno.env.get("APPS_SCRIPT_URL"));

    if (!scriptURL) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing APPS_SCRIPT_URL for Edge runtime" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const form = new URLSearchParams();
    form.set("slug", slug);
    form.set("name", poi.name || "");
    form.set("suggestion", suggestion);
    form.set("userId", userId);
    form.set("timestamp", timestamp);
    form.set("referrer", req.headers.get("referer") || "");
    form.set("userAgent", req.headers.get("user-agent") || "");
    form.set("ip", req.headers.get("x-forwarded-for") || "");
    form.set("extra", extra);

    const upstream = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ ok: false, error: text }), {
        status: upstream.status || 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
