import { Suspense } from "react";
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
  return (
    <div className="relative flex w-full overflow-hidden">
      <Suspense>
        <BasePage slug={postSlug ? postSlug[0] : ""}></BasePage>
      </Suspense>
    </div>
  );
}
