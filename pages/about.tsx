import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import BaseLayout from "../components/BaseLayout";

export default function AboutPage(): JSX.Element {
  return (
    <BaseLayout>
      <Head>
        <title>About | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="About | Asep Bagja"
        />
        <meta
          name="og:description"
          property="og:description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com/about" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="The Blog of Asep Bagja" />
        <meta
          name="twitter:description"
          content="My personal blog where I share my opinion and topic that I'm interested."
        />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          property="og:image"
          content="https://www.asepbagja.com/img/tartu.jpeg"
        />
        <meta
          name="twitter:image"
          content="https://www.asepbagja.com/img/tartu.jpeg"
        />
        <link rel="canonical" href="https://www.asepbagja.com/about" />
      </Head>

      <div
        style={{
          backgroundImage: `url("/img/tartu.jpeg")`,
          backgroundPosition: `bottom center`,
          backgroundSize: "cover",
        }}
      >
        <Container className="py-5">
          <Row>
            <Col xs={12} className="text-center">
              <Image
                src="/img/new_avatar_small.jpg"
                roundedCircle
                width={200}
                alt="Asep Bagja Priandana's photograph"
              />
            </Col>
            <Col xs={12} className="pt-3 text-center text-white">
              <h1>Asep Bagja Priandana</h1>
              <p className="lead">
                I do software development for fun 🎉 and profit 💶
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <main className="mt-5 about-section">
        <Container>
          <Row className="mt-5">
            <Col lg={{ span: 8, offset: 2 }}>
              <h3 className="mb-3">About Asep</h3>
              <p>
                Asep Bagja Priandana is a computer programmer and a musician
                from Indonesia. He lives in Tallinn, Estonia. During the day, he
                works as a software engineer in an Estonia tech startup. But, at
                night, he tinkers with synthesisers and a computer to generate
                noise. When composing his music, he often employes his
                programming skill as a musical instrument. He enjoys writing
                electronic ambient and generative music.
              </p>
              <p>
                As a programmer, Asep started his professional career in 2010.
                He worked for several companies in Indonesia and Singapore. Even
                he founded his own companies. Furthermore, he is a self-taught
                programmer because his educational background was accounting.
              </p>
              <p>
                Talking about his music passion, Asep started his journey as a
                keyboardist in a band in college circa 2007 in Indonesia. During
                2007-2009, he actively became a session keyboardist in some
                bands in various genres. He played alternative rock, pop,
                electronic pop, and jazz.
              </p>
            </Col>
          </Row>
        </Container>
      </main>
    </BaseLayout>
  );
}
