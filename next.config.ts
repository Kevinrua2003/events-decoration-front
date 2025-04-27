import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    BACKEND: 'http://localhost:5000',
  }
};

export default nextConfig;
