/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";

const nextConfig = {
  output: "export",
  distDir: "out",
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: false,
};

const withMDX = createMDX({});
export default withMDX(nextConfig);
