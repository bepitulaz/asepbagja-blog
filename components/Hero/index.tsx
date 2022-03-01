import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { ReactElement } from "react";
import useTranslation from "next-translate/useTranslation";
import TransText from "next-translate/TransText";

const Hero = (): ReactElement => {
  const { t, lang } = useTranslation();
  const taglineText = t("home:tagline");
  const greetingText = t("home:greeting");
  const aboutText = t("about:title");
  const aboutRoute = lang === "id" ? "/tentang" : "/about";

  return (
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
        <Col xs={12} className="pt-3 text-center">
          <p className="h4">{greetingText}</p>
          <h1>Asep Bagja Priandana</h1>
          <p className="lead">
            <TransText text={taglineText} components={{
              br: <br />
            }}/>
          </p>
          <Link href={aboutRoute} passHref locale={lang}>
            <a className="btn btn-outline-dark btn-lg">{aboutText}</a>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Hero;
