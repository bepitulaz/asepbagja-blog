import { NextPage, GetServerSideProps } from "next";
import { Article, CategoryEN, CategoryID } from "@/libs/data-type";
import { readFromFileSystem } from "@/libs/file-fetch";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL = "https://www.asepbagja.com";

  const staticPaths = [
    `${BASE_URL}/about`,
    `${BASE_URL}/id/tentang`,
    `${BASE_URL}/${CategoryEN.BUSINESS}`,
    `${BASE_URL}/${CategoryEN.ESTONIA}`,
    `${BASE_URL}/${CategoryEN.MUSIC}`,
    `${BASE_URL}/${CategoryEN.PERSONAL}`,
    `${BASE_URL}/${CategoryEN.PROGRAMMING}`,
    `${BASE_URL}/id/${CategoryID.BUSINESS}`,
    `${BASE_URL}/id/${CategoryID.ESTONIA}`,
    `${BASE_URL}/id/${CategoryID.MUSIC}`,
    `${BASE_URL}/id/${CategoryID.PERSONAL}`,
    `${BASE_URL}/id/${CategoryID.PROGRAMMING}`,
  ];

  let posts = Array<Article>();
  const locales = context.locales ?? "en";
  for (const locale of locales) {
    const data = await readFromFileSystem(locale);
    const postsWithLocale = data.map((post) => {
      post.locale = locale;
      return post;
    });
    posts = posts.concat(postsWithLocale);
  }

  // Join all post array
  const dynamicPaths = posts.map((post) => {
    const locale = post.locale === "id" ? `/${post.locale}` : "";
    return `${BASE_URL}${locale}/${post.metadata.categories?.[0].toLowerCase()}/${post.slug}`;
  });

  const allPaths = [...staticPaths, ...dynamicPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allPaths
      .map((url) => {
        return `
          <url>
            <loc>${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>
        `;
      })
      .join("")}
    </urlset>
  `;

  context.res.setHeader("Content-Type", "text/xml");
  context.res.write(sitemap);
  context.res.end();

  return {
    props: {},
  };
};

const Sitemap: NextPage = () => null;

export default Sitemap;
