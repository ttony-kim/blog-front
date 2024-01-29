/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //true
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:8084/api/:path*`,
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
