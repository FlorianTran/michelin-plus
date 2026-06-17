import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // B&W cycling imagery is pulled from Unsplash in a few showcase tiles.
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  output: 'standalone',
};

export default nextConfig;
