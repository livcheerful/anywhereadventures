export default function BigLink({ link, thumbnail, title }) {
  return (
    <div className="flex flex-col items-center pb-4">
      <a href={link} className="" target="_blank">
        <div className="w-[15rem] h-fit rounded-lg drop-shadow-lg">
          <div
            className="w-[15rem] h-[8rem] rounded-t-lg border-2 border-black"
            style={{
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className=" bg-white p-2 rounded-b-lg text-black font-bold no-underline border-2 border-black">
            {title}
          </div>
        </div>
      </a>
    </div>
  );
}
