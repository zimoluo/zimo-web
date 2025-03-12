import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "zimo-web-bucket.s3.us-east-2.amazonaws.com",
      "lh3.googleusercontent.com",
      "uimg.ngfiles.com",
    ],
  },
  env: {
    version,
  },
};

export default nextConfig;
