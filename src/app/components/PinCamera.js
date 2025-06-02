"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export default function PinCamera({ mdx }) {
  useGSAP(() => {
    // console.log("starting animation");
    gsap.fromTo(
      "#camera",
      { rotate: -100, left: "-30rem" },
      { rotate: -13, left: "-8rem", delay: 0.2, duration: 1.2 }
    );
  }, []);
  return (
    <div
      id="camera"
      className="w-[24rem] h-[10rem] absolute  "
      style={{ bottom: "50%" }}
    >
      <a href={`/camera?locationId=${mdx.slug}`}>
        <img src="/camera.png" />
        <div
          className="bg-white absolute top-0 "
          style={{
            width: "14rem",
            height: "10rem",
            left: "1.8rem",
            top: "3.8rem",
            rotate: "-2deg",
            backgroundImage: `url(${mdx.cameraImage || mdx.cardImage})`,
            backgroundSize: "cover",
          }}
        ></div>
      </a>
    </div>
  );
}
