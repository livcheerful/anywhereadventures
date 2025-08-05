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
    <div className="absolute w-full flex flex-col items-center justify-start z-10 left-0 top-4 h-lg:top-32 h-full overflow-visible">
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
      {visited ? (
        <PinJournal page={getPage(mdx.slug)} slug={mdx.slug} />
      ) : (
        <PinCamera mdx={mdx} />
      )}
      <div
        className="absolute flex flex-col w-11/12 md:w-4/5 h-fit  bg-white drop-shadow-2xl border-2 border-gray-900  overflow-visible"
        style={{ maxHeight: "66%" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <button
          onClick={() => {
            onCloseCB();
          }}
          className="absolute w-8 h-8 p-1 flex items-center justify-center bg-white border-gray-900 border-2  -right-3 -top-3 rounded-full z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
          </svg>
        </button>
        <div className=" overflow-y-auto overflow-x-visible">
          <button
            onClick={(e) => {
              const article = document.querySelector(`#${mdx.slug}`);
              if (article) {
                article.scrollIntoView({ behavior: "smooth" });
                setPaneOpen(true);
              }
            }}
          >
            <div className="text-md md:text-xl font-bold text-black px-2 pt-1 ">
              {mdx.title}
            </div>
          </button>

          <div className="flex flex-row justify-between text-gray-500 font-mono text-xs pt-3 px-2 ">
            {mdx.neighborhood && <div>{mdx.neighborhood}</div>}
            <div className="text-gray-500 font-mono text-xs w-fit">{`${mdx.latlon[0].toFixed(
              4
            )}, ${mdx.latlon[1].toFixed(4)}`}</div>
          </div>
          <hr className="pt-1" />
          {mdx.address && (
            <div className="flex flex-row w-full items-center justify-between px-2 ">
              <div className="flex flex-col">
                <div
                  className="text-gray-500 pr-4 text-xs font-mono h-full "
                  style={{ alignSelf: "start" }}
                >
                  Address:
                </div>
                <div className="text-gray-600 flex-grow text-xs font-mono">
                  {mdx.address}
                </div>
              </div>
              <button
                className={`${
                  copiedAlert ? "bg-white" : "bg-yellow-300"
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

          <div className="flex flex-col items-stretch relative pt-2 overflow-visible">
            <div className="relative bg-sky-300 border-2 border-gray-900 p-2 pb-2 border-x-0 w-full h-full flex flex-col justify-between items-center overflow-visible">
              <div className="bg-lime-200 rounded-full absolute w-8 h-8 -top-3 left-3 border-2 border-gray-800">
                <div className="font-bold text-center text-lg">1</div>
              </div>
              <div className="text-xs w-full text-center text-sky-600 font-black">
                READ
              </div>
              <div className="font-bold text-sm text-black">
                {mdx.blurb ? (
                  <div className="p-2 text-sm">{mdx.blurb}</div>
                ) : (
                  <div>Learn more about the history of this location.</div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPaneOpen(true);
                }}
                className="w-fit items-center border-gray-900 border-2 text-black bg-sky-100 px-4 py-2 font-black text-sm rounded-full"
              >
                OPEN
              </button>
            </div>
            <div className="w-full h-full relative">
              <PhotoPrompt mdx={mdx} visited={visited} />
              <div className=" bg-lime-200 rounded-full absolute w-8 h-8 -top-3 left-3 border-2 border-gray-800 ">
                <div className="font-bold text-center text-lg">2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
