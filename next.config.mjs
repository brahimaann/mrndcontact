/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
    ],
    // or, if you prefer the simple list:
    // domains: ["lh3.googleusercontent.com","lh4.googleusercontent.com","lh5.googleusercontent.com","lh6.googleusercontent.com"],
  },
};

export default nextConfig;
