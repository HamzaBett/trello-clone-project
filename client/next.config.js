/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    return config;
  },
};

module.exports = nextConfig;
