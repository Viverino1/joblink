import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows the use of `any` type.
    // Consider using more specific types instead of `any` for better type safety.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
