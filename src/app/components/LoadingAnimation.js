"use client";
import { useState, useEffect } from "react";

const toolTips = [
  "The Library of Congress has three buildings in Washington DC: the Jefferson, the Madison, and the Adams.",
  "You can ask a real librarian for help with research through the Library of Congress's Ask a Librarian service.",
  "In the United States, the Copyright Office is a part of the Library of Congress.",
  "The Library of Congress doesn't just have books - they have maps, wax cylinders, and even flutes!",
  "The Library of Congress has materials in over 470 languages.",
];

export default function LoadingAnimation() {
  const [toolTipIndex, setToolTipIndex] = useState(
    Math.floor(Math.random() * toolTips.length)
  );
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setToolTipIndex((prev) => (prev + 1) % toolTips.length);
        setFade(true); // fade in new tooltip
      }, 500); // duration matches transition
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-32 pb-4">
        <img src="/mapAnim.png" />
        <div className="font-black text-gray-600">Loading...</div>
      </div>{" "}
      <hr className="border-gray-300 py-3" />
      <div className="p-4 items-center flex flex-col">
        <div className="text-yellow-600 bg-yellow-100 w-2/3 flex flex-col gap-2 px-4 py-3 border-2 border-yellow-400 rounded-lg opacity-45">
          <div className="text-sm font-bold text-center text-yellow-900 px-1 py-2 rounded-lg ">
            DID YOU KNOW
          </div>
          <div
            className={`italic text-yellow-900 transition-opacity duration-500 text-pretty ${
              fade ? "opacity-100" : "opacity-0"
            } text-center`}
          >
            {toolTips[toolTipIndex]}
          </div>
        </div>
      </div>
    </div>
  );
}
