import Head from "next/head"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import BaseLayout from "../components/BaseLayout"

export default function AboutPage(): JSX.Element {
  return (
    <BaseLayout>
      <Head>
        <title>About | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="About | Asep Bagja" />
        <meta name="og:description" property="og:description" content="My personal blog where I share my opinion and topic that I'm interested." />
        <meta property="og:site_name" content="The Blog of Asep Bagja" />
        <meta property="og:url" content="https://www.asepbagja.com/about" />  
        <meta name="twitter:card" content="summary" /> 
        <meta name="twitter:title" content="The Blog of Asep Bagja" />
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
        <meta property="og:image" content="https://www.asepbagja.com/img/tartu.jpeg" />  
        <meta name="twitter:image" content="https://www.asepbagja.com/img/tartu.jpeg" />   
        <link rel="canonical" href="https://www.asepbagja.com/about" />
      </Head>

      <div style={{
        backgroundImage: `url("/img/tartu.jpeg")`,
        backgroundPosition: `bottom center`,
        backgroundSize: "cover", 
      }}>
        <Container className="py-5">
          <Row>
            <Col xs={12} className="text-center">
              <Image src="/img/asep.jpg" roundedCircle width={200} alt="Asep Bagja Priandana's photograph" />
            </Col>
            <Col xs={12} className="pt-3 text-center text-white">
              <h1>Asep Bagja Priandana</h1>
              <p className="lead">A full-stack programmer and generalist.</p>
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
                Asep Bagja Priandana, you can call him Asep anyway, is an entrepreneur from Indonesia. He was born in a family with no entrepreneurship tradition. His father was an auditor in the government organization, and her mother was a stay-at-home mom. Despite that background, Asep has a different point of view than his parents. He loves to look for opportunities and turn them into a business.
              </p>
              <p>
                He started his entrepreneurship journey when in high school by selling music CD. When he was in college, Asep tried various businesses: establishing a fashion store with his friends, becoming a band player, and doing freelance programming.
              </p>
              <p>
                His passion for information technology and computer grew after his father bought a laptop when Asep was still in a 3rd grade in elementary school. Asep is a self-taught programmer. He learnt to programme in Pascal language because of his high school accounting teacher taught him. Even though Asep took an accounting degree in college, he always practices his programming skill in his spare time.
              </p>
              <p>
                Asep began seriously to take entrepreneurship as his career path in 2012, by establishing Froyo, a digital marketing agency with his friend. Then he exited from Froyo in 2017. After that, he founded <a href="https://www.tanibox.com" target="_blank" rel="noreferrer">Tanibox</a>, an agriculture technology company in Estonia, together with his wife.
              </p>
              <p>
                In early 2021, he changed his career path. He went back to the professional world, and take the challenge as a full-time software engineer in Jobbatical. An Estonia company that make an immigration and relocation process easy.
              </p>
            </Col>
          </Row>
        </Container>
      </main>
    </BaseLayout>
  )
}
