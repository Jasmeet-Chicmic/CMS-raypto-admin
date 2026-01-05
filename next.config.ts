import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: [
      "192.180.3.86",
      "via.placeholder.com",
      "admin-boilerplate-lqny.onrender.com",
      "picsum.photos",
      "flagcdn.com",
      "dummyimage.com",
      "e314f619d45a.ngrok-free.app",
      "images.unsplash.com",
      "raypto.onrender.com",
      "flagcdn.com",
      "raypto-prod.onrender.com",
    ],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
