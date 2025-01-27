"use client";

import Comic from "./tina/Comic";

import { TinaMarkdown } from "tinacms/dist/rich-text";

const components = {
  Comic: Comic,
  h1: (props) => {
    console.log("in h1");
    console.log(props);
    return <h1>prop</h1>;
  },
};

export default function PostContent({ post }) {
  console.log(post);
  return (
    <div className="">
      {/* Can override padding with !important if necessary... */}
      <TinaMarkdown content={post.body} components={components} />
    </div>
  );
}
