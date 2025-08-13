import { useRouter } from "next/navigation";
import { hasLocationBeenVisited, getPage } from "../lib/storageHelpers";

export function JournalHeader({ mdx }) {
  const slug = mdx.slug;
  const visited = hasLocationBeenVisited(slug);
  return [
    <hr key={0} className="absolute top-1"></hr>,
    <div
      key={1}
      className="text-sm relative flex flex-row justify-between items-center text-black"
    >
      <div className="absolute left-0 -top-1 font-bold text-md uppercase bg-lime-300 pl-4 pr-2 p-1 shadow-lg z-10">
        {mdx.locationTitle}
      </div>
      <a href={`/${mdx.location[0].toLowerCase()}/${mdx.slug}`}>
        <div className="absolute right-2 top-5 z-10 text-black text-xs border-2 px-2 py-1 border-black rounded-md bg-yellow-300 text-center font-bold">
          Open in map
        </div>
      </a>
      <hr className="w-full"></hr>
      <div className="font-mono text-xs font-light text-gray-400">
        {visited ? "VISITED" : "UNVISITED"}
      </div>
    </div>,
  ];
}

export function JournalLog({ mdx }) {
  const slug = mdx.slug;
  const visited = hasLocationBeenVisited(slug);
  return (
    <div className="flex flex-col items-center justify-between w-full h-full">
      {/* Show the image */}
      {visited ? (
        <div className="relative font-mono text-xs justify-center grow w-fit h-0">
          <img
            className="h-fit w-fit drop-shadow-lg rotate-3"
            src={getPage(slug).image}
          />
        </div>
      ) : (
        // Show image placeholder
        <div className="shrink-0 grow w-full flex flex-col items-center justify-center ">
          <div className="flex flex-col font-mono text-xs bg-white/50 backdrop-blur-lg text-gray-800 select-none  w-2/3 h-fit border-2 border-amber-400 rounded-md items-center justify-center gap-2 p-2">
            <div className=" text-amber-500 text-center ">{mdx.title}</div>
            <div className=" text-amber-500 uppercase text-lg rotate-3 font-bold tracking-wider">
              Unvisited
            </div>
            <div className=" text-amber-500 text-center">
              {mdx.locationTitle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function JournalLogInfo({ mdx }) {
  const slug = mdx.slug;
  const visited = hasLocationBeenVisited(slug);
  const router = useRouter();
  const page = getPage(slug);
  const visitedDate = new Date(page?.date);
  return (
    <div className="w-full h-full relative bg-lime-100 shrink-0 border-2 border-lime-200 rounded-md flex flex-col gap-1 drop-shadow-sm">
      {visited && (
        <div className="absolute top-1/3 -right-16 mix-blend-hard-light rotate-12 opacity-20">
          <img className="w-36 h-fit" src="/seattle-general-2.svg" />
        </div>
      )}
      <div className="flex flex-col">
        <div className="font-mono flex flex-row justify-between text-xs text-gray-600  p-1 ">
          <div>{mdx.neighborhood}</div>
        </div>
        <div className="flex flex-row text-xs font-mono text-gray-500 justify-between  p-1 ">
          <div className="text-xs font-mono">
            {visited ? (
              <div className="flex flex-row  ">
                <div className="text-red-600 font-bold font-vivian">
                  {visitedDate.getMonth() + 1}
                </div>
                <div>/</div>
                <div className="text-red-600 font-bold font-vivian">
                  {visitedDate.getDate()}
                </div>
                <div>/</div>
                <div className="text-red-600 font-bold font-vivian">
                  {visitedDate.getFullYear()}
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-2 pl-3">
                <div>/</div>
                <div>/</div>
              </div>

              // <button
              //   className="w-full h-full shrink-0 "
              //   onClick={() => {
              //     router.push(`/${mdx.slug}`);
              //   }}
              // >
              //   Open in Map
              // </button>
            )}
          </div>
          <div>
            {visited ? (
              <div className="flex flex-row ">
                <div className="text-red-600 font-bold font-vivian">
                  {visitedDate.getHours()}
                </div>
                <div>:</div>
                <div className=" text-red-600 font-bold font-vivian">
                  {visitedDate.getMinutes()}
                </div>
                <div>:</div>
                <div className="text-red-600 font-bold font-vivian">
                  {visitedDate.getSeconds()}
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-2 pr-3">
                <div>:</div>
                <div>:</div>
              </div>

              // <button>Log visit</button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-lime-500 border-dashed"></hr>
      <div className="text-xs text-left p-1 overflow-y-auto h-full flex flex-col text-black">
        <div className="text-bold text-center font-bold">{mdx.title}</div>
        <div>{mdx.blurb}</div>
      </div>
    </div>
  );
}
