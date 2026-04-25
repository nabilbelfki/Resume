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
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/static/images/:path*',
      },
      {
        source: '/videos/:path*',
        destination: '/api/static/videos/:path*',
      },
      {
        source: '/sounds/:path*',
        destination: '/api/static/sounds/:path*',
      }
    ];
  },
};

export default nextConfig;
