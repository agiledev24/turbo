/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "90mb",
    },
  },
};

module.exports = nextConfig;
