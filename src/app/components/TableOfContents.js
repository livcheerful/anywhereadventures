"use client";
import { useState, useEffect } from "react";
import { getHomeLocation, hasLocationBeenVisited } from "../lib/storageHelpers";
import { savedLocationToObj } from "../lib/locationHelpers";

import { useNotifications } from "../lib/NotificationsContext";

export default function TableOfContents({
  setShowToc,
  setCopiedAlert,
  newEntries,
}) {
  const [homeLoc, setHomeLoc] = useState(undefined);
  const [locData, setLocData] = useState(undefined);
  const { removeNotification } = useNotifications();

  useEffect(() => {
    const l = getHomeLocation();
    setHomeLoc(l);
    setLocData(savedLocationToObj(l));
  }, []);

  const allLocs = locData?.locs || [];

  function isLocationNew(slug) {
    return newEntries?.some((entry) => entry.id === slug) || false;
  }

  function ListItem({ mdx, i }) {
    const isNewEntry = isLocationNew(mdx.slug);

    return (
      <div className="bg-gray-50 drop-shadow-lg flex flex-col pt-2 gap-2 w-full relative">
        <div className="flex flex-row">
          <div className="h-32 w-2/5 shrink-0 drop-shadow-sm relative">
            <img
              src={mdx.cardImage}
              className="h-full w-full object-cover rounded-r-lg"
            />
            <div className="absolute left-1 -top-1 text-2xl">
              {hasLocationBeenVisited(mdx.slug) ? "✅" : "🔲"}
            </div>
          </div>
          <div className="flex flex-col px-2 w-full">
            <div className="font-bold text-lg">{mdx.locationTitle}</div>
            <hr className="w-full" />
            <div className="text-xs text-gray-500 self-end">
              {mdx.neighborhood}
            </div>
            <div className="text-gray-700 font-mono text-sm text-pretty leading-4">
              {mdx.address}
            </div>
          </div>
        </div>

        <div className="flex flex-row w-full overflow-x-auto gap-2 pb-4 px-2 text-nowrap text-sm font-bold relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowToc(false);
              removeNotification(mdx.slug);
              const page = document.querySelector(
                `#page-${Math.floor(i / 2) + 1}`
              );
              page?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-lime-300 text-black active:bg-lime-400 rounded-2xl drop-shadow-sm px-4 py-2 relative"
          >
            See Log
            {isNewEntry && (
              <div className="bg-red-500 w-2 h-2 absolute right-0 top-1 rounded-full" />
            )}
          </button>

          <a
            href={`/${mdx.location[0].toLowerCase()}/${mdx.slug}`}
            className="bg-yellow-300 active:bg-yellow-400 text-black rounded-2xl drop-shadow-sm px-4 py-2 flex flex-col justify-center"
          >
            Show on map
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(mdx.address);
              setCopiedAlert("Copied address to clipboard");
            }}
            className="border-yellow-300 active:bg-yellow-400 text-black bg-gray-50 border-2 rounded-2xl drop-shadow-sm px-4 py-2"
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
    <div className="w-full shrink-0 snap-start flex flex-col text-black min-h-dvh bg-yellow-100 pb-12">
      <div className="w-full flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
        <div className="font-bold text-xs text-gray-700 font-mono">
          Table of Contents
        </div>
      </div>
      <hr className="w-full border-slate-700" />

      <div className="flex flex-col gap-2">
        {allLocs.map((locMdx, i) => (
          <ListItem key={i} mdx={locMdx} i={i} />
        ))}
      </div>
    </div>
  );
}
