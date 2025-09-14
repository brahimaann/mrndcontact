// lib/poiAuth.js
// Edge-safe HMAC + base64url utilities

const te = new TextEncoder();
const td = new TextDecoder();

const SECRET = process.env.POI_SECRET;


// base64url helpers
function toBase64Url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - b64url.length % 4) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}


function assertSecret() {
  if (!SECRET || !String(SECRET).length) {
    throw new Error("POI_SECRET is not set. Add it to .env.local and restart dev server.");
  }
}

async function hmac(input) {
  assertSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    te.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, te.encode(input));
  return new Uint8Array(mac);
}

// Create a compact token: base64url(payload) + "." + base64url(hmac(payload))
export async function issueToken(slug, ttlMinutes = 120) {
  if (!slug) throw new Error("missing slug");
  const payload = { slug, exp: Date.now() + ttlMinutes * 60_000 };
  const p = toBase64Url(te.encode(JSON.stringify(payload)));
  const sig = toBase64Url(await hmac(p));
  return `${p}.${sig}`;
}

export async function verifyToken(token) {
  try {
    if (!token) return null;
    const [p, sig] = token.split(".");
    if (!p || !sig) return null;
    const expected = toBase64Url(await hmac(p));
    if (sig !== expected) return null;
    const payload = JSON.parse(td.decode(fromBase64Url(p)));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
