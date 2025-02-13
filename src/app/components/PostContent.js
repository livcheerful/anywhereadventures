"use client";

import { MDXClient } from "next-mdx-remote-client/csr";
import { MyMDXComponents } from "../../../mdx-components";

export default function PostContent({ post }) {
  // console.log("-============================================================");
  // console.log(post);
  // console.log("-============================================================");
  return <MDXClient {...post.content} components={MyMDXComponents} />;
}
