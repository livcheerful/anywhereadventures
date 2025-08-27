export default function LibraryIndexCard({ stickerObj }) {
  function makeIndexCardLines() {
    const lines = [];
    for (let i = 0; i < 11; i++) {
      lines.push(<hr className="border-blue-200" key={i}></hr>);
    }
    return (
      <div className="gap-4 flex flex-col pt-6">
        <hr className="border-red-400"></hr>
        {lines}
      </div>
    );
  }

  const allowSave = true;

  return (
    <div className="w-full h-full  bg-white border-2 border-black drop-shadow-xl">
      {makeIndexCardLines()}
      <div className=" w-full h-full absolute top-0 left-0 overflow-clip ">
        <div className="font-mono text-gray-700 pl-3 pr-3 font-bold">
          {stickerObj.title}
        </div>
        <div className="flex flex-col gap-2">
          <img className="w-1/2 self-center" src={stickerObj.image} />
          <div className="flex flex-col overflow-y-scroll">
            {stickerObj.caption && (
              <div className="text-sm text-black">{stickerObj.caption}</div>
            )}
            <div className="flex flex-row absolute w-full bottom-0 justify-between">
              <a
                className="underline font-bold text-black bg-lime-200 active:bg-lime-400 px-2"
                target="_blank"
                rel="noopener noreferrer"
                href={stickerObj.linkOut}
              >
                {"View source >"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
