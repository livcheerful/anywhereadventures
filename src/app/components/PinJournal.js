import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function PinJournal({ page, slug }) {
  useGSAP(() => {
    const screenWidth = window.innerWidth;
    const smallScreen = screenWidth < 768;
    gsap.fromTo(
      "#journalPage",
      { left: 0, bottom: "-20rem", rotate: 0 },
      {
        left: smallScreen ? -10 : 10,
        bottom: "20%",
        rotate: -20,
        delay: 0.5,
        duration: 0.8,
      }
    );
  }, []);
  return (
    <div
      id="journalPage"
      className="w-[10rem] h-[15rem] md:w-[15rem] md:h-[30rem] absolute bg-white drop-shadow-2xl"
      style={{ transform: `rotate(20deg)`, bottom: "20%", right: "-12rem" }}
    >
      <a href={`/journal?id=${slug}`}>
        {page ? <img src={page.image} /> : <img src="/defaultpaper.png" />}
      </a>
    </div>
  );
}
