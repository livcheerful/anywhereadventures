"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [streaming, setStreaming] = useState(false);

  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(0);
  const [photoSources, setPhotoSources] = useState(undefined);
  const [showSayCheese, setShowSayCheese] = useState(false);
  const [countdown, setCountdown] = useState(false);
  useEffect(() => {
    getMedia({
      video: true,
    });
  }, []);
  function stitchImages(images) {
    document.getElementById("canvas");
    var ctx = c.getContext("2d");

    images.forEach((i) => {
      ctx.drawImage(i, 0, 0, width, height);
    });
  }
  function takePicture() {
    const context = canvas.getContext("2d");
    console.log("in take picture");
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
      function snapPhoto() {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL("image/png");
        return data;
      }
      const filmStrip = [];

      setTimeout(() => {
        console.log("snap!");
        filmStrip.push(snapPhoto());
      }, 3500);
      setTimeout(() => {
        console.log("snap!");
        filmStrip.push(snapPhoto());
      }, 4000);
      setTimeout(() => {
        console.log("snap!");
        filmStrip.push(snapPhoto());
        setPhotoSources(filmStrip);
        setShowSayCheese(false);
      }, 4500);
    } else {
      clearPhoto();
    }
  }

  function clearPhoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
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
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
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
        {photoSources ? (
          <button
            className="p-4 bg-violet-200 rounded-lg drop-shadow-sm"
            onClick={() => {
              setPhotoSources(undefined);
            }}
          >
            Retake
          </button>
        ) : (
          <button
            className="p-4 w-12 h-12 outline-2 bg-white rounded-full drop-shadow-sm"
            id="start-button"
            onClick={() => takePicture()}
          ></button>
        )}
      </div>
      <div className="filmStrip relative">
        <div className={`${photoSources ? "hidden" : "visible"} camera`}>
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
        <canvas className="hidden" id="canvas" />
        {photoSources && (
          <div className="output flex flex-col relative w-fit">
            {photoSources.map((p, i) => {
              return (
                <img
                  id="photo"
                  key={i}
                  alt="The screen capture will appear in this box."
                  src={p}
                  style={{ height: height }}
                />
              );
            })}

            <img
              className="absolute top-0 left-0"
              style={{ height: height * 3 }}
              src="film-left.png"
            />
            <img
              className="absolute right-0 top-0"
              style={{ height: height * 3 }}
              src="film-right.png"
            />
          </div>
        )}
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
