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
cardImage: "/placeholderThumbnail.png"
stampName:
photoPrompt:
blurb:
---
`;

const fileName = process.argv[2];
fs.writeFileSync(
  `./src/app/content/${fileName || "temp"}.mdx`,
  defaultContent,
  "utf8"
);
