import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

export function makeConfetti(element, x, y, amount) {
  for (let i = 0; i < amount; i++) {
    const div = document.createElement("div");
    div.className = "confetti fixed ";
    const xSpread = 20;
    const ySpread = 4;
    const width = 10;
    const height = 10;
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    div.style.zIndex = 1000;
    div.style.left = `${
      x + Math.random() * xSpread - xSpread / 2 - width / 2
    }px`;
    div.style.top = `${
      y + Math.random() * ySpread - ySpread / 2 - height / 2
    }px`;

    const fluur = document.createTextNode("🌼");
    div.appendChild(fluur);
    element.appendChild(div);
  }
  gsap.registerPlugin(MotionPathPlugin);
  const confettis = document.querySelectorAll(".confetti");
  console.log(confettis);
  // Give it motion
  confettis.forEach((c) => {
    // Make a set of points for it to travel along
    const velocityX = Math.random() * 20 - 10;
    let velocityY = (Math.random() * 10 + 4) * -1;
    const gravity = 0.2;
    const points = [];
    const timeSteps = 14;
    // This is time
    for (let i = 1; i < timeSteps; i++) {
      points.push({ x: velocityX * i, y: velocityY * i });
      velocityY = velocityY + gravity * i;
    }
    gsap.fromTo(
      c,
      { x: 0 },
      {
        motionPath: {
          path: points,
        },
        ease: "none",
        // opacity: 0,
        duration: timeSteps * 0.08,
        x: 100,
        onComplete: () => {
          c.remove();
        },
      }
    );
  });
}
