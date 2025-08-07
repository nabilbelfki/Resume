import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.nabilbelfki.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
