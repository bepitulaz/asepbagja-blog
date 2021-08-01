import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"
import { GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../../components/SectionTitle"
import { OneGrid, TwoGrids } from "../../components/PostCard"
import BaseLayout from "../../components/BaseLayout"
import { capitalize } from "../../libs/utilities"
import { Article } from "../../libs/data-type"

export const getStaticProps: GetStaticProps = async () => {
  const idContentDir = path.join(process.cwd(), "content", "id")
  const enContentDir = path.join(process.cwd(), "content", "en")
  const idFilenames = await fs.readdir(idContentDir)
  const enFilenames = await fs.readdir(enContentDir)

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

  // Mapping the English content here
  const enPosts = enFilenames.map(async (filename) => {
    const filePath = path.join(enContentDir, filename)
    const fileContents = await fs.readFile(filePath, "utf8")
    const content = matter(fileContents)

    return {
      filename,
      language: content?.data?.lang ?? "English",
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

  const en = await Promise.all(enPosts)
  const enSorted = en.sort((a, b) => b.date - a.date).map((post) => {
    post.date = post.date.toLocaleDateString("en-GB")
    return post
  })

  return {
    props: {
      data: enSorted.concat(idSorted),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { category: "business" }},
      { params: { category: "personal" }},
      { params: { category: "programming" }},
    ],
    fallback: true,
  }
}

export default function CategoryPage(props: any): JSX.Element {
  const { data } = props
  const router = useRouter()
  const { category } = router.query

  const postsByCategory = data.filter((post: Article) => {
    const capitalCategory = capitalize(category)

    if (typeof capitalCategory === "string") {
      return post.metadata?.categories?.includes(capitalCategory)
    }

    return post
  })

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
  )
}
