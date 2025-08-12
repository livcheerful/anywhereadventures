"use client";
import { getHomeLocation } from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";
import { useState, useEffect } from "react";
import Toast from "./Toast";
export default function TableOfContents({ setShowToc, setCopiedAlert }) {
  const homeLoc = getHomeLocation();
  const locData = savedLocationToObj(homeLoc);
  const allLocs = locData?.locs;
  function ListItem({ mdx, i }) {
    return (
      <div className="bg-gray-50  drop-shadow-lg flex flex-col pt-2 gap-2 w-full">
        <div className=" flex flex-row">
          <img
            src={mdx.cardImage}
            className="h-32 w-2/5 rounded-r-lg shrink-0"
          />
          <div className="flex flex-col px-2 w-full">
            <div className="font-bold text-lg">{mdx.locationTitle}</div>
            <hr className="w-full"></hr>
            <div className="text-xs text-gray-500 self-end">
              {mdx.neighborhood}
            </div>
            <div className="text-gray-700 font-mono text-sm text-pretty leading-4">
              {mdx.address}
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full overflow-x-auto gap-2 pb-4 px-2 text-nowrap text-sm  font-bold">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowToc(false);
              const page = document.querySelector(
                `#page-${Math.floor(i / 2) + 1}`
              );
              page.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-lime-300 text-black active:text-white rounded-2xl drop-shadow-sm px-4 py-2 "
          >
            See Log
          </button>
          <a
            href={`/${mdx.slug}`}
            className="bg-yellow-300 text-black active:text-white rounded-2xl drop-shadow-md px-4 py-2 flex flex-col items-center justify-center"
          >
            Read Story
          </a>
          <a
            href={`/${mdx.slug}`}
            className="border-yellow-300 active:bg-yellow-400 text-black bg-gray-50 border-2 rounded-2xl drop-shadow-sm px-4 py-2 "
          >
            Show on map
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(mdx.address);
              setCopiedAlert("Copied address to clipboard");
            }}
            className="border-yellow-300 active:bg-yellow-400 text-black bg-gray-50 border-2 rounded-2xl drop-shadow-sm px-4 py-2 "
          >
            Copy address
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/${mdx.slug}`
              );
              setCopiedAlert("Copied URL to clipboard");
            }}
            className="border-yellow-300 bg-gray-50 border-2 rounded-2xl drop-shadow-sm px-4 py-2"
          >
            Share
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full shrink-0 snap-start flex flex-col  text-black min-h-dvh bg-yellow-100 pb-12">
      <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
        <div className="font-bold text-xs text-gray-700 font-mono">
          Table of Contents
        </div>
      </div>
      <hr className="w-full border-slate-700 "></hr>
      <div className="flex flex-col gap-2">
        {allLocs?.map((locMdx, i) => {
          return (
            <div key={i}>
              <ListItem mdx={locMdx} i={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
