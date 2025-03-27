"use client";

import { useState, useEffect } from "react";
import { makeConfetti } from "../lib/animationHelpers";

export default function Page() {
  useEffect(() => {
    // makeConfetti(30, 30, 10);
  }, []);
  return (
    <div
      className="w-screen h-screen bg-white"
      onClick={(e) => {
        console.log(e);
        makeConfetti(e.target, e.clientX, e.clientY, 10);
      }}
    >
      <div
        className="p-2 bg-amber-400 rounded-lg"
        onClick={(e) => {
          makeConfetti(e.target, e.clientX, e.clientY, 10);
        }}
      >
        Test
      </div>
    </div>
  );
}
