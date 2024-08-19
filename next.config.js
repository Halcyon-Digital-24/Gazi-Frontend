/** @type {import('next').NextConfig} */
const nextConfig = {
  /*  webpack(config) {
    config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  }, */
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gcart.com.bd",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      // {
      //   protocol: "http",
      //   hostname: "img.youtube.com",
      //   port: "",
      //   pathname: "/**",
      // },
    ],
    domains: ["img.youtube.com"],
  },
};

module.exports = nextConfig;
