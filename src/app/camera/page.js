"use client";

import { useEffect, useState, Suspense } from "react";
import Camera from "../components/Camera";
import Scrapbook from "../components/Scrapbook";

const cameraPermissionStates = ["prompt", "granted", "denied"]; // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state

export default function Page({}) {
  const [cameraPermissionState, setCameraPermissionState] = useState(undefined);
  const [haveShownHelp, setHaveShownHelp] = useState(false); //TODO update this based on cookie
  const [picture, setPicture] = useState(undefined);

  async function checkPermissions(cb) {
    const permissions = await navigator.permissions.query({ name: "camera" });
    cb(permissions);
  }

  useEffect(() => {
    if (picture) {
      const canvas = document.querySelector("#scrapbookPlayground");
      canvas.style.width =
        window.innerWidth < 480 ? `${window.innerWidth}px` : "480px";
      canvas.style.height = `${window.innerHeight}px`;
      console.log(canvas);
    }
  }, [picture]);
  useEffect(() => {
    checkPermissions((res) => {
      setCameraPermissionState(res.state);
    });
    return () => {
      // localstream.getTracks()[0].stop();
      // need to unregister the camera when navigating away from the page
    };
  }, []);
  return (
    <div className="h-screen w-screen md:w-limiter bg-black">
      {cameraPermissionState == "prompt" && !haveShownHelp && (
        <div className="w-full h-full bg-white/85 flex flex-col items-center justify-center">
          <div className="bg-teal-200 p-3 w-fit min-h-1/2 gap-2">
            <div>Take a picture. Decorate it. Download it. Yay!</div>
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => {
                  setHaveShownHelp(true);
                }}
                className="bg-white rounded-lg p-2"
              >
                Alright
              </button>
            </div>
          </div>
        </div>
      )}

      {((cameraPermissionState == "prompt" && haveShownHelp) ||
        cameraPermissionState == "granted") && (
        <Suspense>
          <Camera picture={picture} setPicture={setPicture} />
        </Suspense>
      )}
      {picture && <Scrapbook picture={picture} />}
    </div>
  );
}
