import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import createMDX from "@next/mdx";
export default (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
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
    assetPrefix: isDev
      ? undefined
      : "https://livcheerful.github.io/anywhereadventures/",
    basePath: isDev ? undefined : "/anywhereadventures",
  };

  const withMDX = createMDX({});
  return withMDX(nextConfig);
};
