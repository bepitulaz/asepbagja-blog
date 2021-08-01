import { GetStaticProps } from "next"
import Head from "next/head"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../components/SectionTitle"
import { OneGrid, TwoGrids } from "../components/PostCard"
import BaseLayout from "../components/BaseLayout"
import { readFromFileSystem } from "../libs/file-fetch"
import { Content } from "../libs/data-type"

export const getStaticProps: GetStaticProps = async () => {
  const posts = await readFromFileSystem(Content.EN)

  return {
    props: {
      data: posts,
    },
  }
}

export default function EnglishPage(props: any): JSX.Element {
  const { data } = props

  const ArticleLoop = (posts: any): JSX.Element => {
    const loopComponent = posts.data.map((post: any, index: number) => {
      let component = []
      if (index < 2) {
        component.push(<TwoGrids
          key={post.slug}
          title={post.metadata.title}
          excerpt={post.metadata.summary}
          imageSrc={post.metadata.images[0]}
          imageAlt={`the thumbnail of ${post.metadata.title}`}
          href={`/${post.metadata.categories[0].toLowerCase()}/${post.slug}`}
        />)
      } else {
        component.push(<OneGrid
          key={post.slug}
          title={post.metadata.title}
          excerpt={post.metadata.summary}
          imageSrc={post.metadata.images[0]}
          imageAlt={`the thumbnail of ${post.metadata.title}`}
          href={`/${post.metadata.categories[0].toLowerCase()}/${post.slug}`}
        />)
      }

      return component
    })

    return loopComponent
  }

  return (
    <BaseLayout>
      <Head>
        <title>English | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="English | Asep Bagja" />
        <meta name="og:description" property="og:description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com/en" />  
        <meta name="twitter:card" content="summary" /> 
        <meta name="twitter:title" content="English | Asep Bagja" />
        <meta name="twitter:description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:image" content={`https://www.asepbagja.com${data[0].metadata.images[0]}`} />  
        <meta name="twitter:image" content={`https://www.asepbagja.com${data[0].metadata.images[0]}`} />   
        <link rel="canonical" href="https://www.asepbagja.com/en" />
      </Head>
      
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="Articles in English" showButton={false} />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <ArticleLoop data={data} />
          </Row>
        </Container>
      </section>
    </BaseLayout>
  )
}