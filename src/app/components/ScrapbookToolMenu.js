import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ScrapbookToolMenu({ title, onClose, children }) {
  const menuRef = useRef();
  const menuFadeRef = useRef();
  const menuAnim = useRef();

  useEffect(() => {
    menuAnim.current = gsap.timeline({ paused: true });

    menuAnim.current.fromTo(
      menuRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.out",
        onReverseComplete: () => {
          if (menuRef.current) menuRef.current.style.visibility = "hidden";
        },
        onStart: () => {
          if (menuRef.current) menuRef.current.style.visibility = "visible";
        },
      },
      0
    );

    menuAnim.current.fromTo(
      menuFadeRef.current,
      { backgroundColor: "rgba(0, 0, 0, 0)" },
      { backgroundColor: "rgba(0, 0, 0, 0.2)", ease: "power2.out" },
      0
    );
    menuAnim.current.play();
  }, []);
  return (
    <div
      ref={menuFadeRef}
      className="md:w-limiter w-full h-full bg-white/80 absolute top-0 flex flex-col justify-end items-center z-50 shadow-t-lg"
      onClick={(e) => {
        onClose(e);
        menuAnim.current.reverse();
      }}
    >
      <div
        ref={menuRef}
        className="rounded-t-lg relative bg-white h-[90%] w-full overflow-y-auto dark:text-black border-4 border-gray-900 border-b-0"
      >
        <div className="w-full sticky top-0 p-2 mb-2 border-b-2 border-gray-800 flex flex-row bg-lime-200 justify-between items-start">
          <div className=" text-lg font-bold">{title}</div>
          <button
            onClick={(e) => {
              onClose(e);
              menuAnim.current.reverse();
            }}
          >
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
