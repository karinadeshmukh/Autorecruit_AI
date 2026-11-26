import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose", "bcryptjs"],
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
};

export default nextConfig;
