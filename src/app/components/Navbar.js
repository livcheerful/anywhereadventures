"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="fixed w-full flex flex-row gap-2 space-x-2 p-2">
      <div
        className=" bg-emerald-400/80 p-2 grow text-center rounded-lg text-emerald-900 font-extrabold cursor-pointer drop-shadow-xl hover:bg-emerald-400"
        onClick={() => router.push("/")}
      >
        EXPLORE
      </div>
      <div
        className="bg-emerald-400/80  p-2 grow text-center rounded-lg text-emerald-900 font-extrabold cursor-pointer drop-shadow-xl hover:bg-emerald-400"
        onClick={() => router.push("/journal")}
      >
        JOURNAL
      </div>
    </div>
  );
}
