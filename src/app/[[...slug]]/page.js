import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";
import Test from "../content/test.mdx";

export async function generateStaticParams() {
  const slugs = ["hello-world", "sinking-ship", "", "discover"];
  const slugmap = slugs.map((s) => ({
    slug: [s],
  }));
  console.log(slugmap);
  return slugmap;
}

export default async function Page({ params }) {
  const { slug } = await params;
  let post;
  if (slug && slug != "discover") {
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <MainMap />
      <ContentPane slug={slug} post={Test()} />
    </div>
  );
}
