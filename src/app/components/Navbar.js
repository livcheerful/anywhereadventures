"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAll, getAllSlugs } from "../lib/storageHelpers";

export default function Navbar({
  slug,
  setMyLocationSlugs,
  setShowingWelcomeScreen,
}) {
  const router = useRouter();

  const [inJournal, setInJournal] = useState(slug == "journal");
  const [showMenu, setShowMenu] = useState(false);

  const menuOptions = [
    <div className="">Reduce motion</div>,
    <div
      onClick={() => {
        setShowingWelcomeScreen(true);
      }}
    >
      Change home location
    </div>,
    <div
      className="text-red-700"
      onClick={() => {
        clearAll();
        setMyLocationSlugs(getAllSlugs());
      }}
    >
      Reset
    </div>,
  ];
  return (
    <div className="relative">
      <div className=" w-fit flex flex-row gap-2 z-10 text-sm">
        <div
          id={`navbar-journal-tab `}
          className={`bg-emerald-400/90 w-fit h-fit p-2 text-center rounded-t-lg text-emerald-900 font-extrabold cursor-pointer ${
            inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/journal")}
        >
          <div>JOURNAL</div>
        </div>
        <div
          id={`navbar-explore-tab`}
          className={`bg-emerald-400/90 w-fit h-fit p-2  text-center rounded-t-lg text-emerald-900 font-extrabold cursor-pointer ${
            !inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/")}
        >
          <div>EXPLORE</div>
        </div>
        <div
          id={`navbar-explore-tab`}
          className={`bg-emerald-400/90 w-fit h-fit p-2 text-center rounded-t-lg text-emerald-900 font-extrabold cursor-pointer ${
            !inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 512"
              className="w-5 h-5 stroke-emerald-900 fill-emerald-900"
            >
              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
            </svg>
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="absolute z-20 right-0 w-fit  bg-white drop-shadow-xl">
          {menuOptions.map((mo) => {
            return (
              <div>
                <div className="w-full p-2 text-slate-700 cursor-pointer">
                  {mo}
                </div>
                <hr></hr>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
