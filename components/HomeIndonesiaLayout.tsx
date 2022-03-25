import { FunctionComponent, ReactElement } from "react";
import useTranslation from "next-translate/useTranslation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { PlayCircleFill } from "react-bootstrap-icons";
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
  const businessPosts = posts.filter((post) => {
    const isCategoryExist = post.metadata.categories.includes(CategoryID.BUSINESS);
    return !post.metadata.featured && isCategoryExist;
  });

  return (
    <>
      {/* Discography */}
      <section className="mt-5 py-5 red-section">
        <Container>
          <Row>
            <Col>
              <SectionTitle
                sectionTitle="Musik"
                bsTextColourClass="text-white"
                showButton={false}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <PodcastCard
              imageSrc={"/music-img/a-new-life-square.jpg"}
              imageAlt={"A New Life cover art"}
              title={"A New Life"}
              summary={
                "Musik ambient yang dihasilkan dari data real-time. Terinspirasi dari perjalanan imigrasi saya di tahun 2021."
              }
              href={
                "https://artists.landr.com/692531292711"
              }
              sizeInLarge={6}
            >
              <Button variant="outline-light" size="sm">
                <PlayCircleFill size={20} className="mr-3" /> Dengarkan di platform kesukaanmu
              </Button>
            </PodcastCard>
            <PodcastCard
              imageSrc={"/music-img/people-just-want-peace-square.jpg"}
              imageAlt={"People Just Want Peace cover art"}
              title={"People Just Want Peace"}
              summary={
                "Terinspirasi dari kejadian perang di Ukraina tahun 2022. Saya menuliskan musik ini untuk membawa pesan bahwa yang kita inginkan hanya perdamaian."
              }
              href={
                "https://artists.landr.com/692531433367"
              }
              sizeInLarge={6}
            >
              <Button variant="outline-light" size="sm">
                <PlayCircleFill size={20} className="mr-3" /> Dengarkan di platform kesukaanmu
              </Button>
            </PodcastCard>
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
                sectionTitle={businessText}
                buttonTitle={seeAllText}
                linkHref={`/${CategoryID.BUSINESS}`}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGridsRight posts={businessPosts.slice(0, 3)} />
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
