import { getPage } from "../lib/storageHelpers";
export default function PhotoPrompt({ mdx, visited }) {
  const page = getPage(mdx.slug);
  const visitedDate = new Date(page?.date);
  const genericPhotoPromptText = mdx.locationTitle
    ? `Visit ${mdx.locationTitle} in person and create a travel log of your visit. Explore your surroundings and take photos of what you notice.`
    : "Visit this location in person and create a travel log of your visit. Explore your surroundings and take photos of what you notice.";
  return (
    <div className="relative bg-amber-300 border-2 border-gray-900 p-2 overflow-clip border-r-0 w-2/3">
      {visited ? (
        <div className="">
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
            <a
              href={`/camera?locationId=${mdx.slug}`}
              className=" underline text-gray-900/50 text-sm"
            >
              retake your photos
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs w-full text-center text-amber-500 font-black">
            VISIT
          </div>
          <div className="font-bold text-sm text-black">
            {mdx.photoPrompt || genericPhotoPromptText}
          </div>
          <div className="flex flex-col items-center pt-2">
            <a
              href={`/camera?locationId=${mdx.slug}`}
              className="border-gray-900 border-2 text-black bg-amber-100 px-4 py-2 font-black text-sm rounded-full"
            >
              I'M HERE
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
