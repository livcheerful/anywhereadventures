"use client";

import { useEffect, useState } from "react";

import { updateRoute } from "../lib/routeHelpers";
import PostContent from "./PostContent";
import StickyHeader from "./StickyHeader";
import PhotoPrompt from "./PhotoPrompt";
import UnstickyHeader from "./UnstickyHeader";
import { hasLocationBeenVisited } from "../lib/storageHelpers";

import * as storageHelpers from "../lib/storageHelpers";

function Button(label, enabled, action) {
  const classList = [
    "border-2",
    "px-4",
    "py-2",
    "font-black",
    "text-xs",
    "rounded-full",
    "w-48",
    "text-center",
  ];

  if (!enabled) {
    classList.push(...["bg-gray-100/70", "text-gray-400", "border-gray-300"]);
  } else {
    classList.push(
      ...["bg-amber-300", "text-gray-800", "border-gray-900", "drop-shadow-sm"]
    );
  }

  return (
    <button
      className={classList.join(" ")}
      onClick={enabled ? action : undefined}
    >
      {label}
    </button>
  );
}

export default function SingleStoryPage({
  contentArray,
  paneOpen,
  setPaneOpen,
  scrollRef,
  contentIndex,
  setContentIndex,
  setViewingPin,
  mainMap,
}) {
  if (!contentArray) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-32">
          <div>
            <img src="/mapAnim.png" />
          </div>
          <div className="font-black text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const post = contentArray[contentIndex];
  const slug = post.slug;

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
        post={post}
        contentSlug={slug}
        isAdded={true}
        scrollRef={scrollRef}
        paneOpen={paneOpen}
        setPaneOpen={setPaneOpen}
        mainMap={mainMap}
      />
      <div className="flex justify-between gap-1 py-4 bg-white px-2">
        {Button("PREVIOUS STORY", hasPrevious, goToPrevious)}
        {Button("NEXT STORY", hasNext, goToNext)}
      </div>
      <UnstickyHeader post={post} />
      <PostContent post={post} />
      <div className="w-full p-4 relative">
        {!hasLocationBeenVisited(slug) && (
          <div className="absolute -top-3 left-0 flex flex-row z-20">
            <div className="h-fit absolute top-2 left-0 pr-5 pl-12 text-green-800 font-bold  bg-green-100 text-lg">
              VISIT
            </div>
            <div className="font-bold z-10 w-10 h-10 flex flex-col items-center justify-center text-lg bg-lime-200 rounded-full border-2 border-gray-800 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                className="fill-sky-700 w-7 h-7 "
              >
                <path d="M320 32C327 32 333.7 35.1 338.3 40.5L474.3 200.5C480.4 207.6 481.7 217.6 477.8 226.1C473.9 234.6 465.4 240 456 240L431.1 240L506.3 328.5C512.4 335.6 513.7 345.6 509.8 354.1C505.9 362.6 497.4 368 488 368L449.5 368L538.3 472.5C544.4 479.6 545.7 489.6 541.8 498.1C537.9 506.6 529.4 512 520 512L352 512L352 576C352 593.7 337.7 608 320 608C302.3 608 288 593.7 288 576L288 512L120 512C110.6 512 102.1 506.6 98.2 498.1C94.3 489.6 95.6 479.6 101.7 472.5L190.5 368L152 368C142.6 368 134.1 362.6 130.2 354.1C126.3 345.6 127.6 335.6 133.7 328.5L208.9 240L184 240C174.6 240 166.1 234.6 162.2 226.1C158.3 217.6 159.6 207.6 165.7 200.5L301.7 40.5C306.3 35.1 313 32 320 32z" />
              </svg>
            </div>
          </div>
        )}
        <div className="border-2 border-gray-900 ">
          <PhotoPrompt
            mdx={post}
            visited={storageHelpers.hasLocationBeenVisited(slug)}
          />
        </div>
      </div>

      <hr className="border-amber-500"></hr>
      <div className="flex justify-between gap-1 py-4 bg-amber-100">
        {Button("PREVIOUS STORY", hasPrevious, goToPrevious)}
        {Button("NEXT STORY", hasNext, goToNext)}
      </div>
    </div>
  );
}
