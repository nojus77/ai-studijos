import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old route → new route. permanent: true emits a 308 so SEO and any
      // external links shared while /bootcamp was the canonical URL still
      // land on the right page. Preserve the hash (e.g. #kaina) too.
      {
        source: "/bootcamp",
        destination: "/dirbtuves",
        permanent: true,
      },
      {
        source: "/bootcamp/:path*",
        destination: "/dirbtuves/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
