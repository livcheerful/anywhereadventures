"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
export default function Camera({ photoSource, setPhotoSource }) {
  const searchParams = useSearchParams();
  const refSlug = searchParams.get("refSlug");
  const cameraType = searchParams.get("type");
  const frameImage = searchParams.get("frame");
  const imagePlacement = searchParams.get("place");
  const imageDimensions = searchParams.get("size");
  const [showSayCheese, setShowSayCheese] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(320);
  const canvas = useRef(null);
  useEffect(() => {
    getMedia({
      video: true,
    });
  }, []);

  async function getMedia(constraints) {
    console.log("in get media");
    let stream = null;

    const video = document.getElementById("video");
    video.controls = false;
    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          setHeight((video.videoHeight / video.videoWidth) * width);

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          // canvas.current.setAttribute("width", width);
          // canvas.current.setAttribute("height", height);
          setStreaming(true);
        }
      },
      false
    );
    const canvas = document.getElementById("canvas");
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
        canvas.current.width = width * images.length;
        canvas.current.height = (sf.height * width * 2) / sf.width;
        var ctx = canvas.current.getContext("2d");

        images.forEach((img, index) => {
          ctx.drawImage(img, index * width, 0, width, height);
        });

        ctx.drawImage(sf, 0, 0, width * 2, (sf.height * width * 2) / sf.width);

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

  function takePicture() {
    const context = canvas.current.getContext("2d");
    function snapPhoto() {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
      return tempCanvas;
    }
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
    if (width && height) {
      const filmStrip = [];
      switch (cameraType) {
        case "stereograph":
          setTimeout(() => {
            filmStrip.push(snapPhoto());
          }, 3500);
          setTimeout(() => {
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPhotoSource(stitched);
            setShowSayCheese(false);
          }, 3700);
          break;
        case "newspaper":
          setTimeout(() => {
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPhotoSource(stitched);
            setShowSayCheese(false);
          }, 3500);
          break;
        default:
          setTimeout(() => {
            filmStrip.push(snapPhoto());
          }, 3500);
          setTimeout(() => {
            filmStrip.push(snapPhoto());
          }, 4000);
          setTimeout(() => {
            filmStrip.push(snapPhoto());
            const stitched = stitchImages(filmStrip);
            setPhotoSource(stitched);
            setShowSayCheese(false);
          }, 4500);
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
      <div className="filmStrip relative flex flex-col items-center ">
        <div className={`${photoSource ? "hidden" : "visible"} camera`}>
          <video
            webkit-playsinline
            autoPlay
            controls
            playsInline
            muted
            loop
            id="video"
            className="w-full max-h-[30rem]"
          >
            Video stream not available.
          </video>
        </div>
        <canvas className="hidden" id="canvas" ref={canvas} />
        {photoSource && (
          <div className="output flex flex-col relative w-fit pt-2">
            <img src={photoSource} />
            {/* <img
          className="absolute top-0 left-0"
          style={{ height: height * 3 }}
          src="film-left.png"
        />
        <img
          className="absolute right-0 top-0"
          style={{ height: height * 3 }}
          src="film-right.png"
        /> */}
          </div>
        )}
        {(showSayCheese || countdown) && (
          <div className="absolute z-10 w-full bg-white/50 h-full flex justify-center items-center">
            <div className="text-black font-bold text-[3rem] ">
              {countdown ? countdown : "say CHEEESE"}
            </div>
          </div>
        )}
        {!photoSource && (
          <button
            className=" p-2 w-12 h-12 outline-2 bg-white rounded-full drop-shadow-sm absolute bottom-0"
            id="start-button"
            onClick={() => takePicture()}
          >
            <div
              className=" text-emerald-950 font-bold absolute top-3 left-5"
              style={{ transform: "rotate(90deg)" }}
            >
              :)
            </div>
          </button>
        )}
      </div>
      <div className="hidden">{loadImageResources()}</div>
    </div>
  );
}
