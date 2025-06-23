import * as fs from "fs";
const stickerFile = "./public/content/stickerinfo.json";
const fileName = process.argv[2]; // with relation to public
const title = process.argv[3]; // What it should be called
const lcLink = process.argv[4]; // link back to OG LC item
const file = fs.readFileSync(stickerFile);
const stickerInfo = JSON.parse(file);
stickerInfo[fileName] = { title: title, linkOut: lcLink };
console.log(stickerInfo);
fs.writeFileSync(stickerFile, JSON.stringify(stickerInfo), "utf8");
// fs.writeFileSync(
//   `./src/app/content/${fileName || "temp"}.mdx`,
//   defaultContent,
//   "utf8"
// );
