import { GetStaticProps } from "next"
import Head from 'next/head'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../components/SectionTitle"
import { OneGrid, FeaturedArticle, TwoGrids } from "../components/PostCard"
import BaseLayout from "../components/BaseLayout"
import Hero from "../components/Hero"
import PodcastCard from "../components/PodcastCard"
import { Content } from "../libs/data-type"
import { readFromFileSystem } from "../libs/file-fetch"

export const getStaticProps: GetStaticProps = async () => {
  const idPosts = await readFromFileSystem(Content.ID)
  const enPosts = await readFromFileSystem(Content.EN)
  const featuredPosts = await readFromFileSystem(Content.FEATURED)

  return {
    props: {
      data: {
        en: enPosts,
        id: idPosts,
        featured: featuredPosts[0],
      },
    },
  }
}

export default function Home(props: any): JSX.Element {
  const { data } = props

  return (
    <BaseLayout>
      <Head>
        <title>Home | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="Home | Asep Bagja" />
        <meta name="og:description" property="og:description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com" />  
        <meta name="twitter:card" content="summary" /> 
        <meta name="twitter:title" content="The Blog of Asep Bagja" />
        <meta name="twitter:description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta property="og:image" content={data.featured.metadata.images[0]} />  
        <meta name="twitter:image" content={data.featured.metadata.images[0]} />   
        <link rel="canonical" href="https://www.asepbagja.com" />
      </Head>
      
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
