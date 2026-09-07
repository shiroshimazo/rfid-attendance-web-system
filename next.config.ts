import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Forme's Node WASM loader beside its packaged .wasm file.
  serverExternalPackages: ["@formepdf/core", "@formepdf/react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {},

  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
