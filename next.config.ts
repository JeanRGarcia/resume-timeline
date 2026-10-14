import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB; Vercel Functions cap request bodies at ~4.5MB.
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
