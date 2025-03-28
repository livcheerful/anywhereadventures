import { serialize } from "next-mdx-remote-client/serialize";
import matter from "gray-matter";
import { tagsByCity } from "./src/app/content/meta.js";
import * as fs from "fs";

const postsDirectory = "./src/app/content";

function getAllPosts() {
  let fileNames = fs.readdirSync(postsDirectory);
  fileNames = fileNames.filter((s) => {
    return s != "meta.js";
  });

  const allPosts = fileNames.map((fileName) => {
    const filePath = `${postsDirectory}/${fileName}`;
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    return {
      slug: fileName.replace(/\.mdx$/, ""),
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
const byCategory = splitPostsByCategory(seattleLocs, "Seattle");

const outputData = `
// This is the dynamically generated file
export const seattleLocs = ${JSON.stringify(seattleLocs, null, 2)};
export const allSlugs = ${JSON.stringify(posts.map((p) => p.slug))}
export const seattleByCategory=${JSON.stringify(byCategory)}
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
