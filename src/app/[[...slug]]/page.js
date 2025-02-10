import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";
import { allSlugs } from "../lib/MdxQueries";
import { slugsToObj } from "../lib/DynamicImports";

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
  if (slug && slug != "discover") {
    postSlug = slug;
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <MainMap />
      <ContentPane
        slug={slug}
        post={postSlug ? slugsToObj[postSlug]() : undefined}
      />
    </div>
  );
}
