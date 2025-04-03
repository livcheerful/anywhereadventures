"use client";
import { useEffect, useState } from "react";

const lines = ["Welcome to Anywhere Adventures!", "This is a cool project"];
export default function Page() {
  const [welcomeTextState, setWelcomeTextState] = useState();
  useEffect(() => {
    setTimeout(() => {
      setWelcomeTextState(0);
    }, 1000);
  }, []);
  return (
    <div className="w-screen h-screen bg-white">
      <div
        className="absolute flex-grow w-1/2 h-3/5 flex flex-col items-center justify-center top-0 left-0 -rotate-6 "
        style={{
          backgroundImage: `url(/paperAnim.png)`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        {welcomeTextState != undefined && (
          <div className="text-black text-lg  font-bold">
            <div>{lines[welcomeTextState]}</div>

            <div
              onClick={() => {
                if (welcomeTextState < lines.length - 1) {
                  setWelcomeTextState(welcomeTextState + 1);
                } else {
                  setWelcomeTextState(undefined);
                }
              }}
            >
              Next &gt;{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
