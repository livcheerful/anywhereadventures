export default function LibraryIndexCard({ stickerObj }) {
  function makeIndexCardLines() {
    const lines = [];
    for (let i = 0; i < 13; i++) {
      lines.push(<hr className="border-blue-200" key={i}></hr>);
    }
    return (
      <div className="gap-4 flex flex-col pt-6">
        <hr className="border-red-400"></hr>
        {lines}
      </div>
    );
  }

  return (
    <div className="w-full h-full  bg-white border-2 border-black drop-shadow-xl">
      {makeIndexCardLines()}
      <div className=" w-full h-full absolute top-0 left-0 overflow-clip ">
        <div className="font-mono text-gray-700 pl-3">{stickerObj.title}</div>
        <div className="flex flex-row gap-2">
          <img className="w-1/3" src={stickerObj.image} />
          <div className="flex flex-col">
            <a className="underline font-bold" href={stickerObj.linkOut}>
              {"View source >"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
