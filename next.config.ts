import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Increase max duration for video uploads
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiTimeout: 600, // 10 minutes
  },
  // Also set for API routes
  api: {
    responseLimit: '500mb', // Allow larger responses for video metadata
    bodyParser: {
      sizeLimit: '500mb', // Allow 500MB file uploads
    },
  },
};

export default nextConfig;