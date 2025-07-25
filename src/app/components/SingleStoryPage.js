"use client";

import { useEffect, useState } from "react";

import { updateRoute } from "../lib/routeHelpers";
import PostContent from "./PostContent";
import StickyHeader from "./StickyHeader";
import PhotoPrompt from "./PhotoPrompt";
import UnstickyHeader from "./UnstickyHeader";
import { savedLocationToObj } from "../lib/locationHelpers";
import { getMdx } from "../lib/clientPostHelper";

import * as storageHelpers from "../lib/storageHelpers";

function Button(label, enabled, action) {
  const classList = [
    "border-2",
    "px-4",
    "py-2",
    "font-black",
    "text-sm",
    "rounded-full",
    "w-48",
    "text-center",
    "cursor-pointer",
  ];

  if (!enabled) {
    classList.push(...["bg-gray-100/70", "text-gray-400", "border-gray-300"]);
  } else {
    classList.push(...["bg-amber-300", "text-gray-800", "border-gray-900"]);
  }

  return (
    <div className={classList.join(" ")} onClick={enabled ? action : undefined}>
      {label}
    </div>
  );
}

export default function SingleStoryPage({
  entranceSlug,
  currentSlug,
  setCurrentSlug,
  myLocationSlugs,
  focusOnPin,
  paneOpen,
  setPaneOpen,
  scrollRef,
  contentPaneRef,
}) {
  const [contentArray, setContentArray] = useState(undefined);
  const [contentIndex, setContentIndex] = useState(0);

  // Load up the content based on stored home location
  useEffect(() => {
    const homeLoc = storageHelpers.getHomeLocation();
    const homeLocationData = savedLocationToObj(homeLoc);
    if (!homeLocationData) return;
    const locSlugs = homeLocationData.locs.map((l) => {
      return l.slug;
    });
    getMdx(locSlugs, (res) => {
      setContentArray(res);

      // Find the content corresponding to the entrance slug, otherwise use the first one
      let index = res.findIndex((content) => content.slug == entranceSlug);
      if (index < 0) {
        index = 0;
      }

      setContentIndex(index);
    });
  }, [myLocationSlugs]);

  useEffect(() => {
    // find index of slug
    if (!contentArray) return;
    const index = contentArray.findIndex(
      (content) => content.slug == currentSlug
    );
    setContentIndex(index);
  }, [currentSlug, contentArray]);

  // Update route and return to the top when going to previous or next.
  useEffect(() => {
    if (!contentArray) {
      return;
    }

    const newSlug = contentArray[contentIndex].slug;
    updateRoute(`/${newSlug}`);
    setCurrentSlug(newSlug);

    // Update slug
    contentPaneRef.current?.scroll({ top: 0, behavior: "smooth" });
  }, [contentArray, contentIndex]);

  useEffect(() => {
    if (!contentArray) return;
    if (!entranceSlug) {
      setContentIndex(0);
      setCurrentSlug(contentArray[0].slug);
    }
  }, [entranceSlug, contentArray]);

  if (!contentArray) {
    return "Loading...";
  }

  const contentDesc = contentArray[contentIndex];
  const slug = contentDesc.slug;

  const hasPrevious = contentIndex > 0;
  const hasNext = contentIndex < contentArray.length - 1;

  function goToPrevious() {
    hasPrevious && setContentIndex(contentIndex - 1);
  }
  function goToNext() {
    hasNext && setContentIndex(contentIndex + 1);
  }

  return (
    <div key={contentIndex} className="article" id={slug} articleslug={slug}>
      <StickyHeader
        post={contentDesc}
        contentSlug={slug}
        focusOnPin={focusOnPin}
        isAdded={true}
        scrollRef={scrollRef}
        paneOpen={paneOpen}
        setPaneOpen={setPaneOpen}
      />
      <UnstickyHeader post={contentDesc} />
      <PostContent post={contentDesc} />
      <div className="w-full p-4">
        <PhotoPrompt
          mdx={contentDesc}
          visited={storageHelpers.hasLocationBeenVisited(slug)}
        />
      </div>

      <hr className="border-amber-500"></hr>
      <div className="flex justify-between py-4 bg-amber-100">
        {Button("PREVIOUS STORY", hasPrevious, goToPrevious)}
        {Button("NEXT STORY", hasNext, goToNext)}
      </div>
    </div>
  );
}
