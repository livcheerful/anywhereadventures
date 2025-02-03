import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";
import dynamic from "next/dynamic";

export async function generateStaticParams() {
  const slugs = ["", "hello-world", "sinking-ship", "discover"];
  // Grab file
  const slugmap = slugs.map((s) => ({
    slug: [s],
  }));
  console.log(slugmap);
  return slugmap;
}

const slugsToObj = {
  "hello-world": dynamic(() => import("../content/hello-world.mdx")),
  "sinking-ship": dynamic(() => import("../content/sinking-ship.mdx")),
};

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
