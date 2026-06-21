import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uqcowhczyfhtclzigtax.supabase.co' },
      { protocol: 'https', hostname: 'i.imgur.com' },
    ],
  },
  experimental: {
    // Product images are base64-encoded and sent through a Server Action
    // (see app/products-actions.ts). Default Server Action body limit is 1MB,
    // which a single uploaded image alone can exceed, so raise it to comfortably
    // fit a main image plus several additional/detail images per product.
    serverActions: {
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
