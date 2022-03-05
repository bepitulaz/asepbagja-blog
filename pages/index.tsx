import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { FeaturedArticle } from "@/components/PostCard";
import BaseLayout from "@/components/BaseLayout";
import Hero from "@/components/Hero";
import { Article } from "@/libs/data-type";
import HomeEnglishLayout from "@/components/HomeEnglishLayout";
import HomeIndonesiaLayout from "@/components/HomeIndonesiaLayout";
import { readFromFileSystem, generateRSSFeed } from "@/libs/file-fetch";

interface PageProps {
  posts: Article[];
  locale: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await readFromFileSystem(context.locale);

  generateRSSFeed(posts);

  return {
    props: {
      posts,
      locale: context.locale,
    },
  };
};

const Home: NextPage<PageProps> = ({ posts, locale }) => {
  const { t, lang } = useTranslation();
  const [featuredPost] = posts.filter((post) => post.metadata.featured);

  return (
    <BaseLayout>
      <Head>
        <title>{t("meta:home")} | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={t("meta:description")} />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content={`${t("meta:home")} | Asep Bagja`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={t("meta:description")}
        />
        <meta property="og:site_name" content={t("meta:sitename")} />
        <meta property="og:url" content="https://www.asepbagja.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t("meta:title")} />
        <meta name="twitter:description" content={t("meta:description")} />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          property="og:image"
          content={`https://www.asepbagja.com${featuredPost.metadata.images[0]}`}
        />
        <meta
          name="twitter:image"
          content={`https://www.asepbagja.com${featuredPost.metadata.images[0]}`}
        />
        <link
          rel="canonical"
          href={`https://www.asepbagja.com${lang === "en" ? "" : "/" + lang}`}
        />
      </Head>

      <Hero />

      <FeaturedArticle
        title={featuredPost.metadata.title}
        excerpt={featuredPost.metadata.summary}
        href={`${locale === "en" ? "" : "/" + locale}/${featuredPost.metadata.categories[0].toLowerCase()}/${
          featuredPost.slug
        }`}
        categoryTitle={featuredPost.metadata.categories[0]}
        publishedDate={featuredPost.date}
        imageSrc={featuredPost.metadata.images[0]}
        imageAlt={`the thumbnail of ${featuredPost.metadata.title}`}
      />

      {/* Recent articles */}
      {lang === "id" ? (
        <HomeIndonesiaLayout posts={posts} />
      ) : (
        <HomeEnglishLayout posts={posts} />
      )}
    </BaseLayout>
  );
};

export default Home;
