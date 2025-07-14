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
      className="w-full bg-yellow-100 h-dvh shrink-0 snap-start flex flex-col items-center justify-around"
      style={{
        backgroundSize: "cover",
      }}
    >
      <div className="w-full  flex flex-row justify-between p-2 text-xs text-gray-700 font-mono">
        <div className="font-bold">{categoryMeta?.title}</div>
        <div>{`${countVisitedLocationsInCategory()} / ${
          category.locations.length
        } visited`}</div>
      </div>
      <hr className="w-full border-slate-700 "></hr>
      <div className="h-full grow p-2 w-full grid grid-cols-2 grid-rows-2 gap-2">
        {locations.map((locMdx, i) => {
          return <JournalLog key={i} mdx={locMdx} />;
        })}
      </div>
      <div className="w-full ">
        <hr className="w-3/4 border-slate-700 "></hr>
      </div>
      <div className="flex shrink-0 flex-row justify-between p-4 w-full font-mono text-xs text-gray-800">
        <div className="flex flex-row gap-2 select-none">
          <div className="font-bold">{pageNumber}</div>
          <div>|</div>
          <div className="">Anywhere Adventures</div>
        </div>
        <div className="select-none">with the Library of Congress</div>
      </div>
    </div>
  );
}
