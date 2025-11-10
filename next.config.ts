import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.fptshop.com.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'caodangvietmyhanoi.edu.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@sendgrid/mail');
      } else if (typeof config.externals === 'object') {
        config.externals['@sendgrid/mail'] = 'commonjs @sendgrid/mail';
      }
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback['@sendgrid/mail'] = false;
    }
    return config;
  },
};

export default nextConfig;