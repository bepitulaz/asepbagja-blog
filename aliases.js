const { promises } = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Read all content and search the aliases path
// Calling it in next.config.js
async function readFromFileSystem(langCode) {
  const contentDir = path.join(process.cwd(), "content", langCode);
  const filenames = await promises.readdir(contentDir);

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(contentDir, filename);
    const fileContents = await promises.readFile(filePath, "utf8");
    const content = matter(fileContents);

    let longNameLang = "English";
    if (langCode == "id") {
      longNameLang = "Bahasa Indonesia";
    }

    const post = {
      filename,
      language: content?.data?.lang ?? longNameLang,
      slug: content?.data?.slug ?? filename.slice(0, -3),
      date: content?.data?.date,
      metadata: {
        title: content?.data?.title,
        images: content?.data?.images,
        categories: content?.data?.categories,
        aliases: content?.data?.aliases ?? [],
        summary: content?.data?.summary ?? "",
      },
      content: content?.content,
    };

    return post;
  });

  const articles = await Promise.all(posts);
  const sortedArticle = articles
    .sort((a, b) => {
      const bDate = b.date;
      const aDate = a.date;
      return bDate - aDate;
    })
    .map((post) => {
      const postDate = post?.date;
      post.date = postDate?.toLocaleDateString("en-GB");
      return post;
    });

  return sortedArticle;
}

module.exports = {
  readFromFileSystem,
};
