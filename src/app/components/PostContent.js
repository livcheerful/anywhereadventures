"use client";

import { MDXClient } from "next-mdx-remote-client/csr";
import { MyMDXComponents } from "../../../mdx-components";

export default function PostContent({ post }) {
  return (
    <div className="w-full mdx-post-content z-10 ">
      {post && <MDXClient {...post.content} components={MyMDXComponents} />}
    </div>
  );
}
