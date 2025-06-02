"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

import FilmReel from "../components/FilmReel";
import Camera from "../components/Camera";
import SearchParamHandler from "../components/SearchParamHandler";
import Scrapbook from "../components/Scrapbook";

import { savePage, numberOfPages } from "../lib/storageHelpers";
import { getMdx } from "../lib/clientPostHelper";

const cameraPermissionStates = ["prompt", "granted", "denied"]; // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state
const cameraDirectionStates = ["user", "environment"];

const aspectRatio = 16 / 9;
export default function Page({}) {
  const [cameraPermissionState, setCameraPermissionState] = useState(undefined);
  const [haveShownHelp, setHaveShownHelp] = useState(false); //TODO update this based on cookie
  const [picture, setPicture] = useState(undefined);
  const [reel, setReel] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [processPhotos, setProcessPhotos] = useState(false);
  const [showSummaryPage, setShowSummaryPage] = useState(false);
  const [collageImage, setCollageImage] = useState(undefined);
  const [locationId, setLocationId] = useState();
  const [cameraDirectionIdx, setCameraDirectionIdx] = useState(0); // can be user or environment
  const [stickerRefs, setStickerRefs] = useState([]); // links to the stickers used
  const [mdx, setMdx] = useState(undefined);

  const router = useRouter();

  useEffect(() => {
    getMdx([locationId], (res) => {
      console.log(typeof res);
      console.log(res);
      setMdx(res[0]);
    });
  }, [locationId]);

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
        setShowMenu(false);
      },
    },
    {
      text: "Reset Camera",
      onClick: () => {
        setReel([]);
        setShowMenu(false);
      },
    },
    {
      text: "Swap Camera",
      onClick: () => {
        setCameraDirectionIdx(
          cameraDirectionIdx + (1 % cameraDirectionStates.length)
        );
        setShowMenu(false);
      },
    },
  ];

  async function checkPermissions(cb) {
    const permissions = await navigator.permissions.query({ name: "camera" });
    cb(permissions);
  }

  useEffect(() => {
    const pageStickers = document.querySelectorAll(`.refImage`);
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
  }, []);
  return (
    <div className="relative h-dvh w-screen md:w-limiter bg-white overflow-hidden">
      <div
        className="w-full right-0 h-1/4 flex flex-col-reverse items-end gap-2 "
        style={{
          backgroundImage: `url(${mdx?.cameraImage || mdx?.cardImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backgroundBlendMode: "lighten",
        }}
      >
        <div className="p-1 w-full bg-lime-200/80 rounded-md text-sm text-gray-700 flex flex-row justify-end drop-shadow-sm">
          <div className="w-1/2 font-mono text-gray-700">
            <div className=" font-bold">{mdx?.locationTitle || mdx?.title}</div>
            <div className="text-xs">{mdx?.prompt || "Take pictures"}</div>
          </div>
        </div>
        <div className="w-1/2 font-mono flex flex-col gap-2 pr-2 ">
          {reel.map((picture, i) => {
            return (
              <div
                key={i}
                className="p-1 bg-lime-200/80  rounded-md text-sm text-gray-700 drop-shadow-sm "
              >
                <div className="text-xs">{`Picture 00${i + 1}`}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Suspense>
        <SearchParamHandler
          paramsToFetch={["refSlug", "locationId"]}
          cb={handleSearchParams}
        />
      </Suspense>
      {cameraPermissionState == "prompt" && !haveShownHelp && (
        <div className="absolute w-full h-full top-0 left-0 bg-white/85 flex flex-col items-center justify-center z-20">
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
        <div className=" w-full flex flex-row  pl-2 ">
          <div className="absolute" style={{ width: "45%", bottom: "80%" }}>
            <FilmReel snapshots={reel} />
          </div>
        </div>
      )}

      <div
        className="absolute w-full flex flex-col bottom-0  bg-gray-300 "
        style={{ height: "75%" }}
      >
        <div
          className="bg-gray-400 w-full top-0  relative"
          style={{ height: "10%" }}
        >
          <div className="flex flex-row gap-4 h-full left-1/2 relative items-center">
            <button className=" text-4xl p-3 w-10 h-10 bg-white rounded-full scale-y-75">
              <div className=" text-red-800 text-sm font-bold text-center font-mono">
                {5 - reel.length}
              </div>
            </button>
            <button
              className="bg-gray-500 px-3 rounded-lg py-1 scale-y-75"
              onClick={() => {
                setReel([]);
              }}
            >
              <div className="font-mono font-bold">Reset</div>
            </button>
          </div>
        </div>
        {/* Camera Screen */}
        <div className="p-2 ">
          <div
            className=" bg-gray-500 rounded-lg flex flex-col justify-center items-center overflow-clip"
            id="cameraScreen"
          >
            <div className="p-2 bg-gray-700 w-fit h-fit">
              {((cameraPermissionState == "prompt" && haveShownHelp) ||
                cameraPermissionState == "granted") && (
                <Suspense>
                  <Camera
                    aspectRatio={aspectRatio}
                    picture={picture}
                    setPicture={setPicture}
                    cameraDirection={cameraDirectionStates[cameraDirectionIdx]}
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
        <div className="w-full text-center font-mono  text-gray-500 font-bold scale-y-95">
          Anywhere Adventures COOLCam
        </div>
        <div className="flex flex-row w-full flex-grow gap-3 p-3 justify-between items-center">
          {/* Section for Camera controls */}
          <button
            className="h-10 bg-slate-600 px-4 rounded-full text-slate-50 font-mono font-bold"
            style={{
              backgroundImage: `url(cameraButton.png)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            Menu
          </button>

          <button
            className="h-10 cursor-pointer bg-slate-600 px-4 rounded-full text-slate-50 font-mono font-bold"
            style={{
              backgroundImage: `url(cameraButton.png)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            onClick={() => {
              setCameraDirectionIdx(
                (cameraDirectionIdx + 1) % cameraDirectionStates.length
              );
            }}
          >
            Flip
          </button>

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
                  const videoWrapper = document.getElementById("videoWrapper");
                  const destinationWidth =
                    videoWrapper.getBoundingClientRect().width;
                  const destinationHeight =
                    videoWrapper.getBoundingClientRect().height;
                  const video = document.getElementById("video");
                  const videoDimensions = video.width / video.height;

                  let sourceX = 0,
                    sourceY = 0,
                    sourceWidth = video.videoWidth,
                    sourceHeight = video.videoHeight;
                  if (videoDimensions > aspectRatio) {
                    // Too Wide
                    sourceWidth = video.videoHeight * aspectRatio;
                    sourceX = (video.videoWidth - sourceWidth) / 2;
                  } else {
                    // Too Tall
                    sourceHeight = video.videoWidth / aspectRatio;
                    sourceY = (video.videoHeight - sourceHeight) / 2;
                  }
                  const tempCanvas = document.createElement("canvas");
                  const tempCtx = tempCanvas.getContext("2d");
                  tempCanvas.width = destinationWidth;
                  tempCanvas.height = destinationHeight;
                  tempCtx.drawImage(
                    video,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    0, // Where to draw on canvas, X
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

        <div
          className=" bg-white flex flex-row justify-between items-center gap-4 p-2"
          style={{ height: "15%" }}
        >
          <div className="p-4 px-6 text-center bg-green-300 rounded-full h-fit font-bold font-mono flex-grow">
            Back
          </div>
          <button
            className="p-4 px-6 text-center bg-green-300 rounded-full h-fit font-bold font-mono flex-grow"
            onClick={() => {
              setProcessPhotos(true);
            }}
          >
            Finish
          </button>
        </div>
      </div>
      {processPhotos && (
        <Scrapbook
          reel={reel}
          slug={locationId}
          onFinishedScrapbooking={onFinishedScrapbooking}
          setProcessPhotos={setProcessPhotos}
        />
      )}
      {showSummaryPage && (
        <div className="w-full h-full absolute top-0 left-0 bg-white z-20 overflow-y-auto ">
          <div
            className=" bg-green-400 rounded-lg font-extrabold w-fit px-2 py-1 drop-shadow-md cursor-pointer "
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
