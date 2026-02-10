import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint checks during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
