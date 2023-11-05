/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "zimo-web-bucket.s3.us-east-2.amazonaws.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
