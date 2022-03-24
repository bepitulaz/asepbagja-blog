import { FunctionComponent, ReactElement } from "react";
import useTranslation from "next-translate/useTranslation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import SectionTitle from "@/components/SectionTitle";
import PodcastCard from "@/components/PodcastCard";
import { OneGrid, TwoGrids } from "@/components/PostCard";
import { Article, CategoryID } from "@/libs/data-type";

interface LayoutProps {
  posts: Article[];
}

const HomeIndonesiaLayout: FunctionComponent<LayoutProps> = ({ posts }): ReactElement => {
  const { t } = useTranslation();

  const businessText = t("common:business");
  const estoniaText = t("common:estonia");
  const personalText = t("common:personal");
  const seeAllText = t("common:see-all");

  const estoniaPosts = posts.filter((post) => {
    const isCategoryExist = post.metadata.categories.includes(CategoryID.ESTONIA);
    return !post.metadata.featured && isCategoryExist;
  });
  const personalPosts = posts.filter((post) => {
    const isCategoryExist = post.metadata.categories.includes(CategoryID.PERSONAL);
    return !post.metadata.featured && isCategoryExist;
  });

  return (
    <>
      {/* Latest Podcasts */}
      <section className="mt-5 py-5 red-section">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle="Podcasts"
                bsTextColourClass="text-white"
                showButton={false}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <PodcastCard
              imageSrc={"/images/asep-talks.png"}
              imageAlt={"Podcast Catatan Asep Bagja cover art"}
              title={"Catatan Asep Bagja"}
              summary={
                "Solo podcast di mana saya berbicara aneka macam topik yang saya senangi."
              }
              href={
                "https://open.spotify.com/show/0e3qAxJ8c7j4noDX9birAp?si=gabJYhhcSKGM_BZ4D040zA&dl_branch=1"
              }
            />
            <PodcastCard
              imageSrc={"/images/ngopini-sejenak.png"}
              imageAlt={"Ngopini sejenak cover art"}
              title={"Ngopini Sejenak"}
              summary={
                "Sebuah podcast bersama istri saya, Retno, yang berisi soal kehidupan orang dewasa."
              }
              href={
                "https://open.spotify.com/show/12NnDN0zkmAFM6NNYmt8dh?si=iwW08XDOSqaYcWjGjii_eQ&dl_branch=1"
              }
            />
            <PodcastCard
              imageSrc={"/images/Ujung_CoverArt.png"}
              imageAlt={"Podcast Ujung Ke Ujung cover art"}
              title={"Ujung Ke Ujung"}
              summary={
                "Membicarakan karir di industri IT. Co-hosting: Radita Liem, peneliti di bidang komputasi performa tinggi."
              }
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
              <SectionTitle
                sectionTitle={estoniaText}
                buttonTitle={seeAllText}
                linkHref={`/${CategoryID.ESTONIA}`}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGridsRight posts={estoniaPosts.slice(0, 3)} />
          </Row>
        </Container>
      </section>

      <section className="mt-5 pt-3">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle={personalText}
                buttonTitle={seeAllText}
                linkHref={`/${CategoryID.PERSONAL}`}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGridsLeft posts={personalPosts.slice(0, 3)} />
          </Row>
        </Container>
      </section>
    </>
  );
}

const TwoGridsRight: FunctionComponent<LayoutProps> = ({ posts }): ReactElement => {
  const components = posts.map((post, index) => index === 2 ? (
    <TwoGrids
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`Foto artikel: ${post.metadata.title}`}
      href={`/id/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ) : (
    <OneGrid
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`Foto artikel ${post.metadata.title}`}
      href={`/id/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ));
  return (
    <>
      {components}
    </>
  );
};

const TwoGridsLeft: FunctionComponent<LayoutProps> = ({ posts }): ReactElement => {
  const components = posts.map((post, index) => index === 0 ? (
    <TwoGrids
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`Foto artikel ${post.metadata.title}`}
      href={`/id/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ) : (
    <OneGrid
      key={index}
      title={post.metadata.title}
      excerpt={post.metadata.summary}
      imageSrc={post.metadata.images[0]}
      imageAlt={`Foto artikel ${post.metadata.title}`}
      href={`/id/${post.metadata.categories[0]}/${
        post.slug
      }`}
    />
  ));

  return (
    <>
      {components}
    </>
  );
};

export default HomeIndonesiaLayout;
