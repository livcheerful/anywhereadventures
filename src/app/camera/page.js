"use client";

import { useEffect, useState, Suspense } from "react";
import FilmReel from "../components/FilmReel";
import Camera from "../components/Camera";
import SearchParamHandler from "../components/SearchParamHandler";
import Scrapbook from "../components/Scrapbook";
import { useRouter } from "next/navigation";
import { savePage, numberOfPages } from "../lib/storageHelpers";

const cameraPermissionStates = ["prompt", "granted", "denied"]; // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state
const cameraDirectionStates = ["user", "environment"];

export default function Page({}) {
  const [cameraPermissionState, setCameraPermissionState] = useState(undefined);
  // const [haveShownHelp, setHaveShownHelp] = useState(false); //TODO update this based on cookie
  const [haveShownHelp, setHaveShownHelp] = useState(numberOfPages() > 0); //TODO update this based on cookie
  const [picture, setPicture] = useState(undefined);
  const [reel, setReel] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [processPhotos, setProcessPhotos] = useState(false);
  const [showSummaryPage, setShowSummaryPage] = useState(false);
  const [collageImage, setCollageImage] = useState(undefined);
  const [locationId, setLocationId] = useState();
  const [cameraDirectionIdx, setCameraDirectionIdx] = useState(1); // can be user or environment
  const [stickerRefs, setStickerRefs] = useState([]); // links to the stickers used
  const router = useRouter();
  console.log(haveShownHelp);

  function onFinishedScrapbooking(imagedata) {
    console.log(`imagedata ${imagedata}`);
    setShowSummaryPage(true);
    setCollageImage(imagedata);
    // save image to local storage

    savePage(locationId, imagedata, new Date());
  }

  function handleSearchParams(kvp) {
    setLocationId(kvp["locationId"]);
  }

  const menuOptions = [
    {
      text: "Back to map",
      onClick: () => {
        router.push("/");
      },
    },
    {
      text: "Reset Camera",
      onClick: () => {
        setReel([]);
      },
    },
    {
      text: "Swap Camera",
      onClick: () => {
        setCameraDirectionIdx(
          cameraDirectionIdx + (1 % cameraDirectionStates.length)
        );
      },
    },
  ];

  async function checkPermissions(cb) {
    const permissions = await navigator.permissions.query({ name: "camera" });
    cb(permissions);
  }

  useEffect(() => {
    const pageStickers = document.querySelectorAll(`.refImage`);
    console.log(pageStickers);
    const list = [];
    for (let i = 0; i < pageStickers.length; i++) {
      const linkOut = pageStickers[i].getAttribute("linkout");
      list.push({
        image: pageStickers[i].getAttribute("src"),
        linkOut: linkOut,
      });
    }
    setStickerRefs(list);
  }, [showSummaryPage]);

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
    <div className="relative h-dvh w-screen md:w-limiter bg-black overflow-hidden">
      <Suspense>
        <SearchParamHandler
          paramsToFetch={["refSlug", "locationId"]}
          cb={handleSearchParams}
        />
      </Suspense>
      {cameraPermissionState == "prompt" && !haveShownHelp && (
        <div className="absolute w-full h-full bg-white/85 flex flex-col items-center justify-center z-20">
          <div
            className="bg-teal-200 p-3 w-fit min-h-1/2 gap-2  text-black "
            style={{ maxWidth: "80%" }}
          >
            <div className="font-bold text-lg">Explore the area</div>
            <div>
              Fill up your camera roll with photos and then collage and save
              your page to your journal
            </div>
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => {
                  setHaveShownHelp(true);
                }}
                className="bg-white  font-bold rounded-lg p-2 py-4"
              >
                START
              </button>
              <a href="/" className="underline">
                Back to reading
              </a>
            </div>
          </div>
        </div>
      )}
      {!processPhotos && (
        <div className="w-full flex flex-row justify-center ">
          <div className="absolute" style={{ width: "50%", bottom: "70%" }}>
            <FilmReel snapshots={reel} />
          </div>
        </div>
      )}

      <div
        className="absolute w-full flex flex-col bottom-0  bg-purple-300 pt-16"
        style={{ height: "65%" }}
      >
        {/* Camera Screen */}
        <div className="bg-purple-500 p-2 " style={{ height: "50%" }}>
          <div
            className="relative w-full h-full bg-slate-900 rounded-lg flex flex-col justify-center items-center overflow-clip"
            id="cameraScreen"
          >
            {((cameraPermissionState == "prompt" && haveShownHelp) ||
              cameraPermissionState == "granted") && (
              <Suspense>
                <Camera
                  picture={picture}
                  setPicture={setPicture}
                  cameraDirection={cameraDirectionStates[cameraDirectionIdx]}
                />
              </Suspense>
            )}
            {showMenu && (
              <div
                className="bg-white/80 rounded-md flex flex-col p-2 gap-2 absolute top-0 left-0 "
                style={{ height: "100%", width: "100%" }}
              >
                {menuOptions.map((option, k) => {
                  return (
                    <div
                      key={k}
                      className="p-2 bg-blue-600 text-yellow-300 font-bold cursor-pointer"
                      onClick={() => {
                        option.onClick();
                      }}
                    >
                      {option.text}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full flex-grow gap-3 p-3">
          {/* Section for Camera controls */}
          <div className="flex-grow shrink-0">
            <div
              className=" grow h-3/5 cursor-pointer"
              style={{
                backgroundImage: "url(/widetelly.png)",
                backgroundSize: "contain ",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div
              className="h-2/5 cursor-pointer"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              style={{
                backgroundImage: "url(/menu.png)",
                backgroundSize: "contain ",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
          <div className="flex flex-col">
            <div className=" text-4xl p-3 w-16 text-center h-16 bg-white text-red-800 rounded-full  ">
              {5 - reel.length}
            </div>
            {reel.length == 5 && (
              <div
                className="bg-white p-2 rounded-full cursor-pointer"
                onClick={() => {
                  setProcessPhotos(true);
                }}
              >
                Process photos
              </div>
            )}
          </div>
          <div
            className="bg-purple-400 rounded-full cursor-pointer  w-24 h-24"
            style={{
              backgroundImage: "url(/shutter.png)",
              backgroundSize: "cover",
            }}
            onClick={() => {
              if (reel.length != 5) {
                const newPhotos = Array.from(reel);

                function snapPhoto() {
                  console.log("snap photo");
                  const video = document.getElementById("video");
                  const tempCanvas = document.createElement("canvas");
                  const tempCtx = tempCanvas.getContext("2d");
                  tempCanvas.width = video.videoWidth;
                  tempCanvas.height = video.videoHeight;
                  tempCtx.drawImage(
                    video,
                    0,
                    0,
                    tempCanvas.width,
                    tempCanvas.height
                  );

                  var img = tempCanvas.toDataURL("image/png");
                  return img;
                }

                const photo = snapPhoto();
                newPhotos.push(photo);
                setReel(newPhotos);
              } else {
                // process photos
              }
            }}
          ></div>
        </div>
      </div>
      {processPhotos && (
        <Scrapbook
          reel={reel}
          slug={locationId}
          onFinishedScrapbooking={onFinishedScrapbooking}
        />
      )}
      {showSummaryPage && (
        <div className="w-full h-full absolute bg-white z-20 overflow-y-auto ">
          <div
            className=" bg-green-400 rounded-lg font-extrabold w-fit px-2 py-1 drop-shadow-md cursor-pointer m-2"
            onClick={() => {
              setShowSummaryPage(false);
            }}
          >
            Back
          </div>
          <div className="flex flex-col items-center gap-2 ">
            <img src={collageImage} className="w-1/2 -rotate-6 " />

            <a
              className="w-1/3 h-fit"
              href={collageImage}
              download={`loc-${locationId}.jpg`}
            >
              <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
                Download
              </div>
            </a>

            <a className="w-1/3 h-fit" href="/">
              <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
                Return to map
              </div>
            </a>

            <a className="w-1/3 h-fit" href="/journal">
              <div className=" p-2 text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
                To scrapbook
              </div>
            </a>
            <div className="pt-4 px-2">
              <div className="text-lg font-bold">Items used</div>
              {stickerRefs.map((stickerObj, i) => {
                return (
                  <div className="flex flex-row gap-3" key={i}>
                    <img className="w-1/3 " src={stickerObj.image} />
                    <a className="w-1/3 h-fit" href={stickerObj.linkOut}>
                      <div className=" p-2  text-center text-white font-bold bg-purple-400 rounded-lg grow-0">
                        View Original
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
