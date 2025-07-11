/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL;

const nextConfig = {
  reactStrictMode: false, //true
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/post",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
