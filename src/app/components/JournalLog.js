import { useRouter } from "next/navigation";
import { hasLocationBeenVisited, getPage } from "../lib/storageHelpers";
export default function JournalLog({ mdx }) {
  const slug = mdx.slug;
  const visited = hasLocationBeenVisited(slug);
  const router = useRouter();
  const page = getPage(slug);
  const visitedDate = new Date(page?.date);
  return (
    <div className="flex flex-col items-center justify-between w-full h-full">
      {/* Show the image */}
      {visited ? (
        <div className="relative font-mono text-xs justify-center grow w-fit h-0">
          <img className="h-full w-fit" src={getPage(slug).image} />
          <div className="absolute top-1/3 -left-16 mix-blend-hard-light rotate-12 opacity-20">
            <img className="w-36 h-fit" src="/seattle-general-2.svg" />
          </div>
          <img
            className="absolute top-4 -left-4 w-12 -rotate-45"
            src="/tape1.png"
          ></img>
          <img
            className="absolute bottom-4 -right-4 w-12 -rotate-45"
            src="/tape1.png"
          ></img>
        </div>
      ) : (
        // Show image placeholder
        <div className="shrink-0 grow w-full flex flex-col items-center justify-center">
          <div className="flex flex-col font-mono text-xs text-gray-800 select-none opacity-50 w-2/3 h-fit border-2 border-amber-400 rounded-md items-center justify-center gap-2 p-2">
            <div className=" text-amber-500 text-center">{mdx.title}</div>
            <div className=" text-amber-500 uppercase text-lg rotate-3 font-bold tracking-wider">
              Unvisited
            </div>
            <div className=" text-amber-500 text-center">
              {mdx.locationTitle}
            </div>
          </div>
        </div>
      )}

      <button
        className="w-full h-fit shrink-0 "
        onClick={() => {
          router.push(`/${mdx.slug}`);
        }}
      >
        <div className="w-full bg-white shrink-0 border-2 p-1  border-gray-800 flex flex-col gap-1">
          <div className="text-center font-black text-gray-800 text-sm ">
            {mdx.locationTitle || mdx.title}
          </div>

          <div className="font-mono flex flex-row justify-between text-xs text-gray-600">
            <div>{mdx.neighborhood}</div>
          </div>
          <hr></hr>
          <div className="flex flex-row text-xs font-mono text-gray-500 justify-between">
            <div className="text-xs font-mono">
              {visited ? (
                <div className="flex flex-row  ">
                  <div className="text-red-700 ">
                    {visitedDate.getMonth() + 1}
                  </div>
                  <div>/</div>
                  <div className="text-red-700">{visitedDate.getDate()}</div>
                  <div>/</div>
                  <div className="text-red-700">
                    {visitedDate.getFullYear()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-row gap-2 pl-3">
                  <div>/</div>
                  <div>/</div>
                </div>
              )}
            </div>
            <div>
              {visited ? (
                <div className="flex flex-row ">
                  <div className="text-red-700">{visitedDate.getHours()}</div>
                  <div>:</div>
                  <div className="text-red-700">{visitedDate.getMinutes()}</div>
                  <div>:</div>
                  <div className="text-red-700">{visitedDate.getSeconds()}</div>
                </div>
              ) : (
                <div className="flex flex-row gap-2 pr-3">
                  <div>:</div>
                  <div>:</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
