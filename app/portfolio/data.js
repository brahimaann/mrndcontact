// app/portfolio/data.js

export const ARTISTS = [
  "Amina Diallo",
  "Kwesi Mensah",
  "Lola Njeri",
  "Manny Koroma",
  "Baba Ann",
  "Zara Conteh",
  "Esi Owusu",
  "Salahuddin Rahman",
  "Nana Adjei",
  "Imani Jallow",
  "Fatou Camara",
  "Kofi Boateng",
];

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const ARTIST_OBJS = ARTISTS.map((name) => ({ name, slug: slugify(name) }));

export function getArtistBySlug(slug) {
  return ARTIST_OBJS.find((a) => a.slug === slug) || null;
}
