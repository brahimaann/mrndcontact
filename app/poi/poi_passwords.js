// poi_passwords.js
// Uses your existing POI_INDEX and layers on personalized passwords.
// You can change any password values below at any time.

import { POI_INDEX } from "./poi_data";

// Custom passwords → slug mapping (all keys should be lowercase)
export const CUSTOM_PASSWORDS = {
  "juice-2407": "juice-james",
  "eddie-4129": "eddie-cole",
  "antoine-7315": "antoine-the-artist",
  "braayzie-9051": "braayzie",
  "becca-2864": "becca-ogegea",
  "bina-7743": "bina-shanae",
  "gilly-1682": "gilly",
  "adriann-8346": "ohheyadriann",
  "deus-5521": "deus",
  "cynthia-6738": "cynthia",
  "moswave-2209": "mo-swave",
  "thomas-4932": "thomas-ngono",
  "jay-9016": "jay",
  "mk-7185": "mk",
  "lyric-6420": "lyric",
  "manny-3574": "manny",
  "ashley-8142": "ashley",
  "paityn-4699": "paityn",
  "halima-2806": "halima",
  "faith-9903": "faith",
  "meme-4418": "meme",
  "kidus-7361": "kidus",
  "brandyn-2275": "brandyn-lee",
};

// If you ALSO want the slug itself to work as a password, keep this true.
// Set to false to only allow the personalized passwords above.
const ALLOW_SLUG_PASSWORDS = true;

// Map of password -> slug used by the homepage form
export const PASSWORD_TO_SLUG = {
  ...(ALLOW_SLUG_PASSWORDS
    ? Object.fromEntries(
        Object.keys(POI_INDEX).map((slug) => [slug.toLowerCase(), slug])
      )
    : {}),
  ...CUSTOM_PASSWORDS,
};

// (Optional) If you want the password visible per entry in code:
export const POI_WITH_PASSWORDS = Object.fromEntries(
  Object.entries(POI_INDEX).map(([slug, data]) => {
    // personalized one if present, else slug (if allowed), else empty
    const personalized =
      Object.entries(CUSTOM_PASSWORDS).find(([, s]) => s === slug)?.[0] || "";
    const fallback = ALLOW_SLUG_PASSWORDS ? slug : "";
    return [slug, { ...data, password: personalized || fallback }];
  })
);
