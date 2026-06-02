import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ohzsklmyjrcnxnfuvwkb.supabase.co",
      },
    ],
  },
};

export default nextConfig;