"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap/gsap-core";
export default function Camera({
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

  function snapPhoto() {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    return tempCanvas;
  }
  function handleVideo(cameraFacing) {
    const constraints = {
      video: {
        facingMode: {
          exact: cameraFacing,
        },
      },
    };
    return constraints;
  }
  function turnVideo(constraints) {
    let video;
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      video.onloadeddata = () => {
        ctx.height = video.videoHeight;
      };
    });
  }
  useEffect(() => {
    getMedia({
      video: {
        facingMode: {
          exact: "environment",
        },
      },
    });

    // setTakePictureCb(snapPhoto);
  }, []);

  useEffect(() => {
    // turnVideo(handleVideo(cameraDirection));
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

  async function getMedia(constraints) {
    let stream = null;

    const video = document.getElementById("video");

    const cameraScreen = document.getElementById("cameraScreen");
    video.controls = false;
    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          const w =
            (video.videoWidth / video.videoHeight) *
            cameraScreen.getBoundingClientRect().height;
          setWidth(w);
          // video.style.maxWidth = "unset";
          video.setAttribute("width", "500px");
          video.setAttribute("height", "100px");
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
      console.log("there is an error!");
      console.log(err);
      // NotReadableError: Could not start video source
    }
  }
  function stitchImages(images) {
    switch (cameraType) {
      case "stereograph":
        const sf = document.getElementById("stereograph");
        var ctx = canvas.current.getContext("2d");

        let adjustedWidth = width;
        let adjustedHeight = height;
        if (width > height) {
          adjustedWidth = (sf.width / 2 / sf.height) * height;
        } else {
          adjustedHeight = (sf.height / sf.width) * 2 * width;
        }

        canvas.current.width = adjustedWidth * images.length;
        canvas.current.height = adjustedHeight;
        images.forEach((img, index) => {
          ctx.drawImage(
            img,
            index * adjustedWidth,
            0,
            adjustedWidth,
            adjustedHeight
          );
        });

        ctx.drawImage(sf, 0, 0, adjustedWidth * 2, adjustedHeight);

        var img = canvas.current.toDataURL("image/png");
        return img;
      case "newspaper":
        const np = document.getElementById("newspaper");
        canvas.current.width = np.width;
        canvas.current.height = np.height;
        var ctx = canvas.current.getContext("2d");
        const placeCoords = imagePlacement.split(",");
        const dimensions = imageDimensions.split(",");

        let photoWidth = width;
        let photoHeight = height;
        let centerShiftX = 0;
        let centerShiftY = 0;

        if (dimensions[0] < dimensions[1]) {
          // portrait
          // Which dimension we key on depends on who is smaller.
          if (width / height < dimensions[0] / dimensions[1]) {
            // Key on width
            photoWidth = dimensions[0];
            photoHeight = (dimensions[1] / dimensions[0]) * width;
          } else {
            photoHeight = dimensions[1];
            photoWidth = (dimensions[1] / height) * width;
            centerShiftX = (dimensions[1] - photoWidth / 2) * -1;
          }
        } else {
          // Landscape
        }

        images.forEach((img, index) => {
          ctx.drawImage(
            img,
            parseInt(placeCoords[0]) + centerShiftX,
            parseInt(placeCoords[1]),
            photoWidth,
            photoHeight
          );
        });

        ctx.drawImage(np, 0, 0, np.width, np.height);

        var img = canvas.current.toDataURL("image/png");
        return img;
      default:
        canvas.current.width = width;
        canvas.current.height = height * images.length;
        var ctx = canvas.current.getContext("2d");

        images.forEach((img, index) => {
          ctx.drawImage(img, 0, index * height, width, height);
        });

        const fl = document.getElementById("film-left");
        const fr = document.getElementById("film-right");
        ctx.drawImage(
          fl,
          0,
          0,
          (fl.width / fl.height) * height * 3,
          height * 3
        );

        const scaledWidth = (fr.width / fr.height) * height * 3;
        ctx.drawImage(fr, width - scaledWidth, 0, scaledWidth, height * 3);

        var img = canvas.current.toDataURL("image/png");
        return img;
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
  function startCountdown() {
    setCountdown("3");
    setTimeout(() => {
      setCountdown("2");
    }, 1000);
    setTimeout(() => {
      setCountdown("1...");
    }, 2000);
    setTimeout(() => {
      setCountdown(undefined);
      setShowSayCheese(true);
    }, 3000);
  }

  function takePicture() {
    if (width && height) {
      const filmStrip = [];
      switch (cameraType) {
        case "stereograph":
          console.log("in stereograph");
          setTimeout(() => {
            flash();
            filmStrip.push(snapPhoto());
          }, 5);
          setTimeout(() => {
            flash();
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPicture(stitched);
            setShowSayCheese(false);
          }, 200);
          break;
        case "newspaper":
          setTimeout(() => {
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPicture(stitched);
            setShowSayCheese(false);
          }, 5);
          break;
        default:
          // Film strip
          setTimeout(() => {
            filmStrip.push(snapPhoto());
          }, 5);
          setTimeout(() => {
            filmStrip.push(snapPhoto());
          }, 500);
          setTimeout(() => {
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPicture(stitched);
            setShowSayCheese(false);
          }, 1000);
          break;
      }
    } else {
      clearPhoto();
    }
  }

  function clearPhoto() {
    const context = canvas.current.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);

    const data = canvas.current.toDataURL("image/png");
  }

  return (
    <div>
      <div className="filmStrip relative flex flex-col items-center overflow-hidden ">
        <div className={`${picture ? "hidden" : "visible"} camera `}>
          <video
            webkit-playsinline="true"
            autoPlay
            controls
            playsInline
            muted
            loop
            id="video"
            className=" transform scale-x-[-1]"
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
      <div className="hidden">{loadImageResources()}</div>
    </div>
  );
}
