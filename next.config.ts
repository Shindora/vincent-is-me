import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/analytics", destination: "/visitors", permanent: true },
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/publications", destination: "/#publications", permanent: true },
    ];
  },
};

export default nextConfig;
