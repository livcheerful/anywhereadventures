import { Suspense } from "react";
import { allLocs } from "../lib/MdxQueries";
import BasePage from "../components/BasePage.js";

export async function generateStaticParams() {
  const locs = allLocs;
  const slugs = [{ slug: [""] }, { slug: ["journal"] }, { slug: ["camera"] }];
  locs.forEach((l, i) => {
    slugs.push({ slug: [l.location[0].toLowerCase(), l.slug] });
  });
  return slugs;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const entranceSlug = slug ? slug[slug.length - 1] : "";
  return (
    <div className="relative flex w-full overflow-hidden">
      <Suspense>
        <BasePage entranceSlug={entranceSlug}></BasePage>
      </Suspense>
    </div>
  );
}
