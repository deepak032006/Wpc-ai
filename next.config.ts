/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://37.27.113.235:6767/:path*",
      },
    ];
  },
};

module.exports = nextConfig;