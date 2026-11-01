import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browser calls /api/... on the frontend's own origin; Next forwards to Express.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.BACKEND_URL ?? "http://localhost:4000"}/api/:path*` }];
  },
};
export default nextConfig;
