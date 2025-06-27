import { categoryInfo } from "../content/meta";
import gsap from "gsap";
import {
  add as addToStorage,
  getAllContent,
  isLocationAdded,
  remove as removeFromStorage,
} from "../lib/storageHelpers";
import { unvisitedMapColor } from "../lib/constants";

export default function MapExploreMarker({
  mdx,
  marker,
  setMyLocations,
  exploreCategoryClickHander,
  addExploreMarkerWithAnims,
  mapManager,
  setViewingExplorePin,
}) {
  return (
    <div className="absolute w-full flex flex-col items-center justify-start left-0  h-fit top-20 md:top-[20%]">
      <div className="absolute flex flex-col w-11/12 md:w-4/5 p-5 bg-white drop-shadow-2xl border-2 border-gray-900 ">
        <button
          className="absolute w-8 h-8  -top-4  -right-4 bg-white border-2 border-gray-900 rounded-full text-center"
          onClick={() => {
            setViewingExplorePin(undefined);
          }}
        >
          <svg
            className="w-full h-full p-2 fill-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
          </svg>
        </button>
        <div className="text-md md:text-xl font-bold">{mdx.title}</div>
        <hr className="md:py-2"></hr>
        <div className="font-mono text-gray-500 text-xs md:text-sm">
          {mdx.locationTitle}
        </div>
        <div className="flex flex-row justify-between text-gray-500 font-mono text-xs pt-3">
          {mdx.neighborhood && <div>{mdx.neighborhood}</div>}
          <div className="text-gray-500 font-mono text-xs w-fit">{`${mdx.latlon[0].toFixed(
            4
          )}, ${mdx.latlon[1].toFixed(4)}`}</div>
        </div>
        {mdx.blurb && (
          <div className="pt-2 text-gray-600 text-sm md:text-md">
            {mdx.blurb}
          </div>
        )}
        {isLocationAdded(mdx.slug) ? (
          <button
            className=" text-center py-2 my-2 rounded-full border-2 border-gray-300 bg-white"
            onClick={(e) => {
              e.stopPropagation();
              removeFromStorage(mdx.slug, mdx);
              addExploreMarkerWithAnims(mdx);
              setMyLocations(getAllContent());
            }}
          >
            <div className="font-bold text-gray-500 ">Remove location</div>
          </button>
        ) : (
          <button
            className=" text-center py-2 my-2 rounded-full border-2 border-gray-300 bg-white"
            onClick={(e) => {
              e.stopPropagation();
              gsap.to(marker, { scale: 1 });
              addToStorage(mdx.slug, mdx);
              mapManager.deleteExploreMarkerFromSlug(mdx.slug);
              setMyLocations(getAllContent());
            }}
          >
            <div className="font-bold text-gray-500 ">Add location</div>
          </button>
        )}
        {mdx.tags && (
          <div>
            <div className=" text-center font-mono text-gray-800 font-bold pt-3">
              Part of
            </div>
            <hr className="py-2"></hr>
            <div className="flex flex-col gap-2">
              {mdx.tags.map((tag, i) => {
                const categoryMeta = categoryInfo[tag];
                console.log("category Meta");
                console.log(tag);
                console.log(categoryMeta);
                return (
                  <button
                    key={i}
                    className=" text-center py-2 rounded-full border-2 border-gray-900 "
                    style={{
                      backgroundColor: `${
                        categoryMeta?.pinColor || unvisitedMapColor
                      }`,
                    }}
                    onClick={() => {
                      exploreCategoryClickHander(tag);
                    }}
                  >
                    <div className="font-bold">
                      {categoryMeta?.title || tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
