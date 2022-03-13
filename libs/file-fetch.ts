import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { Feed } from "feed";
import { Article } from "./data-type";
import { markdownToRSS, getFirstParagraph } from "./utilities";

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

export function generateRSSFeed(articles: Array<Article>, locale: string) {
  const baseUrl = "https://www.asepbagja.com";
  const author = {
    name: "Asep Bagja Priandana",
    email: "asep.bagja.p@gmail.com",
    link: "https://twitter.com/bepitulaz",
  };
  let date = new Date();

  const titleEN = "The blog of Asep Bagja";
  const titleID = "Blog Asep Bagja";
  const descriptionEN =
    "My personal blog where I share my opinion and topic that I'm interested.";
  const descriptionID =
    "Blog pribadi tempat saya berbagi pendapat dan topik menarik yang saya sukai.";
  const ctaEN = "Read full article on Asep Bagja's blog";
  const ctaID = "Baca selengkapnya di blog Asep Bagja";

  const header = {
    title: locale === "id" ? titleID : titleEN,
    description: locale === "id" ? descriptionID : descriptionEN,
    id: baseUrl,
    link: baseUrl,
    language: locale, // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved 2014-${date.getFullYear()}, ${author.name}`,
    updated: date, // optional, default = today
    generator: locale === "id" ? titleID : titleEN, // optional, default = 'Feed for Node.js'
    feedLinks: {
      rss2: `${baseUrl}/${locale}-rss.xml`,
    },
    author,
  };
  const feed = new Feed(header);

  const generateItems = async () => {
    for (const article of articles) {
      const category = article.metadata?.categories?.[0] || "";

      const dateSplit = article.date.split("/");
      const year = parseInt(dateSplit[2]);
      const month = parseInt(dateSplit[1]);
      const day = parseInt(dateSplit[0]);
      date = new Date(year, month, day);

      const articleUrl = `${baseUrl}/${category.toLowerCase()}/${article.slug}`;
      const content = (await markdownToRSS(article?.content)) || "";
      const firstParagrah = getFirstParagraph(content);
      const contentWithCTA = `${firstParagrah} <p><a href="${articleUrl}">${locale === "id" ? ctaID : ctaEN}</a></p>`;

      const post = {
        title: article.metadata?.title || "",
        id: articleUrl,
        link: articleUrl,
        description: article.metadata?.summary || "",
        content: contentWithCTA,
        author: [author],
        date,
      };

      feed.addItem(post);
    }

    // Write the RSS output to a public file
    fs.writeFile(`public/${locale}-rss.xml`, feed.rss2());
  };

  generateItems();
}
