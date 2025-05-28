"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export default function PinCamera({ slug }) {
  useGSAP(() => {
    // console.log("starting animation");
    gsap.fromTo(
      "#camera",
      { rotate: -100, left: "-30rem" },
      { rotate: -30, left: "-12rem", delay: 0.2, duration: 1.2 }
    );
  }, []);
  return (
    <div
      id="camera"
      className="w-[28rem] h-48 absolute  "
      style={{ transform: `rotate(-30deg)`, bottom: "40%", left: "-12rem" }}
    >
      <a href="/camera">
        <img src="/camera.png" />
      </a>
    </div>
  );
}
