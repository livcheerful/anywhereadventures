import { hasLocationBeenVisited } from "../lib/storageHelpers";
import { JournalLog, JournalLogInfo, JournalHeader } from "./JournalLog";
export default function JournalPage({
  locations,
  pageNumber,
  totalNumLocs,
  numVisited,
}) {
  // function countVisitedLocationsInCategory() {
  //   let visitedCount = 0;
  //   for (let i = 0; i < category.locations.length; i++) {
  //     const slug = category.locations[i].slug;
  //     if (hasLocationBeenVisited(slug)) {
  //       visitedCount++;
  //     }
  //   }
  //   return visitedCount;
  // }

  function totalVisitedLocationNum() {
    return 0;
  }

  function makeLogAndInfo(locMdx, i) {
    return (
      <div
        className="grid grid-rows-[min-content,1fr] grid-cols-2 h-full "
        key={0}
      >
        <div
          className="col-span-2 py-1"
          style={{
            gridRowStart: 1,
            gridColumnStart: 1,
            gridRowEnd: `span 1`,
          }}
        >
          <JournalHeader mdx={locMdx} />
        </div>
        <div
          className="w-full h-full  "
          style={{
            gridRowStart: 2,
            gridColumnStart: 2,
            gridColumnEnd: `span 1`,
            gridRowEnd: `span 1`,
          }}
        >
          <JournalLog mdx={locMdx} />
        </div>
        <div
          className="w-full h-full overflow-clip "
          style={{
            gridRowStart: 2,
            gridColumnStart: 1,
            gridColumnEnd: `span 1`,
            gridRowEnd: `span 1`,
          }}
        >
          <JournalLogInfo mdx={locMdx} />
        </div>
      </div>
    );
  }
  return (
    <div
      className="relative w-full bg-yellow-100 h-dvh shrink-0 snap-start flex flex-col items-center justify-around"
      style={{
        backgroundSize: "cover",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-white/80 flex flex-col">
        <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 ">
          <div className="flex flex-row gap-1 items-end">
            <div className="italic font-serif">{pageNumber}</div>
            <div>|</div>
            <div className="font-bold font-serif">Anywhere Adventures</div>
          </div>
          <div className="flex flex-row gap-1">
            <div>{numVisited}</div>
            <div>/</div>
            <div>{totalNumLocs} </div>
            <div>visited</div>
          </div>
        </div>
        <hr className="w-full border-slate-700 "></hr>
        <div className="grow w-full grid grid-rows-2 gap-2 ">
          {locations.map((locMdx, i) => {
            return (
              <div
                key={i}
                style={{
                  gridColumnStart: 1,
                  gridRowStart: i + 1,
                }}
              >
                {makeLogAndInfo(locMdx, i)}
              </div>
            );
          })}
        </div>
        <div className="h-10 shrink-0"></div>
      </div>
    </div>
  );
}
