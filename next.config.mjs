import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import createMDX from "@next/mdx";
export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd = process.env.VERCEL_ENV === "production";
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    output: "export",
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
    distDir: "out",
    // Configure `pageExtensions` to include markdown and MDX files
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    reactStrictMode: false,
    assetPrefix: isProd ? "https://anywhereadventures.vercel.app/" : "",
    productionBrowserSourceMaps: false,
    // basePath: isDev ? undefined : "/anywhereadventures",
  };

  const withMDX = createMDX({});
  return withMDX(nextConfig);
};
