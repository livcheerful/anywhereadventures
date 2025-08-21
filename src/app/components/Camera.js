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
              style={{ height: height * 3 || 0 }}
              src="film-left.png"
            />
            <img
              id="film-right"
              className="absolute right-0 top-0"
              style={{ height: height * 3 || 0 }}
              src="film-right.png"
            />
          </div>
        );
    }
  }

  return (
    <div className="">
      <div className="hidden">{loadImageResources()}</div>
      <div className="filmStrip overflow-hidden">
        <div
          id="videoWrapper"
          className={`${
            picture ? "hidden" : "visible"
          } w-3/5 h-md:w-full camera overflow-hidden relative flex flex-col items-center justify-center `}
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
      </div>
    </div>
  );
}
