import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import SectionTitle from "@/components/SectionTitle";
import { OneGrid, FeaturedArticle, TwoGrids } from "@/components/PostCard";
import BaseLayout from "@/components/BaseLayout";
import Hero from "@/components/Hero";
import PodcastCard from "@/components/PodcastCard";
import { Article, CategoryEN, CategoryID } from "@/libs/data-type";
import { readFromFileSystem, generateRSSFeed } from "@/libs/file-fetch";
import { ReactElement } from "react";

interface PageProps {
  posts: Article[];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await readFromFileSystem(context.locale);

  generateRSSFeed(posts);

  return {
    props: {
      posts
    },
  };
};

const Home: NextPage<PageProps> = ({ posts }) => {
  const { t, lang } = useTranslation();

  const businessText = t("common:business");
  const musicText = t("common:music");
  const programmingText = t("common:programming");
  const estoniaText = t("common:estonia");
  const personalText = t("common:personal");
  const seeAllText = t("common:see-all");

  const businessRoute = lang === "id" ? `/${CategoryID.BUSINESS}` : `/${CategoryEN.BUSINESS}`;
  const musicRoute = lang === "id" ? `/${CategoryID.MUSIC}` : `/${CategoryEN.MUSIC}`;
  const programmingRoute = lang === "id" ? `/${CategoryID.PROGRAMMING}` : `/${CategoryEN.PROGRAMMING}`;
  const estoniaRoute = lang === "id" ? `/${CategoryID.ESTONIA}` : `/${CategoryEN.ESTONIA}`;
  const personalRoute = lang === "id" ? `/${CategoryID.PERSONAL}` : `/${CategoryEN.PERSONAL}`;

  const [featuredPost] = posts.filter((post) => post.metadata.featured);
  const programmingPosts = posts.filter((post) => {
    const isCategoryEN = post.metadata.categories.includes(CategoryEN.PROGRAMMING);
    const isCategoryID = post.metadata.categories.includes(CategoryID.PROGRAMMING);
    return !post.metadata.featured && (isCategoryEN || isCategoryID);
  });
  const personalPosts = posts.filter((post) => {
    const isCategoryEN = post.metadata.categories.includes(CategoryEN.PERSONAL);
    const isCategoryID = post.metadata.categories.includes(CategoryID.PERSONAL);
    return !post.metadata.featured && (isCategoryEN || isCategoryID);
  });

  return (
    <BaseLayout>
      <Head>
        <title>Home | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="Home | Asep Bagja" />
        <meta
          name="og:description"
          property="og:description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="The Blog of Asep Bagja" />
        <meta
          name="twitter:description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
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
        <link rel="canonical" href="https://www.asepbagja.com" />
      </Head>

      <Hero />

      {/* Newest article */}
      <FeaturedArticle
        title={featuredPost.metadata.title}
        excerpt={featuredPost.metadata.summary}
        href={`/${featuredPost.metadata.categories[0].toLowerCase()}/${
          featuredPost.slug
        }`}
        categoryTitle={featuredPost.metadata.categories[0]}
        publishedDate={featuredPost.date}
        imageSrc={featuredPost.metadata.images[0]}
        imageAlt={`the thumbnail of ${featuredPost.metadata.title}`}
      />

      {/* Latest Podcasts */}
      <section className="mt-5 py-5 red-section">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle="Podcasts"
                bsTextColourClass="text-white"
                showButton={false}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <PodcastCard
              imageSrc={"/images/asep-talks.png"}
              imageAlt={"Podcast Catatan Asep Bagja cover art"}
              title={"Catatan Asep Bagja"}
              summary={
                "My solo podcast in Bahasa Indonesia. I talk various topics such as programming, finance, and hobby."
              }
              href={
                "https://open.spotify.com/show/0e3qAxJ8c7j4noDX9birAp?si=gabJYhhcSKGM_BZ4D040zA&dl_branch=1"
              }
            />
            <PodcastCard
              imageSrc={"/images/ngopini-sejenak.png"}
              imageAlt={"Ngopini sejenak cover art"}
              title={"Ngopini Sejenak"}
              summary={
                "We talk about various topics in the adult life. I co-host it with my wife, Retno, in Bahasa Indonesia."
              }
              href={
                "https://open.spotify.com/show/12NnDN0zkmAFM6NNYmt8dh?si=iwW08XDOSqaYcWjGjii_eQ&dl_branch=1"
              }
            />
            <PodcastCard
              imageSrc={"/images/Ujung_CoverArt.png"}
              imageAlt={"Podcast Ujung Ke Ujung cover art"}
              title={"Ujung Ke Ujung"}
              summary={
                "We talk about career in IT industry in Bahasa Indonesia. Co-host: Radita Liem and I."
              }
              href={"https://ujung.ee"}
            />
          </Row>
        </Container>
      </section>

      {/* All articles */}
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle={programmingText}
                buttonTitle={seeAllText}
                linkHref={programmingRoute}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            {twoGridsRight(programmingPosts.slice(0, 3))}
          </Row>
        </Container>
      </section>

      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle={personalText}
                buttonTitle={seeAllText}
                linkHref={personalRoute}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            {twoGridsLeft(personalPosts.slice(0, 3))}
          </Row>
        </Container>
      </section>
    </BaseLayout>
  );
}

const twoGridsRight = (posts: Article[]): Array<ReactElement> => {
  return posts.map((post, index) => index === 2 ? (
    <TwoGrids
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`the thumbnail of ${post.metadata.title}`}
      href={`/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ) : (
    <OneGrid
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`the thumbnail of ${post.metadata.title}`}
      href={`/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ));
};

const twoGridsLeft = (posts: Article[]): Array<ReactElement> => {
  return posts.map((post, index) => index === 0 ? (
    <TwoGrids
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`the thumbnail of ${post.metadata.title}`}
      href={`/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ) : (
    <OneGrid
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`the thumbnail of ${post.metadata.title}`}
      href={`/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ));
};

export default Home;
