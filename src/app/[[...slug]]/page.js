import { Suspense } from "react";
import { allSlugs } from "../lib/MdxQueries";
import BasePage from "../components/BasePage.js";

export async function generateStaticParams() {
  const slugs = allSlugs;
  slugs.push("", "journal");
  // Grab file
  const slugmap = slugs.map((s) => ({
    slug: [s],
  }));
  return slugmap;
}

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <div className="relative flex w-full overflow-hidden">
      <Suspense>
        <BasePage entranceSlug={slug}></BasePage>
      </Suspense>
    </div>
  );
}
