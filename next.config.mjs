/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Every image is a public Google Cloud Storage object, uploaded in the studio. Next's
    // optimizer refuses any host it resolves to a private address, and on a NAT64 network
    // that is every host, which is the failure the Sanity loader was written around.
    // ponytail: no resizing, so a large upload is served at full size. Put a resizing proxy
    // in front of the bucket if image weight ever shows up in a page's load time.
    unoptimized: true,
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
