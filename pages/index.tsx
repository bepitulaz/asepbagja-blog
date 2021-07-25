import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"
import { GetStaticProps } from "next"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../components/SectionTitle"
import { OneGrid, FeaturedArticle, TwoGrids } from "../components/PostCard"
import BaseLayout from "../components/BaseLayout"
import Hero from "../components/Hero"
import PodcastCard from "../components/PodcastCard"

export const getStaticProps: GetStaticProps = async () => {
  const enContentDir = path.join(process.cwd(), "content", "en")
  const idContentDir = path.join(process.cwd(), "content", "id")
  const featuredContentDir = path.join(process.cwd(), "content", "featured")

  const enFilenames = await fs.readdir(enContentDir)
  const idFilenames = await fs.readdir(idContentDir)
  const featuredFilenames = await fs.readdir(featuredContentDir)

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

  // Mapping the Indonesia content here
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

  // Mapping the Featured content here
  const featuredPosts = featuredFilenames.map(async (filename) => {
    const filePath = path.join(featuredContentDir, filename)
    const fileContents = await fs.readFile(filePath, "utf8")
    const content = matter(fileContents)

    return {
      filename,
      language: content?.data?.lang ?? "English",
      slug: content?.data?.slug ?? filename.slice(0, -3),
      date: content?.data?.date.toLocaleDateString("en-GB"),
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

  const en = await Promise.all(enPosts)
  const id = await Promise.all(idPosts)
  const featured = await Promise.all(featuredPosts)

  // Sort the posts by date
  const enSorted = en.sort((a, b) => b.date - a.date).map((post) => {
    post.date = post.date.toLocaleDateString("en-GB")
    return post
  })

  const idSorted = id.sort((a, b) => b.date - a.date).map((post) => {
    post.date = post.date.toLocaleDateString("en-GB")
    return post
  })

  return {
    props: {
      data: {
        en: enSorted,
        id: idSorted,
        featured: featured[0],
      },
    },
  }
}

export default function Home(props: any): JSX.Element {
  const { data } = props

  return (
    <BaseLayout>
      <Hero />

      {/* Newest article */}
      <FeaturedArticle
        title={data.featured.metadata.title}
        excerpt={data.featured.metadata.summary}
        href={`/${data.featured.metadata.categories[0]}/${data.featured.slug}`}
        categoryTitle={data.featured.metadata.categories[0].toLowerCase()}
        publishedDate={data.featured.date}
        language={data.featured.language}
        imageSrc={data.featured.metadata.images[0]}
        imageAlt={`the thumbnail of ${data.featured.metadata.title}`}
      />

      {/* Latest Podcasts */}
      <section className="mt-5 py-5 red-section">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="Podcasts" bsTextColourClass="text-white" showButton={false} />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <PodcastCard
              imageSrc={"/images/asep-talks.png"}
              imageAlt={"Podcast Catatan Asep Bagja cover art"}
              title={"Catatan Asep Bagja"}
              summary={"My solo podcast in Bahasa Indonesia. I talk various topics such as programming, finance, and hobby."}
              href={"https://open.spotify.com/show/0e3qAxJ8c7j4noDX9birAp?si=gabJYhhcSKGM_BZ4D040zA&dl_branch=1"}
            />
            <PodcastCard
              imageSrc={"/images/ngopini-sejenak.png"}
              imageAlt={"Ngopini sejenak cover art"}
              title={"Ngopini Sejenak"}
              summary={"We talk about various topics in the adult life. I co-host it with my wife, Retno, in Bahasa Indonesia."}
              href={"https://open.spotify.com/show/12NnDN0zkmAFM6NNYmt8dh?si=iwW08XDOSqaYcWjGjii_eQ&dl_branch=1"}
            />
            <PodcastCard
              imageSrc={"/images/Ujung_CoverArt.png"}
              imageAlt={"Podcast Ujung Ke Ujung cover art"}
              title={"Ujung Ke Ujung"}
              summary={"We talk about career in IT industry in Bahasa Indonesia. Co-host: Radita Liem and I."}
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
              <SectionTitle sectionTitle="English" buttonTitle="See all" linkHref="/en" />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <OneGrid
              title={data.en[0].metadata.title}
              excerpt={data.en[0].metadata.summary}
              imageSrc={data.en[0].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.en[0].metadata.title}`}
              href={`/${data.en[0].metadata.categories[0].toLowerCase()}/${data.en[0].slug}`}
            />
            <OneGrid
              title={data.en[1].metadata.title}
              excerpt={data.en[1].metadata.summary}
              imageSrc={data.en[1].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.en[0].metadata.title}`}
              href={`/${data.en[1].metadata.categories[0].toLowerCase()}/${data.en[1].slug}`}
            />
            <TwoGrids
              title={data.en[2].metadata.title}
              excerpt={data.en[2].metadata.summary}
              imageSrc={data.en[2].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.en[0].metadata.title}`}
              href={`/${data.en[2].metadata.categories[0].toLowerCase()}/${data.en[2].slug}`}
            />
          </Row>
        </Container>
      </section>

      {/* All articles */}
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="Bahasa Indonesia" buttonTitle="Lihat" linkHref="/id" />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGrids
              title={data.id[0].metadata.title}
              excerpt={data.id[0].metadata.summary}
              imageSrc={data.id[0].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.id[0].metadata.title}`}
              href={`/${data.id[0].metadata.categories[0].toLowerCase()}/${data.id[0].slug}`}
            />
            <OneGrid
              title={data.id[1].metadata.title}
              excerpt={data.id[1].metadata.summary}
              imageSrc={data.id[1].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.id[0].metadata.title}`}
              href={`/${data.id[1].metadata.categories[0].toLowerCase()}/${data.id[1].slug}`}
            />
            <OneGrid
              title={data.id[2].metadata.title}
              excerpt={data.id[2].metadata.summary}
              imageSrc={data.id[2].metadata.images[0]}
              imageAlt={`the thumbnail of ${data.id[0].metadata.title}`}
              href={`/${data.id[2].metadata.categories[0].toLowerCase()}/${data.id[2].slug}`}
            />
          </Row>
        </Container>
      </section>
    </BaseLayout>
  )
}
