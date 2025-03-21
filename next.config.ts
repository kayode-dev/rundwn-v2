import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        search: "",
        pathname: "/image/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
