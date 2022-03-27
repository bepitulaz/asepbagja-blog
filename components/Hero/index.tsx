import Link from "next/link";
import {
  DropdownButton,
  Dropdown,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { RssFill } from "react-bootstrap-icons";
import { ReactElement } from "react";
import useTranslation from "next-translate/useTranslation";
import TransText from "next-translate/TransText";

const Hero = (): ReactElement => {
  const { t, lang } = useTranslation();
  const taglineText = t("home:tagline");
  const greetingText = t("home:greeting");
  const aboutText = t("about:title");
  const aboutRoute = lang === "id" ? "/tentang" : "/about";
  const rssRoute =
    lang === "id"
      ? "https://www.asepbagja.com/id-rss.xml"
      : "https://www.asepbagja.com/en-rss.xml";

  return (
    <Container className="py-5">
      <Row>
        <Col xs={12} className="text-center">
          <Image
            src="/img/avatar_spring.jpg"
            roundedCircle
            width={200}
            alt="Asep Bagja Priandana's photograph"
          />
        </Col>
        <Col xs={12} className="pt-3 text-center">
          <p className="h4">{greetingText}</p>
          <h1>Asep Bagja Priandana</h1>
          <p className="lead">
            <TransText
              text={taglineText}
              components={{
                br: <br />,
              }}
            />
          </p>
          <div className="d-flex justify-content-center">
            <Link href={aboutRoute} passHref locale={lang}>
              <a className="btn btn-outline-danger btn-sm mx-1">{aboutText}</a>
            </Link>
            <DropdownButton
              id="language-selection"
              title={t("common:language")}
              size="sm"
              variant="outline-dark"
              className="mx-1"
            >
              <Link href="/" passHref locale="en">
                <Dropdown.Item>English</Dropdown.Item>
              </Link>
              <Link href="/" passHref locale="id">
                <Dropdown.Item>Bahasa Indonesia</Dropdown.Item>
              </Link>
            </DropdownButton>
            <a
              href={rssRoute}
              target="_blank"
              className="btn btn-outline-dark btn-sm mx-1"
              rel="noreferrer"
            >
              <RssFill className="me-1" />
              {t("common:follow")}
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Hero;
