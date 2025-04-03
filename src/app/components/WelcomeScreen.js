"use client";
import { useEffect, useState } from "react";

const lines = [
  "Welcome to Anywhere Adventures!",
  "This is a cool project",
  "At this point you can choose which places to explore :)",
];
export default function WelcomeScreen({ onFinishWelcoming }) {
  const [welcomeTextState, setWelcomeTextState] = useState();
  useEffect(() => {
    setTimeout(() => {
      setWelcomeTextState(0);
    }, 1000);
  }, []);
  return (
    <div
      className="absolute top-0 left-0 z-40"
      style={{ width: "30rem", height: "40rem" }}
    >
      <div
        className="absolute flex-grow w-full h-full flex flex-col items-center justify-center top-0 left-0 -rotate-6 "
        style={{
          backgroundImage: `url(/paperAnim.png)`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        {welcomeTextState != undefined && (
          <div className="text-black text-lg p-16 font-bold -rotate-3">
            <div>{lines[welcomeTextState]}</div>

            <div
              className=" cursor-pointer"
              onClick={() => {
                if (welcomeTextState < lines.length - 1) {
                  setWelcomeTextState(welcomeTextState + 1);
                } else {
                  setWelcomeTextState(undefined);
                  onFinishWelcoming();
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
