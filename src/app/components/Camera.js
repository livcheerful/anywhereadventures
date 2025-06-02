"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap/gsap-core";
export default function Camera({
  aspectRatio,
  picture,
  setPicture,
  kickoffSummaryAnimation,
  cameraDirection,
}) {
  const searchParams = useSearchParams();
  const cameraType = searchParams.get("type");
  const frameImage = searchParams.get("frame");
  const imagePlacement = searchParams.get("place");
  const imageDimensions = searchParams.get("size");
  const [showSayCheese, setShowSayCheese] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [height, setHeight] = useState();
  const [width, setWidth] = useState(0);
  const canvas = useRef(null);

  useEffect(() => {
    getMedia({
      video: {
        facingMode: {
          exact: cameraDirection,
        },
      },
    });
  }, [cameraDirection]);

  function flash() {
    const tl = gsap.timeline();
    tl.fromTo(
      "#white-background",
      {
        backgroundColor: "#FFFFFF99",
      },
      {
        duration: 0.2,
        backgroundColor: "#FFFFFFFF",
      }
    );
    tl.to("#white-background", {
      duration: 0.5,
      backgroundColor: "#FFFFFF99",
    });
  }
  useEffect(() => {
    const w = Math.min(window.innerWidth - 10, 400);
    const h = w / aspectRatio;
    setWidth(w);
    setHeight(h);
  }, []);

  async function getMedia(constraints) {
    let stream = null;

    const video = document.getElementById("video");

    const cameraScreen = document.getElementById("cameraScreen");
    video.controls = false;
    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          const w = cameraScreen.getBoundingClientRect().width;

          // setWidth(w);
          // setHeight(w / aspectRatio);
          setStreaming(true);
        }
      },
      false
    );
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.play();
    } catch (err) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();
    }
  }
  function loadImageResources() {
    switch (cameraType) {
      case "stereograph":
        return (
          <div>
            <img
              id="stereograph"
              className="absolute top-0 left-0"
              style={{ width: width }}
              src="/loc/camera-images/stereograph.png"
            />
          </div>
        );
      case "newspaper":
        return (
          <div>
            <img
              id="newspaper"
              className="absolute top-0 left-0"
              style={{ width: width }}
              src={frameImage}
            />
          </div>
        );
      default:
        return (
          <div>
            <img
              id="film-left"
              className="absolute top-0 left-0"
              style={{ height: height * 3 }}
              src="film-left.png"
            />
            <img
              id="film-right"
              className="absolute right-0 top-0"
              style={{ height: height * 3 }}
              src="film-right.png"
            />
          </div>
        );
    }
  }

  return (
    <div className="">
      <div className="hidden">{loadImageResources()}</div>
      <div className="filmStrip  overflow-hidden">
        <div
          id="videoWrapper"
          className={`${
            picture ? "hidden" : "visible"
          } w-full camera overflow-hidden relative flex flex-col items-center justify-center `}
          style={{
            aspectRatio: aspectRatio,
          }}
        >
          <video
            webkit-playsinline="true"
            autoPlay
            controls
            playsInline
            muted
            loop
            id="video"
            className={` transform ${
              cameraDirection == "user" ? "scale-x-[-1]" : ""
            }`}
          >
            Video stream not available.
          </video>
        </div>
        <canvas className="hidden" id="canvas" ref={canvas} />
        {/* Countdown Elements */}
        {(showSayCheese || countdown) && (
          <div
            id="white-background"
            className="absolute z-10 w-full  h-full flex justify-center items-center"
            style={{ backgroundColor: "#FFFFFF99" }}
          >
            <div className="text-black font-bold text-[3rem] ">
              {countdown ? countdown : "say CHEEESE"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
