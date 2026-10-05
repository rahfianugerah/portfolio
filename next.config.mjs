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

  async rewrites() {
    // The backend is FastAPI, on the backend-main and backend-dev branches and deployed as a
    // project of its own. The browser never talks to it directly: it asks this origin, and
    // the request is passed on, which keeps the studio's cookie first-party and needs no CORS.
    const backend =
      process.env.BACKEND_URL?.replace(/\/+$/, "") ??
      (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : null);

    // Without an address there is nowhere to send /api, and a build should say so rather
    // than ship a rewrite to nothing.
    if (!backend) {
      console.warn("BACKEND_URL is not set: /api is not forwarded, so the studio, chat and contact form will not work.");
      return [];
    }

    // A route handler under src/app/api is a file, so it is matched before this and keeps
    // answering.
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
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
