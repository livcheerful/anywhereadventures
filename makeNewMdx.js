import * as fs from "fs";
const defaultContent = `---
title:
locationTitle:
address:
location: [""] 
latlon: []
neighborhood:
zoom: 15
tags: [""]
cameraImage: "/placeholderThumbnail.png"
cardImage: "/placeholderThumbnail.png"
stampName:
photoPrompt:
blurb:
stickers:[]
---

{/* 
Sticker template: 
{image: "", linkOut: ""}
*/}

{/* <ComicSection elements={[
    {type:"image", src:"", position:{col:1, row:1}, size:{width:1, height:1}},
    {type:"text", src:"", position:{col:1, row:1}, size:{width:1, height:1}, style:{outline: "bubble"}, bubbleStyle: {tailDegree: 0}},

]}/>  */}
`;

const fileName = process.argv[2];
fs.writeFileSync(
  `./src/app/content/${fileName || "temp"}.mdx`,
  defaultContent,
  "utf8"
);
