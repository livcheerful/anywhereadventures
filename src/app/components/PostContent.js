"use client";

import { MDXRemote } from "next-mdx-remote-client/rsc";
import { MyMDXComponents } from "../../../mdx-components";

export default function PostContent({ post }) {
  console.log("-============================================================");
  console.log(post);
  console.log("-============================================================");
  return (
    <div>
      {post ? (
        <MDXRemote source={post.content} components={MyMDXComponents} />
      ) : (
        <div>This is where the content will go</div>
      )}
    </div>
  );
}
