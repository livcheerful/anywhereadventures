"use client";
import { useEffect, useState } from "react";
import { locationData } from "../lib/locationHelpers";
import { setHomeLocation } from "../lib/storageHelpers";
export default function WelcomeScreen({
  onFinishWelcoming,
  setChosenLocation,
  mainMap,
}) {
  const [welcomeTextState, setWelcomeTextState] = useState();

  function generateNextButton() {
    return (
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
    );
  }
  const lines = [
    <div>Welcome to Anywhere Adventures! {generateNextButton()}</div>,
    <div className="w-full h-full top-0 left-0 absolute z-20 flex flex-col items-center justify-center">
      <div className=" font-bold">Choose your location:</div>
      <div className="flex flex-row gap-2 overflow-x-auto font-bold text-white">
        {Object.keys(locationData).map((lName, k) => {
          const l = locationData[lName];
          return (
            <button
              className=" bg-green-700 rounded-lg  p-2 "
              key={k}
              onClick={() => {
                setChosenLocation(l);
                console.log(l);

                setHomeLocation(l.name);
                mainMap.flyTo(l.center, l.zoom, false);
                if (welcomeTextState < lines.length - 1) {
                  setWelcomeTextState(welcomeTextState + 1);
                } else {
                  setWelcomeTextState(undefined);
                  onFinishWelcoming();
                }
              }}
            >
              {l.name}
            </button>
          );
        })}
      </div>
    </div>,
  ];
  useEffect(() => {
    setTimeout(() => {
      setWelcomeTextState(0);
    }, 1000);
  }, []);
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-white/90 z-30">
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
            <div className="text-black text-lg p-16 font-bold -rotate-2">
              <div>{lines[welcomeTextState]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
