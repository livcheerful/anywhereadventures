const fs = require("fs");
const matter = require("gray-matter");
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
