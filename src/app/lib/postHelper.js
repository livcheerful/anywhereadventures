import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Path to the posts directory
const postsDirectory = "./src/app/content";

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Use gray-matter to separate front matter and content
    const { data, content } = matter(fileContents);

    return {
      slug: fileName.replace(/\.mdx$/, ""),
      content, // Only the content (no front matter)
      ...data, // Include front matter as needed for SEO or sorting
    };
  });

  return allPosts;
}

export function getPostBySlug(slug) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  fs.readFileSync(filePath);
  const fileContents = fs.readFileSync(filePath, "utf8");
  // Use gray-matter to separate front matter and content
  const { data, content } = matter(fileContents);

  return {
    slug: slug,
    content, // Only the content (no front matter)
    ...data, // Include front matter as needed for SEO or sorting
  };
}
