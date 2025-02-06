"use client";

import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [streaming, setStreaming] = useState(false);

  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(0);
  const [photoSource, setPhotoSource] = useState(undefined);
  const [showSayCheese, setShowSayCheese] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const canvas = useRef(null);
  useEffect(() => {
    getMedia({
      video: true,
    });
  }, []);
  function stitchImages(images) {
    canvas.current.width = width;
    canvas.current.height = height * images.length;

    var ctx = canvas.current.getContext("2d");

    images.forEach((img, index) => {
      ctx.drawImage(img, 0, index * height, width, height);
    });

    const fl = document.getElementById("film-left");
    const fr = document.getElementById("film-right");
    ctx.drawImage(fl, 0, 0, (fl.width / fl.height) * height * 3, height * 3);

    const scaledWidth = (fr.width / fr.height) * height * 3;
    ctx.drawImage(fr, width - scaledWidth, 0, scaledWidth, height * 3);

    var img = canvas.current.toDataURL("image/png");
    return img;
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
          canvas.current.setAttribute("width", width);
          canvas.current.setAttribute("height", height);
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
    }
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-row justify-center z-20 absolute bottom-0 w-full">
        {photoSource ? (
          <div>
            <button
              className="p-4 bg-violet-200 rounded-lg drop-shadow-sm"
              onClick={() => {
                setPhotoSource(undefined);
              }}
            >
              Retake
            </button>
            <button
              onClick={() => {
                const dataURL = document
                  .getElementById("canvas")
                  .toDataURL("image/png");
                var a = document.createElement("a");
                // Set the link to the image so that when clicked, the image begins downloading
                a.href = dataURL;
                // Specify the image filename
                a.download = "canvas-download.png";
                // Click on the link to set off download
                a.click();
              }}
            >
              Download
            </button>
          </div>
        ) : (
          <button
            className="p-4 w-12 h-12 outline-2 bg-white rounded-full drop-shadow-sm"
            id="start-button"
            onClick={() => takePicture()}
          ></button>
        )}
      </div>
      <div className="filmStrip relative">
        <div className={`${photoSource ? "hidden" : "visible"} camera`}>
          <video
            webkit-playsinline
            autoPlay
            controls
            playsInline
            muted
            loop
            id="video"
            className="w-full"
          >
            Video stream not available.
          </video>
        </div>
        <canvas className="hidden" id="canvas" ref={canvas} />
        {photoSource && (
          <div className="output flex flex-col relative w-fit">
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
      </div>
      <div className="hidden">
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
      {(showSayCheese || countdown) && (
        <div className="absolute z-10 w-full bg-white/50 h-full flex justify-center items-center">
          <div className="text-white font-black text-[10rem] ">
            {countdown ? countdown : "say CHEEESE"}
          </div>
        </div>
      )}
    </div>
  );
}
