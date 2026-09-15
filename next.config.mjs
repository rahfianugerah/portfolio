/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Every image is a Sanity asset, resized by Sanity's CDN rather than Next's optimizer.
    // The loader says why.
    loader: "custom",
    loaderFile: "./src/lib/sanity-image-loader.ts",
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
