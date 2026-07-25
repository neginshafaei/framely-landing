/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push(
      "playwright-core",
      "@sparticuz/chromium"
    );

    return config;
  },
};

module.exports = nextConfig;