import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Let release checks run alongside a preview without sharing generated files.
  distDir: process.env.BLOCKCHAIN_BUILD_DIR || ".next",
};

export default nextConfig;
