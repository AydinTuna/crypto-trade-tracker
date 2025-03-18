import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    G_TAG: process.env.G_TAG || '',
  },
};

export default nextConfig;
