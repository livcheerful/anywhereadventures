"use client";
import { MDXRemote } from "next-mdx-remote";
import { MyMDXComponents } from "../../../mdx-components";

export default function PostContent({ post }) {
  console.log("POST!!!!!!!!!!!!!!!!!!!!!!!!!:=============================");
  console.log(post.content);
  return (
    <div>
      {post ? (
        <MDXRemote {...post.content} components={MyMDXComponents} />
      ) : (
        <div>This is where the content will go</div>
      )}
    </div>
  );
}
