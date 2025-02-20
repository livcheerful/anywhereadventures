import { serialize } from "next-mdx-remote-client/serialize";
import matter from "gray-matter";
import * as fs from "fs";

const postsDirectory = "./src/app/content";

function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

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

const posts = getAllPosts();
const seattleLocs = getAllPostsByLocation(posts, "Seattle");

const outputData = `
// This is the dynamically generated file
export const seattleLocs = ${JSON.stringify(seattleLocs, null, 2)};
export const allSlugs = ${JSON.stringify(posts.map((p) => p.slug))}
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
