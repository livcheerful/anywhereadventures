import { hasLocationBeenVisited } from "../lib/storageHelpers";
import JournalLog from "./JournalLog";
export default function JournalPage({
  category,
  categoryMeta,
  locations,
  pageNumber,
}) {
  function countVisitedLocationsInCategory() {
    let visitedCount = 0;
    for (let i = 0; i < category.locations.length; i++) {
      const slug = category.locations[i].slug;
      if (hasLocationBeenVisited(slug)) {
        visitedCount++;
      }
    }
    return visitedCount;
  }
  return (
    <div
      className="relative w-full bg-yellow-100 h-dvh shrink-0 snap-start flex flex-col items-center justify-around"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(/passport/page1.jpg)`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-white/80">
        <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
          <div className="font-bold">{categoryMeta?.title}</div>
          <div>{`${countVisitedLocationsInCategory()} / ${
            category.locations.length
          } visited`}</div>
        </div>
        <hr className="w-full border-slate-700 "></hr>
        <div className="h-full grow p-2 w-full grid grid-cols-2 grid-rows-2 gap-2">
          {locations.map((locMdx, i) => {
            return (
              <div
                key={i}
                className="w-full h-full overflow-clip grow-0"
                style={{
                  gridRowStart: Math.floor(i / 2) + 1,
                  gridColumnStart: (i % 2) + 1,
                  gridColumnEnd: `span 1`,
                  gridRowEnd: `span 1`,
                }}
              >
                <JournalLog key={i} mdx={locMdx} />
              </div>
            );
          })}
        </div>
        <div className="h-10"></div>
      </div>
    </div>
  );
}
