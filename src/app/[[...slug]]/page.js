import { Suspense } from "react";
import Navbar from "../components/Navbar";
import { allSlugs } from "../lib/MdxQueries";
import { getAllPosts, getPostBySlug } from "../lib/postHelper";
import { serialize } from "next-mdx-remote-client/serialize";
import BasePage from "../components/BasePage.js";

export async function generateStaticParams() {
  const slugs = allSlugs;
  slugs.push("", "discover");
  // Grab file
  const slugmap = slugs.map((s) => ({
    slug: [s],
  }));
  return slugmap;
}

export default async function Page({ params }) {
  const { slug } = await params;
  let postSlug;
  let post;
  let serializedContent;

  if (slug && slug != "discover") {
    postSlug = slug;
    post = getPostBySlug(postSlug[0]);
    serializedContent = await serialize({ source: post.content });
    post = { ...post, content: serializedContent };
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <BasePage slug={postSlug} post={post}></BasePage>
    </div>
  );
}
