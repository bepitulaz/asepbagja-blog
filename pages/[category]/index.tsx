import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import SectionTitle from "@/components/SectionTitle";
import { OneGrid, TwoGrids } from "@/components/PostCard";
import BaseLayout from "@/components/BaseLayout";
import { capitalize } from "@/libs/utilities";
import { Article, CategoryEN, CategoryID } from "@/libs/data-type";
import { readFromFileSystem } from "@/libs/file-fetch";

interface PageProps {
  data: Article[];
  locale: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await readFromFileSystem(context.locale);

  return {
    props: {
      data: posts,
      locale: context.locale ?? "en",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { category: CategoryEN.BUSINESS }, locale: "en" },
      { params: { category: CategoryEN.PERSONAL }, locale: "en" },
      { params: { category: CategoryEN.PROGRAMMING }, locale: "en" },
      { params: { category: CategoryEN.MUSIC }, locale: "en" },
      { params: { category: CategoryEN.ESTONIA }, locale: "en" },
      { params: { category: CategoryID.BUSINESS }, locale: "id" },
      { params: { category: CategoryID.PERSONAL }, locale: "id" },
      { params: { category: CategoryID.PROGRAMMING }, locale: "id" },
      { params: { category: CategoryID.MUSIC }, locale: "id" },
      { params: { category: CategoryID.ESTONIA }, locale: "id" },
    ],
    fallback: true,
  };
};

const CategoryPage: NextPage<PageProps> = ({ data, locale }) => {
  const router = useRouter();
  const { category } = router.query;
  const { t, lang } = useTranslation();
  const langRoute = locale === "en" ? "" : `/${locale}`;

  const postsByCategory = data?.filter((post: Article) => {
    if (typeof category === "string") {
      return post.metadata?.categories?.includes(category);
    }

    return post;
  });

  const ArticleLoop = (posts: any): JSX.Element => {
    const loopComponent = posts.data?.map((post: any, index: number) => {
      let component = [];
      if (index < 2) {
        component.push(
          <TwoGrids
            key={post.slug}
            title={post.metadata.title}
            excerpt={post.metadata.summary}
            imageSrc={post.metadata.images?.[0]}
            imageAlt={`the thumbnail of ${post.metadata.title}`}
            href={`${langRoute}/${post.metadata.categories?.[0].toLowerCase()}/${
              post.slug
            }`}
          />
        );
      } else {
        component.push(
          <OneGrid
            key={post.slug}
            title={post.metadata.title}
            excerpt={post.metadata.summary}
            imageSrc={post.metadata.images?.[0]}
            imageAlt={`the thumbnail of ${post.metadata.title}`}
            href={`${langRoute}/${post.metadata.categories?.[0].toLowerCase()}/${
              post.slug
            }`}
          />
        );
      }

      return component;
    });

    return (
      loopComponent ?? (
        <Col>
          <p className="text-center">No articles are found.</p>
        </Col>
      )
    );
  };

  return (
    <BaseLayout>
      <Head>
        <title>{capitalize(category)} | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={t("meta:description")} />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content={`${capitalize(category)} | Asep Bagja`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={t("meta:description")}
        />
        <meta property="og:site_name" content={t("meta:sitename")} />
        <meta
          property="og:url"
          content={`https://www.asepbagja.com${
            lang === "en" ? "/" : "/" + lang + "/"
          }${category}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${capitalize(category)} | Asep Bagja`}
        />
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
          content={`https://www.asepbagja.com${data?.[0].metadata.images?.[0]}`}
        />
        <meta
          name="twitter:image"
          content={`https://www.asepbagja.com${data?.[0].metadata.images?.[0]}`}
        />
        <link
          rel="canonical"
          href={`https://www.asepbagja.com${
            lang === "en" ? "/" : "/" + lang + "/"
          }${category}`}
        />
      </Head>

      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle={capitalize(category)}
                showButton={false}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <ArticleLoop data={postsByCategory} />
          </Row>
        </Container>
      </section>
    </BaseLayout>
  );
};

export default CategoryPage;
