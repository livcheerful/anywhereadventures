import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { getSettings } from "../lib/storageHelpers";
export default function PinJournal({ page, slug }) {
  useGSAP(() => {
    const screenWidth = window.innerWidth;
    const smallScreen = screenWidth < 768;
    const reduceAnim = getSettings().reduceAnims;
    if (reduceAnim) {
      const page = document.querySelector("#journalPage");
      page.style.left = smallScreen ? "-10px" : "10px";
      page.style.bottom = "20%";
      page.style.transform = "rotate(-20deg)";
    } else {
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
    }
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
