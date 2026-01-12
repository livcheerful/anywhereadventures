"use client";
import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { locationData, worldData } from "../lib/locationHelpers";
import { setHomeLocation } from "../lib/storageHelpers";
import Box from "./ui/Box";
import BaseButton from "./ui/BaseButton";

function H1({ children, headingRef }) {
  return (
    <h1
      id="dialogTitle"
      headingRef={headingRef}
      tabIndex={-1}
      className="font-bold text-2xl"
    >
      {children}
    </h1>
  );
}

export default function WelcomeScreen({
  onFinishWelcoming,
  setChosenLocation,
  setPaneOpen,
  mainMap,
  startIndex = 0,
}) {
  const [index, setIndex] = useState(startIndex);
  const [clickedLocation, setClickedLocation] = useState();
  const headingRef = useRef(null);

  useEffect(() => {
    mainMap.flyTo(
      [worldData.center[1], worldData.center[0]],
      worldData.zoom,
      false
    );
  }, []);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [index]);

  function NextButton() {
    return (
      <BaseButton
        label={"Next"}
        classes={["bg-lime-300 grow-0 active:bg-lime-500"]}
        onClick={() => {
          if (index < screens.length - 1) {
            setIndex(index + 1);
          }
        }}
      >
        <div className="flex flex-row justify-center items-baseline gap-1">
          Next
          <svg
            className="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </div>
      </BaseButton>
    );
  }

  function LocationButton({ data, mapKey, children }) {
    const color =
      clickedLocation == mapKey
        ? "bg-lime-600"
        : "bg-lime-300 active:bg-lime-500";
    return (
      <BaseButton
        label={data.name}
        classes={[color]}
        onClick={() => {
          if (clickedLocation == mapKey) {
            setClickedLocation(undefined);
          } else {
            setClickedLocation(mapKey);
          }
        }}
      >
        <div className="font-bold">{children}</div>
      </BaseButton>
    );
  }

  function StartButton() {
    return (
      <div className="relative">
        <BaseButton
          label={"Start"}
          classes={[
            "drop-shadow-2xl",
            "right-2",
            "px-10",
            "bottom-2",
            "bg-lime-700",
            "font-bold",
            "text-white",
            "active:bg-lime-900",
          ]}
          onClick={() => {
            const data = locationData[clickedLocation];
            setChosenLocation(data);
            setHomeLocation(data.name);
            setPaneOpen(false);
            mainMap.flyTo(data.center, data.zoom, false);
            onFinishWelcoming(data);
          }}
        >
          START
        </BaseButton>
      </div>
    );
  }

  const screens = [
    <Box
      isModal
      className={`left-[12.5%] top-[18%] h-2/3 w-3/4 flex flex-col justify-between pb-2 bg-yellow-200`}
    >
      <div className="">
        <img
          className="w-full mb-4 border-b-2 border-black"
          alt="1891 birds-eye-vview map of Seattle"
          src="/loc/triangle.jpg"
        ></img>
        <H1 headingRef={headingRef}>Welcome to Anywhere Adventures!</H1>
        <p className="p-2 text-left">
          Learn local history through stories from the Library of Congress's and
          other digital collections.
        </p>
      </div>

      <NextButton index={index} setIndex={setIndex} />
      {clickedLocation && <StartButton />}
    </Box>,
    <Box
      isModal
      className={`left-[12.5%] top-[18%] h-2/3 w-3/4 flex flex-col justify-between pb-2 bg-yellow-200`}
    >
      <div className="flex flex-col gap-2">
        <img
          className="shrink border-b-2 border-black"
          src="/illustrations/read.png"
          alt="illustrated cartoon figure with empty speech bubble over a historic newspaper page"
        ></img>
        <H1 headingRef={headingRef}>Read stories on the map</H1>
        <div className="text-left px-2">
          Read stories to learn history where it happened through archive items.
          Then visit those locations in person.
        </div>
        <img
          src="/illustrations/visit.jpg"
          alt="cartoon illustration of two people on a beach. One is posing for a photograph while the other snaps a picture on their phone."
          className="w-1/2 self-center border-2 border-black"
        />
        <div className="text-xs italic font-serif">
          Document your visit through photos and notes.
        </div>
      </div>
      <div>
        <NextButton index={index} setIndex={setIndex} />
        <button
          className="underline text-sm"
          onClick={() => {
            setIndex(index - 1);
          }}
        >
          Back
        </button>
      </div>
    </Box>,

    <Box
      isModal
      className={`left-[12.5%] top-[18%] h-2/3 w-3/4 flex flex-col justify-between pb-2 bg-yellow-200`}
    >
      <div className="flex flex-col justify-center gap-3 h-full">
        <div className="italic text-sm font-serif">First, you have to...</div>
        <H1 headingRef={headingRef} className="pb-3 font-black">
          Choose your location
        </H1>
        <div className="flex flex-col  gap-3 w-full">
          {Object.keys(locationData).map((name, idx) => {
            if (name === "all") {
              return;
            }
            const data = locationData[name];
            return (
              <div className="w-full relative" key={idx}>
                <LocationButton key={idx} mapKey={name} data={data}>
                  {data.name}
                </LocationButton>
              </div>
            );
          })}
        </div>
        <div className="px-2">
          Where do you live? Or where do you want to learn about?
        </div>
      </div>
      {
        <div className={`${clickedLocation ? "visible" : "hidden"}`}>
          <StartButton />
        </div>
      }
      {
        <button
          className={`${
            clickedLocation ? "hidden" : "visible"
          } underline text-sm`}
          onClick={() => {
            setIndex(index - 1);
          }}
        >
          Back
        </button>
      }
    </Box>,
  ];

  function Sticker({ which }) {
    const ref = useRef(null);
    const src = locationData[clickedLocation]?.welcome?.stickers?.[which];
    const className =
      which == 0
        ? "absolute left-0 top-0 h-1/5"
        : "absolute right-0 bottom-0 h-1/5";

    const animA = {
      rotation: -10,
      translateX: "-10%",
    };
    const animB = {
      rotation: 10,
      translateX: "10%",
    };

    useEffect(() => {
      if (which == 0) {
        gsap.fromTo(ref.current, animA, animB).duration(0.5);
      } else {
        gsap.fromTo(ref.current, animB, animA).duration(0.5);
      }
    });

    return <img ref={ref} className={className} src={src}></img>;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0 bg-white/40 z-30">
      {clickedLocation && (
        <>
          <Sticker which={0} />
          <Sticker which={1} />
        </>
      )}
      {screens[index]}
    </div>
  );
}
