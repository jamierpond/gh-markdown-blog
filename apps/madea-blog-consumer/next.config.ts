import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['madea-blog-core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
