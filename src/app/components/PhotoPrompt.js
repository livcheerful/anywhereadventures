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

  const ua = navigator.userAgent.toLowerCase();
  const isDesktop = !/iphone|ipad|ipod/.test(ua) && !/android/.test(ua);
  const genericPhotoPromptText = mdx.locationTitle
    ? `Visit ${mdx.locationTitle} in person and create a travel log of your visit. Explore your surroundings and take photos of what you notice.`
    : "Visit this location in person and create a travel log entry of your visit. Explore your surroundings and take photos of what you notice.";
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
                <div className="flex flex-row items-end gap-2">
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
                  {!isDesktop && (
                    <button
                      className="underline font-bold font-sm text-black"
                      onClick={() => {
                        if (/iphone|ipad|ipod/.test(ua)) {
                          window.location.href = `maps://?q=${mdx.latlon[0]},${mdx.latlon[1]}`; // Apple Maps
                        } else if (/android/.test(ua)) {
                          window.location.href = `geo:${mdx.latlon[0]},${mdx.latlon[1]}`; // Google Maps
                        } else {
                          window.open(
                            `https://maps.google.com/?q=${mdx.latlon[0]},${mdx.latlon[1]}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        className="w-5 h-5 fill-gray-800"
                      >
                        <path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className={`${
                      copiedAlert
                        ? "bg-white"
                        : "bg-yellow-300 active:bg-yellow-400"
                    } transition-colors text-gray-800 px-4 py-1 rounded-lg border-2 border-slate-900 font-black`}
                    onClick={() => {
                      navigator.clipboard.writeText(mdx.address);
                      setCopiedAlert(true);
                    }}
                  >
                    {copiedAlert ? "Copied!" : "Copy"}
                  </button>
                </div>
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
              className="border-gray-900 border-2 text-black bg-amber-100 active:bg-amber-200 px-4 py-2 font-black text-sm rounded-full"
            >
              I'M HERE
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
