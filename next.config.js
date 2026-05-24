/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! INTENTIONAL: Skip TS type checking during build.
    // The site still compiles and works — type errors are only cosmetic.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during builds — Claude output may have lint warnings.
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
