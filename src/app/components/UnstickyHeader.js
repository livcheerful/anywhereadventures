import { categoryInfo } from "../content/meta";

export default function UnstickyHeader({
  post,
  setToastMessage,
  mainMap,
  setPaneOpen,
}) {
  return (
    <div className="pb-4 pt-2">
      <h1 className=" font-bold text-2xl px-2 text-black text-center text-pretty">
        {post?.title}
      </h1>
      <div className="relative flex flex-col pt-4 px-2">
        <div className="border-2 border-lime-400 rounded-lg text-md bg-white ">
          <div className="p-2 px-4 pt-4 text-sm flex flex-col gap-2">
            <div className="font-bold text-md">{post.locationTitle}</div>
            <hr className="border-dashed"></hr>
            <div className="font-mono text-xs flex flex-row justify-between  text-gray-400 ">
              <div>{post.neighborhood}</div>
              <div>{`${post.latlon[0].toFixed(4)}, ${post.latlon[1].toFixed(
                4
              )}`}</div>
            </div>
            <div>{post.address}</div>
          </div>
          <div className="flex flex-row w-full overflow-x-auto gap-2 px-2 text-nowrap text-xs pb-2  font-bold">
            <a
              href={`/journal?id=${post.slug}`}
              className="bg-lime-300 rounded-2xl drop-shadow-sm px-4 py-2 flex flex-col items-center justify-center"
            >
              See log
            </a>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPaneOpen(false);
                mainMap.flyTo(
                  [post.latlon[1], post.latlon[0]],
                  post.zoom,
                  false
                );
              }}
              className="bg-yellow-300 rounded-2xl drop-shadow-md px-4 py-2"
            >
              Show on map
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(post.address);
                setToastMessage("Copied address to clipboard");
              }}
              className="border-yellow-300 active:bg-yellow-400 bg-white border-2 rounded-2xl drop-shadow-sm px-4 py-2 "
            >
              Copy address
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/${post.slug}`
                );
                setToastMessage("Copied URL to clipboard");
              }}
              className="border-yellow-300 active:bg-yellow-400 bg-white border-2 rounded-2xl drop-shadow-sm px-4 py-2"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
