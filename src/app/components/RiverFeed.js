"use client";
import { updateRoute } from "../lib/routeHelpers";
import { useEffect, useState } from "react";
import PostContent from "./PostContent";
import ContentHeader from "./ContentHeader";
import * as storageHelpers from "../lib/storageHelpers";

export default function RiverFeed({
  setCurrentSlug,
  myLocationSlugs,
  zoomToMainMap,
  setMyLocationSlugs,
  setPaneOpen,
}) {
  const [contentArray, setContentArray] = useState(undefined);
  async function getMdx(locations) {
    const ca = [];
    for (const l of locations) {
      const file = await fetch(`/content/generated/${l}.json`);
      const f = await file.json();
      ca.push(f);
    }
    setContentArray(ca);
  }
  useEffect(() => {
    const locSlugs = storageHelpers.getAllSlugs();
    getMdx(locSlugs);
  }, [myLocationSlugs]);
  return (
    <div>
      {contentArray?.map((c, i) => {
        return (
          <div key={i}>
            <ContentHeader
              post={c}
              currentSlug={""}
              zoomToMainMap={zoomToMainMap}
              k={i}
              isAdded={true}
              setMyLocationSlugs={setMyLocationSlugs}
              setPaneOpen={setPaneOpen}
            />
            <PostContent post={c} />
          </div>
        );
      })}
      <div
        className="p-2 bg-slate-100 cursor-pointer"
        onClick={() => {
          setCurrentSlug(updateRoute("/discover"));
        }}
      >
        Get more places
      </div>
    </div>
  );
}
