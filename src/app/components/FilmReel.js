export default function FilmReel({ snapshots }) {
  return (
    <div className="relative w-full flex flex-col bottom-0 ">
      <div className="px-4 pr-8">
        <div className="flex flex-col w-full bg-black ">
          {snapshots.map((snapshot, i) => {
            return (
              <img
                src={snapshot}
                className="block w-full h-auto pb-2"
                key={i}
              />
            );
          })}
        </div>

        <div className="absolute top-0 w-full">
          <img
            src="/film-left.png"
            className="left-0 top-0"
            style={{ width: "1rem" }}
          />
          <img
            src="/film-right.png"
            className="absolute right-8 top-0"
            style={{ width: "1rem" }}
          />
        </div>
      </div>
      <img
        src="/filmcanister.png"
        className="absolute shrink w-full -bottom-[100px] z-10"
      />
    </div>
  );
}
