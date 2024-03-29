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
import { Article, CategoryEN } from "@/libs/data-type";

interface LayoutProps {
  posts: Article[];
}

const HomeEnglishLayout: FunctionComponent<LayoutProps> = ({
  posts,
}): ReactElement => {
  const { t } = useTranslation();

  const programmingText = t("common:programming");
  const personalText = t("common:personal");
  const seeAllText = t("common:see-all");

  const programmingPosts = posts.filter((post) => {
    const isCategoryExist = post.metadata.categories.includes(
      CategoryEN.PROGRAMMING
    );
    return !post.metadata.featured && isCategoryExist;
  });
  const personalPosts = posts.filter((post) => {
    const isCategoryExist = post.metadata.categories.includes(
      CategoryEN.PERSONAL
    );
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
                sectionTitle="Music"
                bsTextColourClass="text-white"
                showButton={false}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <PodcastCard
              imageSrc={"/music-img/a-new-life-square.jpg"}
              imageAlt={"A New Life cover art"}
              title={"A New Life - Single"}
              summary={
                "A generative ambient music that's inspired by my immigration journey in 2021. All songs are generated from real-time world data."
              }
              href={
                "https://music.youtube.com/playlist?list=OLAK5uy_nZvBsFixdX7X9yuxjBy7a31GhOMQ3aH3M&feature=share"
              }
              sizeInLarge={4}
            >
              <Button variant="outline-light" size="sm" className="mt-3 w-100">
                <PlayCircleFill size={20} className="mr-3" /> Listen now
              </Button>
            </PodcastCard>
            <PodcastCard
              imageSrc={"/music-img/people-just-want-peace-square.jpg"}
              imageAlt={"People Just Want Peace cover art"}
              title={"People Just Want Peace - Single"}
              summary={
                "Inspired by the world event, a war in Ukraine in 2022, I composed this music to bring a message that we just want peace."
              }
              href={
                "https://music.youtube.com/playlist?list=OLAK5uy_k0LaLQSJhxc_bbMVTfmdFqsL-tEf5Ll2k&feature=share"
              }
              sizeInLarge={4}
            >
              <Button variant="outline-light" size="sm" className="mt-3 w-100">
                <PlayCircleFill size={20} className="mr-3" /> Listen now
              </Button>
            </PodcastCard>
            <PodcastCard
              imageSrc={"/music-img/the-enlightening-moment-square.jpg"}
              imageAlt={"The Enlightening Moment cover art"}
              title={"The Enlightening Moment - EP"}
              summary={
                "My first EP in 2022. Ideas can be anywhere and anytime, even when we are in the bathroom. Shower thoughts."
              }
              href={
                "https://music.youtube.com/playlist?list=OLAK5uy_kSSHqVHLlpTB0uiRbBLrWDzslMZIdhY8s&feature=share"
              }
              sizeInLarge={4}
            >
              <Button variant="outline-light" size="sm" className="mt-3 w-100">
                <PlayCircleFill size={20} className="mr-3" /> Listen now
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
                sectionTitle={programmingText}
                buttonTitle={seeAllText}
                linkHref={`/${CategoryEN.PROGRAMMING}`}
              />
            </Col>
          </Row>
          <Row className="mt-md-3">
            <TwoGridsRight posts={programmingPosts.slice(0, 3)} />
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
                linkHref={`/${CategoryEN.PERSONAL}`}
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
};

const TwoGridsRight: FunctionComponent<LayoutProps> = ({
  posts,
}): ReactElement => {
  const components = posts.map((post, index) =>
    index === 2 ? (
      <TwoGrids
        key={index}
        title={post.metadata.title}
        excerpt={post.metadata.summary}
        imageSrc={post.metadata.images[0]}
        imageAlt={`the thumbnail of ${post.metadata.title}`}
        href={`/${post.metadata.categories[0]}/${post.slug}`}
      />
    ) : (
      <OneGrid
        key={index}
        title={post.metadata.title}
        excerpt={post.metadata.summary}
        imageSrc={post.metadata.images[0]}
        imageAlt={`the thumbnail of ${post.metadata.title}`}
        href={`/${post.metadata.categories[0]}/${post.slug}`}
      />
    )
  );
  return <>{components}</>;
};

const TwoGridsLeft: FunctionComponent<LayoutProps> = ({
  posts,
}): ReactElement => {
  const components = posts.map((post, index) =>
    index === 0 ? (
      <TwoGrids
        key={index}
        title={post.metadata.title}
        excerpt={post.metadata.summary}
        imageSrc={post.metadata.images[0]}
        imageAlt={`the thumbnail of ${post.metadata.title}`}
        href={`/${post.metadata.categories[0]}/${post.slug}`}
      />
    ) : (
      <OneGrid
        key={index}
        title={post.metadata.title}
        excerpt={post.metadata.summary}
        imageSrc={post.metadata.images[0]}
        imageAlt={`the thumbnail of ${post.metadata.title}`}
        href={`/${post.metadata.categories[0]}/${post.slug}`}
      />
    )
  );

  return <>{components}</>;
};

export default HomeEnglishLayout;
