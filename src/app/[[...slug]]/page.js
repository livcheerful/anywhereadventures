import { Suspense } from "react";
import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";
import { allSlugs } from "../lib/MdxQueries";
import { getAllPosts, getPostBySlug } from "../lib/postHelper";
import { serialize } from "next-mdx-remote-client/serialize";

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
    serializedContent = await serialize({ source: post.content });
    post = { ...post, content: serializedContent };
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <MainMap />
      {/* <ContentPane /> */}
      {/* <MDXProvider components={MyMDXComponents}></MDXProvider> */}
      <ContentPane slug={slug} post={post} />
    </div>
  );
}
