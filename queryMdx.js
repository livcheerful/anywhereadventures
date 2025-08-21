import { serialize } from "next-mdx-remote-client/serialize";
import matter from "gray-matter";
import { tagsByCity } from "./src/app/content/meta.js";
import * as fs from "fs";

const postsDirectory = "./src/app/content";

function getAllPosts() {
  function recurseFiles(folder, prepend) {
    let fileNames = fs.readdirSync(folder);
    fileNames = fileNames.filter((s) => {
      return s != "meta.js";
    });

    let folderNames = fileNames.filter((name) => {
      return name.indexOf(".") < 0;
    });

    fileNames = fileNames.filter((name) => {
      return name.indexOf(".") >= 0;
    });

    let fileObj = fileNames.map((f) => {
      return { slug: f, path: `${prepend}/${f}` };
    });

    folderNames.forEach((file) => {
      fileObj.push(
        ...recurseFiles(
          `${folder}/${file}`,
          prepend ? `${prepend}/${file}` : file
        )
      );
    });
    return fileObj;
  }

  let fileObj = recurseFiles(postsDirectory, "");

  const allPosts = fileObj.map((fileObj) => {
    const filePath = `${postsDirectory}/${fileObj.path}`;
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    return {
      slug: fileObj.slug.replace(/\.mdx$/, ""),
      path: fileObj.path,
      content,
      ...data,
    };
  });
  return allPosts;
}

function getAllPostsByLocation(posts, location) {
  return posts.filter((p) => p.location?.includes(location));
}

function splitPostsByCategory(posts, location) {
  // For each category
  const allTags = tagsByCity[location.toLowerCase()];
  const byCategory = [];
  if (!allTags) return byCategory;
  allTags.forEach((tag) => {
    const tagGroup = [];
    posts.forEach((post) => {
      if (post.tags.includes(tag)) {
        tagGroup.push(post); //VVN TODO we can only include info we need to minimize size
      }
    });
    byCategory.push({ tag: tag, posts: tagGroup });
  });
  return byCategory;
}

// =====================START HERE=========================== //

const posts = getAllPosts();
const seattleLocs = getAllPostsByLocation(posts, "Seattle");
const seattleByCategory = splitPostsByCategory(seattleLocs, "Seattle");

const chicagoLocs = getAllPostsByLocation(posts, "Chicago");
const chicagoByCategory = splitPostsByCategory(chicagoLocs, "Chicago");

const seWYLocs = getAllPostsByLocation(posts, "SEWY");
const seWYByCategory = splitPostsByCategory(seWYLocs, "SEWY");

const allPostsByCategory = [
  ...seattleByCategory,
  ...chicagoByCategory,
  ...seWYByCategory,
];

const outputData = `
// This is the dynamically generated file
export const allSlugs = ${JSON.stringify(posts.map((p) => p.slug))}
export const allLocs = ${JSON.stringify(posts)}
export const allByCategory = ${JSON.stringify(allPostsByCategory)}
export const seattleLocs = ${JSON.stringify(seattleLocs, null, 2)};
export const seattleByCategory=${JSON.stringify(seattleByCategory)}
export const seWYLocs = ${JSON.stringify(seWYLocs, null, 2)}
export const seWYByCategory=${JSON.stringify(seWYByCategory)}
export const chicagoByCategory=${JSON.stringify(chicagoByCategory)}
export const chicagoLocs = ${JSON.stringify(chicagoLocs, null, 2)}
`;

fs.writeFileSync(`./src/app/lib/MdxQueries.js`, outputData, "utf8");

// For each MDX file, serialize it and write it to public so we can fetch it from the client.
posts.forEach(async (mdx, idx) => {
  // console.log(mdxRemote);
  const serializedContent = await serialize({ source: mdx.content });

  const post = { ...mdx, content: serializedContent };
  fs.writeFileSync(
    `./public/content/generated/${mdx.slug}.json`,
    JSON.stringify(post),
    "utf-8"
  );
});
