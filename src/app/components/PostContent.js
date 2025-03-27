"use client";

import { MDXClient } from "next-mdx-remote-client/csr";
import { MyMDXComponents } from "../../../mdx-components";

export default function PostContent({ post }) {
  // console.log("-============================================================");
  // console.log(post);
  // console.log("-============================================================");
  return (
    <div className="w-full mdx-post-content overflow-x-hidden z-10">
      {post && <MDXClient {...post.content} components={MyMDXComponents} />}
    </div>
  );
}
