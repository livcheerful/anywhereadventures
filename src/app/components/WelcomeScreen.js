"use client";
import { useEffect, useState } from "react";
import { locationData } from "../lib/locationHelpers";
import { setHomeLocation } from "../lib/storageHelpers";

function H1({ children }) {
  return (<h1 className="font-bold text-xl">{children}</h1>);
}

function Box({ style, isModal, children }) {
  let outerClassNames = "absolute w-full h-full";
  // Don't capture outside clicks
  if (!isModal) {
    outerClassNames += " pointer-events-none";
  }
  return (
    <div
      className={outerClassNames}
    >
      <div
        className="relative bg-yellow-300 border-2 border-black p-2"
        style={{
          ...style,
          boxShadow: "5px 5px black",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BaseButton({ classes, onClick, children }) {
  const className = "rounded-lg p-2 border-2 border-black " + classes.join(" ");
  return (
    <button
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function WelcomeScreen({
  onFinishWelcoming,
  setChosenLocation,
  mainMap,
}) {
  const [index, setIndex] = useState(0);
  const [clickedLocation, setClickedLocation] = useState();

  function NextButton() {
    return (
      <BaseButton
        classes={["bg-green-600"]}
        onClick={() => {
          if (index < screens.length - 1) {
            setIndex(index + 1);
          }
        }}>
        Next &gt;&nbsp;
      </BaseButton>
    );
  }

  function LocationButton({ data, mapKey, children }) {
    const color = clickedLocation == mapKey ? "bg-blue-600" : "bg-blue-400";
    return (
      <BaseButton
        classes={[color]}
        onClick={() => {
          setClickedLocation(mapKey)
        }}>
        {children}
      </BaseButton>
    );
  };

  function Popup({ data }) {
    return (
      <Box style={{ left: "10%", top: "60%", width: "40%", height: "30%" }}>
        <H1>{data.name}</H1>
        {/* TODO image and blurb */}
      </Box>
    )
  }

  function StartButton() {
    return (
      <BaseButton
        classes={["absolute", "right-2", "bottom-2"]}
        onClick={() => {
          const data = locationData[clickedLocation];
          console.log(data);
          setChosenLocation(data);
          setHomeLocation(data.name);
          mainMap.flyTo(data.center, data.zoom, false);
          onFinishWelcoming(data);
        }}
      >
        Start
      </BaseButton>
    );
  }

  const screens = [
    <>
      <H1>Welcome to Anywhere Adventures!</H1>
      <p>Welcome text goes here! This section explains what the site is and what the point is.</p>
    </>,

    <>
      <p>Choose your location:</p>
      <div className="flex flex-col gap-5">
        {Object.keys(locationData).map((name, idx) => {
          if (name === "all") {
            return;
          }
          const data = locationData[name];
          return (
            <LocationButton key={idx} mapKey={name} data={data}>
              {data.name}
            </LocationButton>
          );
        })}
      </div>
    </>
  ];

  return (
    <div className="w-full h-full absolute top-0 left-0 bg-white/90 z-30">
      <Box isModal style={{ left: "25%", top: "25%", width: "50%", height: "50%" }}>
        {screens[index]},
        {index < screens.length - 1 && (<NextButton index={index} setIndex={setIndex} />)}
        {clickedLocation && <StartButton />}
      </Box>
      {clickedLocation && (<Popup data={locationData[clickedLocation]} />)}
    </div>
  );
}
