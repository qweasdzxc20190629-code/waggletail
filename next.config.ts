import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Product images are base64-encoded and sent through a Server Action
    // (see app/products-actions.ts). Default Server Action body limit is 1MB,
    // which a single uploaded image alone can exceed, so raise it to comfortably
    // fit a main image plus several additional/detail images per product.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
