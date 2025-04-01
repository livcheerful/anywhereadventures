"use client";

import { useState, useEffect } from "react";

let screenWidth = 390;
const bubblePercentage = 0.5;
const charwidth = 12;
let charHeight = 29;
const lineLimit = (screenWidth * bubblePercentage) / charwidth;
const defaultBubbleWidth = screenWidth * bubblePercentage;

export default function Comic({
  image,
  speechBubbles = [],
  overlap = 0,
  absoluteHeight,
  position = "left",
}) {
  // VVN TODO calculate bubble height and width based on text
  // VVN todo text centering helper
  // VVN TODO making svg bubble helper

  const [brokenLines, setBrokenLines] = useState([]);
  const [wordInfo, setWordInfo] = useState([]);
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

  function estimateBubbleHeight(bl) {
    let estHeight = 0;
    for (let lineSetIdx = 0; lineSetIdx < bl.length; lineSetIdx++) {
      const lineSet = bl[lineSetIdx];
      estHeight += lineSet.length * (charHeight + 2);
      estHeight += 10; // margin in bubble maybe
      estHeight += 20; // gaps between bubbles maybe
    }
    // console.log("estimated heigh is:");
    // console.log(estHeight);
    return estHeight;
  }
  useEffect(() => {
    const speechBubblesProcessed = [];
    const processedWordInfo = [];
    const longestLines = [];
    speechBubbles.forEach((sb) => {
      const comicLine = sb.text;

      let words = comicLine.split(" ");

      let unboldedWords = [];
      let unitalicizedWords = [];
      let informedWords = [];
      let inBold = false;
      const startBoldRegExp = /^(\*\*)(\S+)/;
      const endBoldRegExp = /(\S+)(?=\*\*$)/;
      const startItalicRegExp = /^(\*)(\S+)/;
      const endItalicRegExp = /(\S+)(?=\*$)/;
      for (let i = 0; i < words.length; i++) {
        // Check if the beginning of this is bolded
        let match = words[i].match(startBoldRegExp);
        let endMatch = words[i].match(endBoldRegExp);
        if (match && endMatch) {
          let removeEnd = match[2].match(endBoldRegExp);
          unboldedWords.push(removeEnd[1]);
          informedWords.push({ text: removeEnd[1], bold: true });
        } else if (match) {
          unboldedWords.push(match[2]);
          informedWords.push({ text: match[2], bold: true });
          inBold = true;
        } else if (endMatch) {
          unboldedWords.push(endMatch[1]);
          informedWords.push({ text: endMatch[1], bold: true });
          inBold = false;
        } else if (inBold) {
          unboldedWords.push(words[i]);
          informedWords.push({ text: words[i], bold: true });
        } else {
          unboldedWords.push(words[i]);
          informedWords.push({ text: words[i], bold: false });
        }
      }

      for (let i = 0; i < unboldedWords.length; i++) {
        let match = unboldedWords[i].match(startItalicRegExp);
        let endMatch = unboldedWords[i].match(endItalicRegExp);
        // console.log(match);
        if (match && endMatch) {
          let removeEnd = match[2].match(endItalicRegExp);
          unitalicizedWords.push(removeEnd[1]);
          informedWords[i].italic = true;
        } else if (match) {
          unitalicizedWords.push(match[2]);
          informedWords[i].italic = true;
          inBold = true;
        } else if (endMatch) {
          unitalicizedWords.push(endMatch[1]);
          informedWords[i].italic = true;
          inBold = false;
        } else if (inBold) {
          unitalicizedWords.push(unboldedWords[i]);
          informedWords[i].italic = true;
        } else {
          unitalicizedWords.push(unboldedWords[i]);
          informedWords[i].italic = false;
        }
      }
      processedWordInfo.push(informedWords);
      words = unitalicizedWords;
      const wordlengths = words.map((w) => {
        return w.length;
      });
      const midpoint = Math.floor(comicLine.length / 2);

      let midWordIdx = 0;
      let sum = 0;
      wordlengths.forEach((wl, i) => {
        sum += wl + 1; // Extra 1 for space
        if (sum < midpoint) {
          midWordIdx = i;
        }
      });
      if (wordlengths.length - 1 > midWordIdx + 1) midWordIdx++;

      // console.log("The mid word index is");
      // console.log(midWordIdx);

      let currentLine = words[midWordIdx];
      let brokenLineStruct;
      let goingLeft = true;
      let leftIdx = midWordIdx - 1;
      let rightIdx = midWordIdx + 1;
      // VVN TODO need to add special case if there are only two words.
      if (words.length == 1) {
        brokenLineStruct = new WordListList(currentLine);
        leftIdx = -1;
        rightIdx = words.length;
      }

      // If no characters will fit on a line, this loop stalls out.
      // VVNTODO add checks for that

      if (leftIdx <= 0) goingLeft = false;
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
              if (!brokenLineStruct) {
                brokenLineStruct = new WordListList(currentLine);
              } else {
                brokenLineStruct.postpend(currentLine);
              }
              currentLine = "";
            }
          } else {
            // Commit this line
            if (!brokenLineStruct) {
              brokenLineStruct = new WordListList(currentLine);
            } else {
              brokenLineStruct.postpend(currentLine);
            }
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
      longestLines.push(longestLine * charwidth);
      speechBubblesProcessed.push(lines);
    });
    setBubbleWidths(longestLines);
    setBrokenLines(speechBubblesProcessed);
    setWordInfo(processedWordInfo);
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
      className={`flex  relative ${
        position == "right" ? "flex-row-reverse" : "flex-row"
      }`}
      style={{
        top: `-${overlap}px`,
        height: overlap
          ? absoluteHeight || `${estimateBubbleHeight(brokenLines) - overlap}px`
          : "auto",
      }}
    >
      {image ? (
        <img
          src={image}
          className={` select-none  ${
            position == "full" ? " w-full" : "h-comic"
          }`}
        />
      ) : (
        <div className={`w-16 h-16`}></div>
      )}
      <div className="flex gap-2 flex-col h-fit">
        {brokenLines.map((bubbleLines, i) => {
          // const randomXOff = Math.floor(
          //   (Math.random() * screenWidth * (1 - bubblePercentage)) / 2
          // );
          const randomXOff = 0;
          const margin = 15;
          const bubbleWidth = bubbleWidths[i] || defaultBubbleWidth;
          const bubbleHeight = bubbleLines.length * charHeight + margin * 2;
          const bubbleWid = bubbleWidth / 2;
          const bubbleHei = bubbleHeight / 2;
          const bubbleDrop = 9;
          const tailLength = image ? 20 : 0;
          const tailGap = image ? 10 : 0;

          const thisBubblesWordInfo = wordInfo[i];

          // console.log("this bubbles:");
          // console.log(thisBubblesWordInfo);
          let wordIdx = 0;
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
                    className="fill-white  "
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
                    className="fill-white  "
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
                      <div className="bg-none block comicStyle" key={j}>
                        {line.split(" ").map((w, k) => {
                          if (w.length == 0) {
                            return;
                          }
                          const currIdx = wordIdx++;
                          if (
                            thisBubblesWordInfo[currIdx] &&
                            thisBubblesWordInfo[currIdx].bold
                          ) {
                            if (thisBubblesWordInfo[currIdx].italic) {
                              return (
                                <b className="px-1 comicStyle" key={k}>
                                  <em>{w}</em>
                                </b>
                              );
                            } else {
                              return (
                                <b className="px-1 comicStyle" key={k}>
                                  {w}
                                </b>
                              );
                            }
                          } else {
                            if (thisBubblesWordInfo[currIdx].italic) {
                              return (
                                <em className="px-1 comicStyle" key={k}>
                                  {w}
                                </em>
                              );
                            } else {
                              return (
                                <span className="px-1 comicStyle" key={k}>
                                  {w}
                                </span>
                              );
                            }
                          }
                        })}
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
