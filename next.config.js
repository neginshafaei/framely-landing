/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "playwright-core": "commonjs playwright-core",
    });

    return config;
  },
};

module.exports = nextConfig;