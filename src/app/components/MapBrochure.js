"use client";

import MapBrochurePostPreview from "./MapBrochurePostPreview";

export default function MapBrochure({
  category,
  setBrochureViewOpen,
  setViewingExplorePin,
  mapManager,
  chosenLocation,
  handleCloseBrochureView,
  isPreviewBrochure = false,
}) {
  function handlePostClick(slug) {
    handleCloseBrochureView();
    chosenLocation.locs.forEach((location) => {
      console.log(location);
      if (location.slug == slug) {
        mapManager.flyTo(
          [location.latlon[1], location.latlon[0]],
          location.zoom
        );

        mapManager.map.dragPan.disable();

        mapManager.map.once("moveend", () => {
          setViewingExplorePin({
            mdx: location,
            marker: mapManager.exploreMarkers.get(slug),
          });
          mapManager.map.dragPan.enable();
        });
        return;
      }
    });
  }
  if (!category) return <div></div>;
  return (
    <div
      className="bg-white w-full h-full overflow-y-auto pr-0 drop-shadow-2xl "
      style={{ backgroundColor: category.brochureColor }}
      onClick={() => {
        if (isPreviewBrochure) {
          setBrochureViewOpen(true);
          setViewingExplorePin(undefined);
        }
      }}
    >
      <div className="w-full flex flex-row items-center justify-end pr-4 p-2">
        <button
          className=" text-gray-400"
          onClick={() => {
            handleCloseBrochureView();
          }}
        >
          <svg
            className="w-4 h-4 fill-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
          </svg>
        </button>
      </div>
      <div className="">
        <div className="p-4">
          <div className="font-black text-gray-900 text-2xl min-h-16 flex items-end ">
            {category.title || category.tag}
          </div>
          <div className="flex flex-col font-mono text-gray-500 text-xs">
            <div>belltown, georgetown</div>
            <div>{`${category.posts.length} locations`}</div>
          </div>
          <hr></hr>
          <div className="text-sm py-2 text-gray-800 tracking-wide">
            {category.description}
          </div>
          <hr></hr>
          <button
            className="bg-green-600 text-white border-2 border-gray-800 w-full rounded-md py-1 mt-2 text-center font-bold"
            onClick={() => {
              console.log("Add all!");
            }}
          >
            + ADD ALL
          </button>
        </div>
        <div className="flex flex-col">
          {category.posts.map((post, i) => {
            return (
              <div key={i}>
                <MapBrochurePostPreview
                  post={post}
                  postClickCb={handlePostClick}
                />
                <hr></hr>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
