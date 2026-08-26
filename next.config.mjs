/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/rahfianugerah/portfolio/main/public/**",
      },
    ],
  },

  // Both of these URLs have been published, so they redirect rather than 404. The blog
  // moved to match the label it is navigated by; the experience page was absorbed into
  // the home page and is now an anchor on it.
  async redirects() {
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug", destination: "/writing/:slug", permanent: true },
      { source: "/experience", destination: "/#experiences", permanent: true },
    ];
  },
};

export default nextConfig;
