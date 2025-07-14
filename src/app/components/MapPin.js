import { getPage, hasLocationBeenVisited } from "../lib/storageHelpers";
import { useState, useEffect } from "react";
import PinCamera from "./PinCamera";
import PinJournal from "./PinJournal";
import PhotoPrompt from "./PhotoPrompt";

export default function MapPin({ mdx, setPaneOpen, onCloseCB }) {
  const [copiedAlert, setCopiedAlert] = useState(false);
  const visited = hasLocationBeenVisited(mdx.slug);
  useEffect(() => {
    setTimeout(() => {
      setCopiedAlert(false);
    }, 2000);
  }, [copiedAlert]);
  return (
    <div className="absolute w-full flex flex-col items-center justify-start left-0 top-4 md:top-32 h-full  ">
      <div
        className="h-48 top-6 relative w-full"
        style={{
          backgroundImage: `url(${mdx.cardImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      ></div>
      <PinJournal page={getPage(mdx.slug)} />
      <PinCamera mdx={mdx} />
      <div className="absolute flex flex-col w-11/12 md:w-4/5 p-4 bg-white drop-shadow-2xl border-2 border-gray-900 ">
        <button
          onClick={() => {
            onCloseCB();
          }}
          className="w-6 h-6 flex items-center justify-center bg-white border-gray-900 border-2 absolute -right-3 -top-3 rounded-full"
        >
          <div className="font-bold">x</div>
        </button>
        <button
          onClick={(e) => {
            const article = document.querySelector(`#${mdx.slug}`);
            if (article) {
              article.scrollIntoView({ behavior: "smooth" });
              setPaneOpen(true);
            }
          }}
        >
          <div className="text-md md:text-xl font-bold">{mdx.title}</div>
        </button>
        <div className="flex flex-row justify-between text-gray-500 font-mono text-xs pt-3">
          {mdx.neighborhood && <div>{mdx.neighborhood}</div>}
          <div className="text-gray-500 font-mono text-xs w-fit">{`${mdx.latlon[0].toFixed(
            4
          )}, ${mdx.latlon[1].toFixed(4)}`}</div>
        </div>
        <hr className="pt-1" />
        {mdx.address && (
          <div className="flex flex-row w-full items-center justify-between">
            <div className="flex flex-col">
              <div
                className="text-gray-500 pr-4 text-xs font-mono h-full "
                style={{ alignSelf: "start" }}
              >
                Address:
              </div>
              <div className="text-gray-700 flex-grow text-xs font-mono">
                {mdx.address}
              </div>
            </div>
            <button
              className={`${
                copiedAlert ? "bg-white" : "bg-green-500"
              } transition-colors px-4 py-1 rounded-lg border-2 border-slate-900 font-black`}
              onClick={() => {
                navigator.clipboard.writeText(mdx.address);
                setCopiedAlert(true);
              }}
            >
              {copiedAlert ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        {mdx.blurb && (
          <div className="pt-2 text-gray-600 text-sm">{mdx.blurb}</div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const article = document.querySelector(`#${mdx.slug}`);
            if (article) {
              article.scrollIntoView({ behavior: "smooth" });
              setPaneOpen(true);
            }
          }}
          className="underline text-sm text-gray-600"
        >
          Read the story
        </button>
        <PhotoPrompt mdx={mdx} visited={visited} />
      </div>
    </div>
  );
}
