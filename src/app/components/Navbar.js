"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ slug }) {
  const router = useRouter();

  const [inJournal, setInJournal] = useState(slug == "journal");
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="relative">
      <div className="fixed w-fit flex flex-col gap-2 z-10 top-36 ">
        <div
          id={`navbar-journal-tab `}
          className={`bg-emerald-400/90 w-fit h-fit p-1 py-16 text-center rounded-r-lg text-emerald-900 font-extrabold cursor-pointer ${
            inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/journal")}
        >
          <div style={{ writingMode: "vertical-lr" }}>JOURNAL</div>
        </div>
        <div
          id={`navbar-explore-tab`}
          className={`bg-emerald-400/90 w-fit h-fit p-1 py-16 text-center rounded-r-lg text-emerald-900 font-extrabold cursor-pointer ${
            !inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/")}
        >
          <div style={{ writingMode: "vertical-lr" }}>EXPLORE</div>
        </div>
        <div
          id={`navbar-explore-tab`}
          className={`bg-emerald-400/90 w-fit h-fit p-1 py-4 text-center rounded-r-lg text-emerald-900 font-extrabold cursor-pointer ${
            !inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <div style={{ writingMode: "vertical-lr" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 512"
              className="w-4 h-4 stroke-emerald-900"
            >
              <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
