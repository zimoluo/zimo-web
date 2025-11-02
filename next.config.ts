import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zimo-web-bucket.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uimg.ngfiles.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: true, // turning this on for now since limit reached
  },
  env: {
    version,
  },
};

export default nextConfig;
