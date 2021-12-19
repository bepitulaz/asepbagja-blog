import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Content, Article, Language } from "@/libs/data-type";
import { readFromFileSystem } from "@/libs/file-fetch";
import BaseLayout from "@/components/BaseLayout";
import HtmlContent from "@/components/HtmlContent";
import Discussion from "@/components/Discussion";
import { capitalize, markdownToHtml } from "@/libs/utilities";

interface PageProps {
  data: Article[];
}

export const getStaticProps: GetStaticProps = async () => {
  const idPosts = await readFromFileSystem(Content.ID);
  const enPosts = await readFromFileSystem(Content.EN);
  const featuredPosts = await readFromFileSystem(Content.FEATURED);

  const posts = idPosts.concat(enPosts).concat(featuredPosts);

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
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const idPosts = await readFromFileSystem(Content.ID);
  const enPosts = await readFromFileSystem(Content.EN);
  const featuredPosts = await readFromFileSystem(Content.FEATURED);

  // Join all post array
  const posts = idPosts.concat(enPosts).concat(featuredPosts);
  const paths = posts.map((post) => {
    return {
      params: {
        category: post.metadata.categories?.[0].toLowerCase(),
        slug: post.slug || "",
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

const ReadingPage: NextPage<PageProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const { slug } = router.query;

  const filteredArticles = data?.filter((post: Article) => post.slug === slug);
  const article = filteredArticles?.[0];

  return (
    <BaseLayout>
      <Head>
        <title>{article?.metadata.title} | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={article?.metadata.summary || "No description is provided."} />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content={`${article?.metadata.title} | Asep Bagja`}
        />
        <meta
          name="og:description"
          property="og:description"
          content={article?.metadata.summary || "No description is provided."}
        />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta
          property="og:url"
          content={`https://www.asepbagja.com/${article?.metadata.categories?.[0].toLowerCase()}/${slug}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`${article?.metadata.title} | Asep Bagja`}
        />
        <meta name="twitter:description" content={article?.metadata.summary || "No description is provided."} />
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
          href={`https://www.asepbagja.com/${article?.metadata?.categories?.[0].toLowerCase()}/${slug}`}
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
                    <time dateTime={article?.date as string}>{article?.date}</time>
                    {" | "}
                    <span>Language: {article?.language}</span>
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col lg={{ span: 8, offset: 2 }}>
                <HtmlContent content={article.content as string} />
              </Col>
            </Row>
          </article>
          <section className="mt-5">
            <Row>
              <Col lg={{ span: 8, offset: 2 }}>
                <Discussion article={article} />
              </Col>
            </Row>
          </section>
        </Container>
      </main>
    </BaseLayout>
  );
}

export default ReadingPage;
