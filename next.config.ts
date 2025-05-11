import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      // Adicione também o novo formato de URL do Firebase Storage
      {
        protocol: 'https',
        hostname: '*.firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
