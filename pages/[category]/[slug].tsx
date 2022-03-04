import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Article } from "@/libs/data-type";
import { readFromFileSystem } from "@/libs/file-fetch";
import BaseLayout from "@/components/BaseLayout";
import HtmlContent from "@/components/HtmlContent";
import Discussion from "@/components/Discussion";
import CtaBox from "@/components/CtaBox";
import { capitalize, markdownToHtml } from "@/libs/utilities";

interface PageProps {
  data: Article[];
  locale: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await readFromFileSystem(context.locale);

  const parseMarkdown = async () => {
    return Promise.all(
      posts.map(async (post) => {
        post.content = await markdownToHtml(post.content || "");
        return post;
      })
    );
  };

  const htmlPosts = await parseMarkdown();

  return {
    props: {
      data: htmlPosts,
      locale: context.locale ?? "en",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  let posts = Array<Article>();
  const locales = context.locales ?? "en";
  for (const locale of locales) {
    const data = await readFromFileSystem(locale);
    const postsWithLocale = data.map((post) => {
      post.locale = locale;
      return post;
    });
    posts.concat(postsWithLocale);
  }

  // Join all post array
  const paths = posts.map((post) => {
    return {
      params: {
        category: post.metadata.categories?.[0].toLowerCase(),
        slug: post.slug || "",
      },
      locale: post.locale,
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const ReadingPage: NextPage<PageProps> = ({ data, locale }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { t, lang } = useTranslation();

  const filteredArticles = data?.filter((post: Article) => post.slug === slug);
  const article = filteredArticles?.[0];

  return (
    <BaseLayout>
      <Head>
        <title>{article?.metadata.title} | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={article?.metadata.summary || t("meta:no-description")}
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content={`${article?.metadata.title} | Asep Bagja`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={article?.metadata.summary || t("meta:no-description")}
        />
        <meta property="og:site_name" content={t("meta:sitename")} />
        <meta
          property="og:url"
          content={`https://www.asepbagja.com${
            lang === "en" ? "/" : "/" + lang + "/"
          }${article?.metadata.categories?.[0].toLowerCase()}/${slug}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${article?.metadata.title} | Asep Bagja`}
        />
        <meta
          name="twitter:description"
          content={article?.metadata.summary || t("meta:no-description")}
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
          content={`https://www.asepbagja.com${article?.metadata?.images?.[0]}`}
        />
        <meta
          name="twitter:image"
          content={`https://www.asepbagja.com${article?.metadata?.images?.[0]}`}
        />
        <link
          rel="canonical"
          href={`https://www.asepbagja.com${
            lang === "en" ? "/" : "/" + lang + "/"
          }${article?.metadata?.categories?.[0].toLowerCase()}/${slug}`}
        />
      </Head>

      <main className="mt-5">
        <Container>
          <article>
            <Row>
              <Col lg={{ span: 8, offset: 2 }}>
                <div
                  style={{
                    paddingBottom: 5,
                    borderBottom: "3px solid #343a40",
                  }}
                >
                  <div className="mb-3">
                    <span className="badge bg-dark">
                      {capitalize(article?.metadata.categories?.[0])}
                    </span>
                  </div>
                  <h2>{article?.metadata.title}</h2>
                  <p className="mt-2 fw-lighter fst-italic">
                    {article?.metadata.summary}
                  </p>
                  <p className="fw-lighter lh-1" style={{ fontSize: "0.8rem" }}>
                    <time dateTime={article?.date as string}>
                      {article?.date}
                    </time>
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col lg={{ span: 8, offset: 2 }}>
                <HtmlContent content={article?.content as string} />
              </Col>
            </Row>
          </article>
          <section className="mt-3">
            <Row>
              <Col lg={{ span: 8, offset: 2 }}>
                <CtaBox article={article} />
              </Col>
            </Row>
          </section>
          <section className="mt-3">
            <Row>
              <Col lg={{ span: 8, offset: 2 }}>
                <Discussion article={article} locale={locale} />
              </Col>
            </Row>
          </section>
        </Container>
      </main>
    </BaseLayout>
  );
};

export default ReadingPage;
