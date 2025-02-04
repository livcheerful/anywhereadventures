"use client";
export default function Page() {
  async function getMedia(constraints) {
    console.log("in get media");
    let stream = null;

    const video = document.getElementById("video");
    video.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          height = (video.videoHeight / video.videoWidth) * width;

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
          streaming = true;
        }
      },
      false
    );
    const canvas = document.getElementById("canvas");
    const photo = document.getElementById("photo");
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.play();
    } catch (err) {
      /* handle the error */
      console.log("there is an error!");
      console.log(err);
    }
  }

  return (
    <div>
      <div>
        This will be where the camera flow is. It can redirect back to your
        page.
      </div>
      <button
        onClick={() =>
          getMedia({
            video: true,
          })
        }
        className="p-2 bg-slate-200"
      >
        Give us permissions please
      </button>
      <div class="camera">
        <video id="video">Video stream not available.</video>
        <button id="start-button">Take photo</button>
      </div>
      <canvas id="canvas"> </canvas>
      <div class="output">
        <img id="photo" alt="The screen capture will appear in this box." />
      </div>
    </div>
  );
}
