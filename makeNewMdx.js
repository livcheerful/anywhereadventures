import * as fs from "fs";
const defaultContent = `---
title:
location: [""]
latlon: []
zoom: 8
tags: [""]
cardImage: ""
---
`;

const fileName = process.argv[2];
fs.writeFileSync(
  `./src/app/content/${fileName || "temp"}.mdx`,
  defaultContent,
  "utf8"
);
