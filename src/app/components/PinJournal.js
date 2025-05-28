import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function PinJournal({ page }) {
  useGSAP(() => {
    gsap.fromTo(
      "#journalPage",
      { right: 0, bottom: "-20rem", rotate: 0 },
      { right: 10, bottom: "20%", rotate: 20, delay: 0.5, duration: 0.8 }
    );
  }, []);
  return (
    <div
      id="journalPage"
      className="w-[23rem] h-[30rem] absolute bg-white drop-shadow-2xl"
      style={{ transform: `rotate(20deg)`, bottom: "20%", right: "-12rem" }}
    >
      <a href="/journal">
        {page ? <img src={page.image} /> : <img src="/defaultpaper.png" />}
      </a>
    </div>
  );
}
