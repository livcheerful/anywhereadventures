export default function PhotoPrompt({ mdx, visited }) {
  const genericPhotoPromptText =
    "Create a travel log of your visit. Explore your surroundings and take photos of what you notice.";
  return (
    <div className="relative bg-amber-300 border-2 border-gray-900 -m-2 mt-4 p-4 overflow-clip ">
      {visited ? (
        <div className="pl-20">
          <img
            src="/seattle-general-2.svg"
            className="absolute w-36 -left-16 mix-blend-hard-light rotate-12 opacity-30"
          />
          <div className="z-10 ">
            <div className="text-gray-800 font-bold text-lg min-h-12 flex flex-col justify-end pb-2">
              <div>{mdx.locationTitle || mdx.title}</div>
            </div>
            <hr className="border-gray-700"></hr>
            <div className="flex flex-row justify-between text-gray-900/50 text-sm font-mono">
              <div className="text-sm text-black font-mono">VISITED</div>
              <div className="flex flex-col items-end ">
                <div className="">21 Feb 2025</div>
                <div className="">1:35:00 PM</div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center pt-4">
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
            PHOTO PROMPT
          </div>
          <div className="font-bold text-md">
            {mdx.photoPrompt || genericPhotoPromptText}
          </div>
          <div className="flex flex-col items-center pt-2">
            <a
              href={`/camera?locationId=${mdx.slug}`}
              className="border-gray-900 border-2 text-black bg-white px-4 py-2 font-black text-sm rounded-full"
            >
              LOG VISIT
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
