export default function MapBrochurePostPreview({ post, postClickCb }) {
  return (
    <div
      className="relative flex flex-row w-full min-h-64 overflow-x-clip gap-4 "
      style={{ width: "125%", left: "-25%" }}
    >
      <div
        className="  bg-yellow-100 border-2 border-gray-700 border-b-8 border-r-4 drop-shadow-2xl shrink-0 my-4"
        style={{
          width: "50%",
          height: "12rem",
          backgroundImage: `url(${post.cardImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          alignSelf: "center",
        }}
      ></div>
      <div className="w-full mr-3">
        <div className="flex flex-col min-h-24 justify-end">
          <button
            className="w-fit"
            onClick={() => {
              postClickCb(post.slug);
            }}
          >
            <div className="font-bold text-lg text-left ">{post.title}</div>
          </button>
          <div className="font-mono text-gray-600 text-xs py-1">
            {" "}
            {post.locationTitle}
          </div>
        </div>
        <hr className="border-gray-500"></hr>
        <div className="font-mono text-xs text-gray-600 py-2 flex flex-row justify-between">
          <div className="">{post.neighborhood}</div>
          <div className="flex flex-col items-end">
            <div>{post.latlon[0].toFixed(4)}</div>
            <div>{post.latlon[1].toFixed(4)}</div>
          </div>
        </div>
        <hr className="border-gray-500"></hr>
        <div className="text-sm pt-2 text-gray-600">{post.blurb}</div>
      </div>
    </div>
  );
}
