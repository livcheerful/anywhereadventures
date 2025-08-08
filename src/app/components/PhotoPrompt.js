import { getPage } from "../lib/storageHelpers";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function PhotoPrompt({ mdx, visited, fill }) {
  const [copiedAlert, setCopiedAlert] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCopiedAlert(false);
    }, 2000);
  }, [copiedAlert]);
  const page = getPage(mdx.slug);
  const visitedDate = new Date(page?.date);
  const genericPhotoPromptText = mdx.locationTitle
    ? `Visit ${mdx.locationTitle} in person and create a travel log of your visit. Explore your surroundings and take photos of what you notice.`
    : "Visit this location in person and create a travel log of your visit. Explore your surroundings and take photos of what you notice.";
  return (
    <div className="relative bg-amber-300 p-4 overflow-clip">
      {visited ? (
        <div>
          <img
            src="/seattle-general-2.svg"
            className="absolute w-36 top-0 -left-16 mix-blend-hard-light rotate-12 opacity-30"
          />
          <div className="z-10 ">
            <div className="text-gray-800 font-bold text-sm md:text-lg min-h-8 flex flex-col jusify-end">
              <div className="">{mdx.locationTitle || mdx.title}</div>
            </div>
            <hr className="border-gray-700"></hr>
            <div className="flex flex-row justify-between text-gray-900/50 text-xs font-mono">
              <div className=" text-black font-mono">VISITED</div>
              <div className="flex flex-row gap-2 md:flex-col items-end ">
                <div className="">{`${visitedDate.toLocaleDateString()}`}</div>
                <div className="">{`${visitedDate.toLocaleTimeString()}`}</div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center pt-2">
            <Link
              href={`/camera?locationId=${mdx.slug}`}
              className="underline text-gray-900/50 text-sm"
            >
              retake your photos
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {mdx.address && (
            <>
              <div className="flex flex-row w-full items-center justify-between  ">
                <div className="flex flex-col text-gray-800 ">
                  <div
                    className="pr-4 text-xs font-mono h-full "
                    style={{ alignSelf: "start" }}
                  >
                    Address:
                  </div>
                  <div className="flex-grow text-xs font-mono">
                    {mdx.address}
                  </div>
                </div>
                <button
                  className={`${
                    copiedAlert ? "bg-white" : "bg-yellow-300"
                  } transition-colors text-gray-800 px-4 py-1 rounded-lg border-2 border-slate-900 font-black`}
                  onClick={() => {
                    navigator.clipboard.writeText(mdx.address);
                    setCopiedAlert(true);
                  }}
                >
                  {copiedAlert ? "Copied!" : "Copy"}
                </button>
                <a
                  className="bg-yellow-300 text-black"
                  href="geo:124.028582,-29.201930"
                  target="_blank"
                >
                  Open in maps
                </a>
              </div>
              <hr className="my-2 border-amber-600 "></hr>
            </>
          )}
          <div className="font-bold text-sm text-black">
            {mdx.photoPrompt || genericPhotoPromptText}
          </div>
          <div className="flex flex-col items-center pt-2">
            <Link
              href={`/camera?locationId=${mdx.slug}`}
              className="border-gray-900 border-2 text-black bg-amber-100 px-4 py-2 font-black text-sm rounded-full"
            >
              I'M HERE
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
