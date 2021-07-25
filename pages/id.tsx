import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"
import { GetStaticProps } from "next"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../components/SectionTitle"
import { OneGrid, TwoGrids } from "../components/PostCard"
import BaseLayout from "../components/BaseLayout"

export const getStaticProps: GetStaticProps = async () => {
  const idContentDir = path.join(process.cwd(), "content", "id")
  const idFilenames = await fs.readdir(idContentDir)

  // Mapping the Bahasa Indonesia content here
  const idPosts = idFilenames.map(async (filename) => {
    const filePath = path.join(idContentDir, filename)
    const fileContents = await fs.readFile(filePath, "utf8")
    const content = matter(fileContents)

    return {
      filename,
      language: content?.data?.lang ?? "Bahasa Indonesia",
      slug: content?.data?.slug ?? filename.slice(0, -3),
      date: content?.data?.date,
      metadata: {
        title: content?.data?.title,
        images: content?.data?.images,
        categories: content?.data?.categories,
        aliases: content?.data?.aliases ?? [],
        summary: content?.data?.summary ?? "",
      },
      content: content?.content,
    }
  });

  const id = await Promise.all(idPosts)
  const idSorted = id.sort((a, b) => b.date - a.date).map((post) => {
    post.date = post.date.toLocaleDateString("en-GB")
    return post
  })

  return {
    props: {
      data: idSorted,
    },
  }
}

export default function Home(props: any): JSX.Element {
  const { data } = props

  const ArticleLoop = (posts: any): JSX.Element => {
    const loopComponent = posts.data.map((post: any, index: number) => {
      let component = []
      if (index < 2) {
        component.push(<TwoGrids
          title={post.metadata.title}
          excerpt={post.metadata.summary}
          imageSrc={post.metadata.images[0]}
          imageAlt={`the thumbnail of ${post.metadata.title}`}
          href={`/${post.metadata.categories[0].toLowerCase()}/${post.slug}`}
        />)
      } else {
        component.push(<OneGrid
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
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="Artikel dalam Bahasa Indonesia" showButton={false} />
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