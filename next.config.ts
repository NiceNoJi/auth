import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'login.tnc.local',
    'home.tnc.local',
    'localhost',
  ],
};

export default nextConfig;
