"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [streaming, setStreaming] = useState(false);

  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(0);
  const [photoSources, setPhotoSources] = useState(undefined);
  useEffect(() => {
    getMedia({
      video: true,
    });
  }, []);
  function takePicture() {
    const context = canvas.getContext("2d");
    console.log("in take picture");
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
      }, 300);
      setTimeout(() => {
        console.log("snap!");
        filmStrip.push(snapPhoto());
      }, 400);
      setTimeout(() => {
        console.log("snap!");
        filmStrip.push(snapPhoto());
        setPhotoSources(filmStrip);
      }, 900);
    } else {
      clearPhoto();
    }
  }

  function clearPhoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  async function getMedia(constraints) {
    console.log("in get media");
    let stream = null;

    const video = document.getElementById("video");
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
    <div className="flex flex-col gap-3 m-2">
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
          className="p-4 bg-violet-200 rounded-lg drop-shadow-sm"
          id="start-button"
          onClick={() => takePicture()}
        >
          Take photo
        </button>
      )}
      <div className="filmStrip w-[340px] relative">
        <div className={`${photoSources ? "hidden" : "visible"} camera`}>
          <video webkit-playsinline id="video">
            Video stream not available.
          </video>
        </div>
        <canvas className="hidden" id="canvas" />
        {photoSources && (
          <div className="output flex flex-col relative ">
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
              src="/film-left.png"
            />
            <img
              className="absolute right-0 top-0"
              style={{ height: height * 3 }}
              src="/film-right.png"
            />
          </div>
        )}
      </div>
    </div>
  );
}
