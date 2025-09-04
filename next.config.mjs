import path from "path";
import headers from "./headers.js"; // Use .js extension explicitly in ESM

const nextConfig = {
  images: {
    domains: ["localhost"], 
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*", // Keep colon syntax
        destination: "/uploads/:path*", // Safe
      },
    ];
  },
};

export default nextConfig;
