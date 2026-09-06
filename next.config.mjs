/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Sanity's CDN is the only remote image host. The GitHub raw pattern went with public/,
    // which no longer exists: an image is a Sanity asset now.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  async redirects() {
    return [
      // Services are the consulting practice's, not this site's. /service was a page here
      // and has been linked, so it redirects rather than starting to 404.
      {
        source: "/service",
        destination: "https://consulting.rahfi.pro/#services",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
