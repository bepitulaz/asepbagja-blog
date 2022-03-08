import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { Feed } from "feed";
import { Article } from "./data-type";
import { markdownToHtml } from "./utilities";

// Get all contents from the file system
export async function readFromFileSystem(langCode: string | undefined) {
  const lang = langCode || "en";
  const contentDir = path.join(process.cwd(), "content", lang);
  const filenames = await fs.readdir(contentDir);
  const posts = filenames.map(async (filename) => {
    const filePath = path.join(contentDir, filename);
    const fileContents = await fs.readFile(filePath, "utf8");
    const content = matter(fileContents);

    const post: Article = {
      filename,
      slug: content?.data?.slug ?? filename.slice(0, -3),
      date: content?.data?.date,
      metadata: {
        title: content?.data?.title,
        images: content?.data?.images,
        categories: content?.data?.categories.map((category: string) =>
          category.toLowerCase()
        ),
        aliases: content?.data?.aliases ?? [],
        summary: content?.data?.summary ?? "",
        featured: content?.data?.featured ?? false,
      },
      content: content?.content,
    };

    return post;
  });

  const articles = await Promise.all(posts);
  const sortedArticle = articles
    .sort((a, b) => {
      const bDate = b.date as any;
      const aDate = a.date as any;
      return bDate - aDate;
    })
    .map((post) => {
      const postDate = post?.date as any;
      post.date = postDate?.toLocaleDateString("en-GB");
      return post;
    });

  return sortedArticle;
}

export function generateRSSFeed(articles: Array<Article>) {
  const baseUrl = "https://www.asepbagja.com";
  const author = {
    name: "Asep Bagja Priandana",
    email: "asep.bagja.p@gmail.com",
    link: "https://twitter.com/bepitulaz",
  };
  let date = new Date();

  const feed = new Feed({
    title: "The blog of Asep Bagja",
    description:
      "The personal blog where Asep shares his opinion and topic that he is interested.",
    id: baseUrl,
    link: baseUrl,
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved 2014-${date.getFullYear()}, ${author.name}`,
    updated: date, // optional, default = today
    generator: "The blog of Asep Bagja", // optional, default = 'Feed for Node.js'
    feedLinks: {
      rss2: `${baseUrl}/rss.xml`,
    },
    author,
  });

  const generateItems = async () => {
    for (const article of articles) {
      const category = article.metadata?.categories?.[0] || "";

      if (article.date) {
        const dateSplit = article.date.split("/");
        const year = parseInt(dateSplit[2]);
        const month = parseInt(dateSplit[1]);
        const day = parseInt(dateSplit[0]);
        date = new Date(year, month, day);
      }

      feed.addItem({
        title: article.metadata?.title || "",
        id: `${baseUrl}/${category.toLowerCase()}/${article.slug}`,
        link: `${baseUrl}/${category.toLowerCase()}/${article.slug}`,
        description: article.metadata?.summary || "",
        content: (await markdownToHtml(article?.content)) || "",
        author: [author],
        date: article?.date ? new Date(article.date) : date,
      });
    }

    // Write the RSS output to a public file
    fs.writeFile("public/rss.xml", feed.rss2());
  };

  generateItems();
}
