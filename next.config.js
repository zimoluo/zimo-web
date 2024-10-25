/** @type {import('next').NextConfig} */

const { version } = require("./package.json");

const nextConfig = {
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

module.exports = nextConfig;
