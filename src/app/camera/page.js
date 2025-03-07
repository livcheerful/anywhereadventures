"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import Camera from "../components/Camera";

export default function Page() {
  const [photoSource, setPhotoSource] = useState(undefined);

  const router = useRouter();

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-row justify-center z-20 absolute bottom-0 w-full">
        {photoSource && (
          <div className="flex flex-row gap-2">
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
              onClick={() => {
                setPhotoSource(undefined);
              }}
            >
              Retake
            </button>
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
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
            <button
              className="py-3 px-2 h-fit bg-emerald-200 hover:bg-emerald-400 font-bold text-emerald-800 rounded-lg drop-shadow-lg"
              onClick={() => {
                router.push(`/${refSlug}`);
              }}
            >
              Back to reading
            </button>
          </div>
        )}
      </div>
      <Suspense>
        <Camera photoSource={photoSource} setPhotoSource={setPhotoSource} />
      </Suspense>
    </div>
  );
}
