import type { NextConfig } from "next";

const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: configuredBasePath ? `/${configuredBasePath}` : "",
  trailingSlash: true,
  turbopack: { root: __dirname },
};

export default nextConfig;
