/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/workout',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 