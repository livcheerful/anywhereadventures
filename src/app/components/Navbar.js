"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ slug }) {
  const router = useRouter();

  const [inJournal, setInJournal] = useState(slug == "journal");
  return (
    <div className="relative">
      <div className="fixed w-fit flex flex-col gap-2 z-10 top-36 ">
        <div
          style={{ writingMode: "sideways-lr" }}
          className={`bg-emerald-400/90 w-fit p-1 py-16 text-center rounded-r-lg text-emerald-900 font-extrabold cursor-pointer ${
            inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/journal")}
        >
          JOURNAL
        </div>
        <div
          style={{ writingMode: "sideways-lr" }}
          className={`bg-emerald-400/90 w-fit  p-1 py-16 text-center rounded-r-lg text-emerald-900 font-extrabold cursor-pointer ${
            !inJournal && "drop-shadow-xl"
          } hover:bg-emerald-400`}
          onClick={() => router.push("/")}
        >
          EXPLORE
        </div>
      </div>
    </div>
  );
}
