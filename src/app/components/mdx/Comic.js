"use client";

import { useState, useEffect } from "react";

let screenWidth = 390;
const bubblePercentage = 0.5;
const charwidth = 12;
const charHeight = 24;
const lineLimit = (screenWidth * bubblePercentage) / charwidth;
const defaultBubbleWidth = screenWidth * bubblePercentage;

export default function Comic({
  image,
  speechBubbles,
  overlap = 0,
  position = "left",
}) {
  // VVN TODO calculate bubble height and width based on text
  // VVN todo text centering helper
  // VVN TODO making svg bubble helper

  const [brokenLines, setBrokenLines] = useState([]);
  const [bubbleWidths, setBubbleWidths] = useState(
    speechBubbles.map(() => defaultBubbleWidth)
  );

  function WordListListNode(value) {
    this.value = value;
    this.left = undefined;
    this.right = undefined;

    this.setLeft = function (node) {
      this.left = node;
    };
    this.setRight = function (node) {
      this.right = node;
    };
  }

  function WordListList(value) {
    this.head = new WordListListNode(value);
    this.tail = this.head;
    this.prepend = (value) => {
      const leftest = new WordListListNode(value);
      leftest.setRight(this.head);
      this.head.setLeft(leftest);

      this.head = leftest;
    };

    this.postpend = (value) => {
      const rightest = new WordListListNode(value);
      rightest.setLeft(this.tail);
      this.tail.setRight(rightest);

      this.tail = rightest;
    };

    this.print = () => {
      let curr = this.head;
      let idx = 0;
      while (curr) {
        idx++;
        curr = curr.right;
      }
    };
    this.toArray = () => {
      let curr = this.head;
      const arr = [];
      while (curr) {
        arr.push(curr.value);
        curr = curr.right;
      }
      return arr;
    };
  }

  useEffect(() => {
    const speechBubblesProcessed = [];
    const longestLines = [];
    speechBubbles.forEach((sb) => {
      const words = sb.text.split(" ");
      const wordlengths = words.map((w) => {
        return w.length;
      });
      const midpoint = Math.floor(sb.text.length / 2);

      let midWordIdx = 0;
      let sum = 0;
      wordlengths.forEach((wl, i) => {
        sum += wl + 1; // Extra 1 for space
        if (sum < midpoint) {
          midWordIdx = i;
        }
      });
      if (wordlengths.length - 1 > midWordIdx + 1) midWordIdx++;

      let currentLine = words[midWordIdx];
      let brokenLineStruct;
      let goingLeft = true;
      let leftIdx = midWordIdx - 1;
      let rightIdx = midWordIdx + 1;
      // VVN TODO need to add special case if there are only two words.

      // If no characters will fit on a line, this loop stalls out.
      // VVNTODO add checks for that
      while (leftIdx >= 0 || rightIdx < words.length) {
        if (goingLeft) {
          if (wordlengths[leftIdx] + currentLine.length < lineLimit) {
            // Add this line
            currentLine = `${words[leftIdx]} ${currentLine}`;
            leftIdx--;
            if (leftIdx < 0) {
              // Commit the line. Out of words
              if (!brokenLineStruct) {
                brokenLineStruct = new WordListList(currentLine);
              } else {
                brokenLineStruct.prepend(currentLine);
              }
              currentLine = "";
              goingLeft = false;
            }
          } else {
            // Commit this line. Too many chars
            if (!brokenLineStruct) {
              brokenLineStruct = new WordListList(currentLine);
            } else {
              brokenLineStruct.prepend(currentLine);
            }
            currentLine = "";
          }
        } else {
          if (wordlengths[rightIdx] + currentLine.length < lineLimit) {
            currentLine = `${currentLine} ${words[rightIdx]}`;
            rightIdx++;
            if (rightIdx >= words.length) {
              brokenLineStruct.postpend(currentLine);
              currentLine = "";
            }
          } else {
            // Commit this line
            brokenLineStruct.postpend(currentLine);
            currentLine = "";
          }
        }
      }
      brokenLineStruct.print();

      let longestLine = 0;
      const lines = brokenLineStruct.toArray();
      lines.forEach((l) => {
        if (l.length > longestLine) {
          longestLine = l.length;
        }
      });
      console.log(`vvn longest line is: ${longestLine}`);
      longestLines.push(longestLine * charwidth);
      speechBubblesProcessed.push(lines);
    });
    setBubbleWidths(longestLines);
    setBrokenLines(speechBubblesProcessed);
  }, []);

  // useEffect(() => {
  //   const wah = document.getElementsByClassName("comicArea");
  //   const reactiveWidths = [];
  //   for (let index = 0; index < wah.length; index++) {
  //     console.log("VVN;;");
  //     console.log(wah[index].offsetWidth);
  //     reactiveWidths.push(wah[index].offsetWidth);
  //   }
  //   setBubbleWidths(reactiveWidths);
  // }, [brokenLines]);

  return (
    <div
      className={`flex relative ${
        position == "right" ? "flex-row-reverse" : "flex-row"
      }`}
      style={{ top: `-${overlap}px` }}
    >
      <img src={image} className="h-comic select-none" />
      <div className="flex gap-2 flex-col">
        {brokenLines.map((bubbleLines, i) => {
          // const randomXOff = Math.floor(
          //   (Math.random() * screenWidth * (1 - bubblePercentage)) / 2
          // );
          const randomXOff = 0;
          const margin = 15;
          const bubbleWidth = bubbleWidths[i] || defaultBubbleWidth; // VVN TODO at some point fix bubbleWidths so they can be smaller if needed to fit the text
          const bubbleHeight = bubbleLines.length * charHeight + margin * 2;
          const bubbleWid = bubbleWidth / 2;
          const bubbleHei = bubbleHeight / 2;
          const bubbleDrop = 9;
          const tailLength = 20;
          const tailGap = 10;
          return (
            <div
              key={i}
              className="relative"
              style={{
                width: `${bubbleWidth}px`,
                height: `${bubbleHeight}px`,
                left: `${position == "left" ? randomXOff : "0"}px`,
              }}
            >
              <svg
                className="absolute stroke-[4] stroke-black"
                width={bubbleWidth + tailLength + 4}
                height={bubbleHeight + 4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {position == "right" ? (
                  <path
                    d={`m${bubbleWid + 2} 2 c${
                      bubbleWid - bubbleDrop
                    } 0, ${bubbleWid} ${bubbleDrop}, ${bubbleWid} ${bubbleHei} l${tailLength} ${
                      tailGap / 2
                    } l-${tailLength} ${tailGap / 2} c0 ${
                      bubbleHei - bubbleDrop - tailGap
                    }, -${bubbleDrop} ${bubbleHei - tailGap}, -${bubbleWid} ${
                      bubbleHei - tailGap
                    } c-${
                      bubbleWid - bubbleDrop
                    } 0, -${bubbleWid} -${bubbleDrop}, -${bubbleWid} -${bubbleHei} c0 -${
                      bubbleHei - bubbleDrop
                    }, ${bubbleDrop} -${bubbleHei}, ${bubbleWid} -${bubbleHei}`}
                    className="fill-white  z-40"
                  />
                ) : (
                  <path
                    d={`m${bubbleWid + 2 + tailLength} 2 c${
                      bubbleWid - bubbleDrop
                    } 0, ${bubbleWid} ${bubbleDrop}, ${bubbleWid} ${bubbleHei}  c0 ${
                      bubbleHei - bubbleDrop
                    }, -${bubbleDrop} ${bubbleHei}, -${bubbleWid} ${bubbleHei} c-${
                      bubbleWid - bubbleDrop
                    } 0, -${bubbleWid} -${bubbleDrop}, -${bubbleWid} -${bubbleHei} l-${tailLength} -${
                      tailGap / 2
                    } l${tailLength} -${tailGap / 2} c0 -${
                      bubbleHei - tailGap - bubbleDrop
                    }, ${bubbleDrop} -${bubbleHei - tailGap}, ${bubbleWid} -${
                      bubbleHei - tailGap
                    }`}
                    className="fill-white  z-40"
                  />
                )}
              </svg>
              <div
                className="w-full h-full flex flex-row items-center justify-center relative"
                style={{ left: position == "right" ? "" : `${tailLength}px` }}
              >
                <div className="flex flex-col items-center bg-none absolute comicArea ">
                  {bubbleLines.map((line, j) => {
                    return (
                      <div
                        className="bg-none block font-comic comicStyle"
                        key={j}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
