import { fetchPostBySlug } from "../lib/tinaHelpers";
import Navbar from "../components/Navbar";
import MainMap from "../components/Map";
import ContentPane from "../components/ContentPane";

export default async function Page({ params }) {
  const slug = (await params).slug;
  let post;
  if (slug && slug != "discover") {
    const p = await fetchPostBySlug(slug[0], "uh..");
    post = p[0].node;
  }

  return (
    <div className="relative flex w-full overflow-hidden ">
      <Navbar />
      <MainMap />
      <ContentPane post={post} slug={slug} />
    </div>
  );
}
