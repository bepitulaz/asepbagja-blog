import { GetStaticProps, GetStaticPaths } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
import { Content, Article } from "../../libs/data-type"
import { readFromFileSystem } from "../../libs/file-fetch"
import BaseLayout from "../../components/BaseLayout"
import HtmlContent from "../../components/HtmlContent"
import { capitalize, markdownToHtml } from "../../libs/utilities"

export const getStaticProps: GetStaticProps = async () => {
  const idPosts = await readFromFileSystem(Content.ID)
  const enPosts = await readFromFileSystem(Content.EN)
  const featuredPosts = await readFromFileSystem(Content.FEATURED)

  const posts = idPosts.concat(enPosts).concat(featuredPosts)

  const parseMarkdown = async () => {
    return Promise.all(posts.map(async (post) => {
      post.content = await markdownToHtml(post.content || "")
      return post
    }))
  }
  
  const htmlPosts = await parseMarkdown()

  return {
    props: {
      data: htmlPosts,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const idPosts = await readFromFileSystem(Content.ID)
  const enPosts = await readFromFileSystem(Content.EN)
  const featuredPosts = await readFromFileSystem(Content.FEATURED)

  // Join all post array
  const posts = idPosts.concat(enPosts).concat(featuredPosts)
  const paths = posts.map((post) => {
    return {
      params: {
        category: post.metadata.categories?.[0].toLowerCase(),
        slug: post.slug || "", 
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export default function ReadingPage(props: any): JSX.Element {
  const { data } = props
  const router = useRouter()
  const { slug } = router.query
  
  const filteredArticles = data.filter((post: Article) => post.slug === slug)
  const { metadata, date, language, content } = filteredArticles?.[0]

  return (
    <BaseLayout>
      <Head>
        <title>{metadata.title} | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.summary} />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content={`${metadata.title} | Asep Bagja`} />
        <meta name="og:description" property="og:description" content={metadata.summary} />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com" />  
        <meta name="twitter:card" content="summary" /> 
        <meta name="twitter:title" content={`${metadata.title} | Asep Bagja`} />
        <meta name="twitter:description" content={metadata.summary} />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta property="og:image" content={metadata.images[0]} />  
        <meta name="twitter:image" content={metadata.images[0]} />   
        <link rel="canonical" href={`https://www.asepbagja.com/${metadata.categories?.[0]}/${slug}`} />
      </Head>
      
      <main className="mt-5">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>
              <div style={{ paddingBottom: 5, borderBottom: "3px solid #343a40" }}>
                <div className="mb-3">
                  <span className="badge bg-dark">{capitalize(metadata.categories?.[0])}</span>
                </div>
                <h2>{metadata.title}</h2>
                <p className="mt-2 fw-lighter fst-italic">{metadata.summary}</p>
                <p className="fw-lighter lh-1" style={{ fontSize: "0.8rem" }}>{date} | Language: {language}</p>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={{ span: 8, offset: 2 }}>
              <HtmlContent content={content} />
            </Col>
          </Row>
        </Container>
      </main>
    </BaseLayout>
  )
}
