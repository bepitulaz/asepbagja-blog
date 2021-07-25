import { GetStaticProps } from "next"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import SectionTitle from "../components/SectionTitle"
import { OneGrid, FeaturedArticle, TwoGrids } from "../components/PostCard"
import BaseLayout from "../components/BaseLayout"
import Hero from "../components/Hero"
import PodcastCard from "../components/PodcastCard"

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context)
  return {
    props: {},
  }
}

export default function Home(): JSX.Element {
  return (
    <BaseLayout>
      <Hero />

      {/* Newest article */}
      <FeaturedArticle
        title={"Freelancing atau Membuat Proyek"}
        excerpt={"We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"}
        href={"/"}
        categoryTitle={"Tech"}
        publishedDate={"24 July 2021"}
        language={"English"}
        imageSrc={"/img/blog/photo-1500937386664-56d1dfef3854.jpg"}
        imageAlt={"Featured image"}
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
              imageSrc={"/img/blog/photo-1500937386664-56d1dfef3854.jpg"}
              imageAlt={"Podcast Catatan Asep Bagja"}
              title={"Freelancing atau Membuat Proyek"}
              publishedDate={"23 May 2021"}
              href={"/"}
            />
            <PodcastCard
              imageSrc={"/img/blog/photo-1500937386664-56d1dfef3854.jpg"}
              imageAlt={"Podcast Catatan Asep Bagja"}
              title={"Freelancing atau Membuat Proyek"}
              publishedDate={"23 May 2021"}
              href={"/"}
            />
          </Row>
        </Container>
      </section>

      {/* All articles */}
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="English" buttonTitle="See all" linkHref="/" />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <OneGrid
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
            <OneGrid
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
            <TwoGrids
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
          </Row>
        </Container>
      </section>

      {/* All articles */}
      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle sectionTitle="Bahasa Indonesia" buttonTitle="Lihat" linkHref="/" />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGrids
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
            <OneGrid
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
            <OneGrid
              title="Freelancing atau Membuat Proyek"
              excerpt="We love growing plants, but we–all co-founders of Tanibox–never touch agriculture"
              imageSrc="/img/blog/photo-1500937386664-56d1dfef3854.jpg"
              imageAlt="Article's feature image"
              href="/"
            />
          </Row>
        </Container>
      </section>
    </BaseLayout>
  )
}
