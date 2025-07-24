"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export default function PinCamera({ mdx }) {
  useGSAP(() => {
    // console.log("starting animation");
    const screenWidth = window.innerWidth;
    const smallScreen = screenWidth < 768;
    gsap.fromTo(
      "#camera",
      { rotate: 100, right: "-30rem", bottom: smallScreen ? "20%" : "50%" },
      {
        rotate: smallScreen ? 9 : 13,
        right: smallScreen ? "-3rem" : "-8rem",
        delay: 0.2,
        duration: 1.2,
      }
    );
  }, []);
  return (
    <div
      id="camera"
      className="w-[15rem] h-[10rem] md:w-[24rem] md:h-[10rem] absolute  "
    >
      <a href={`/camera?locationId=${mdx.slug}`}>
        <img src="/camera.png" />
        <div
          className="bg-white absolute top-9 left-[1rem] w-[9rem] h-[6.5rem] md:w-[14rem] md:h-[10rem] md:left-[1.8rem] md:top-[3.8rem]"
          style={{
            rotate: "-2deg",
            backgroundImage: `url(${mdx.cameraImage || mdx.cardImage})`,
            backgroundSize: "cover",
          }}
        ></div>
      </a>
    </div>
  );
}
