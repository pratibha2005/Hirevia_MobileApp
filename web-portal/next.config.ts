import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
// 	eslint: {
// 		ignoreDuringBuilds: true,
// 	},
// 	typescript: {
// 		ignoreBuildErrors: true,
// 	},
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

export default nextConfig;
