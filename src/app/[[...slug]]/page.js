import { Suspense } from "react";
import { allLocs } from "../lib/MdxQueries";
import { locationData } from "../lib/locationHelpers";
import BasePage from "../components/BasePage.js";

export async function generateStaticParams() {
  const slugs = [{ slug: [""] }, { slug: ["journal"] }, { slug: ["camera"] }];
  allLocs.forEach((l, i) => {
    slugs.push({ slug: [l.location[0].toLowerCase(), l.slug] });
  });

  Object.keys(locationData).forEach((l) => {
    slugs.push({ slug: [l] });
  });

  return slugs;
}

export default async function Page({ params }) {
  const { slug } = await params;
  let entranceSlug = slug ? slug[slug.length - 1] : "";
  if (slug && slug.length == 1) entranceSlug == slug[0];
  return (
    <div className="relative flex w-full overflow-hidden">
      <Suspense>
        <BasePage entranceSlug={entranceSlug}></BasePage>
      </Suspense>
    </div>
  );
}
