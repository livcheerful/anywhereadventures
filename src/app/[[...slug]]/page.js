import { Suspense } from "react";
import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";
import { allSlugs } from "../lib/MdxQueries";
import { getAllPosts, getPostBySlug } from "../lib/postHelper";
import { serialize } from "next-mdx-remote/serialize";

export async function generateStaticParams() {
  const slugs = allSlugs;
  slugs.push("", "discover");
  // Grab file
  const slugmap = slugs.map((s) => ({
    slug: [s],
  }));
  console.log(slugmap);
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
    console.log(
      "This is the post content before serialization:=================="
    );
    console.log(post.content);
    serializedContent = await serialize(post.content);
    post = { ...post, content: serializedContent };
    console.log(
      "and this is what it looks like after serialization=================="
    );
    console.log(post.content);
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <MainMap />
      <ContentPane slug={slug} post={post} />
    </div>
  );
}
