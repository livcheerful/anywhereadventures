export default function BigLink({ link, thumbnail, title }) {
  console.log(link);
  return (
    <div className="w-full flex flex-col items-center pb-4">
      <a href={link} className="">
        <div className="w-[15rem] h-[10rem] rounded-lg drop-shadow-lg">
          <div
            className="w-[15rem] h-full rounded-t-lg border-2 border-black"
            style={{ backgroundImage: `url(${thumbnail})` }}
          ></div>
          <div className=" bg-white p-2 rounded-b-lg text-black font-bold no-underline border-2 border-black">
            {title}
          </div>
        </div>
      </a>
    </div>
  );
}
