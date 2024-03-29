import { Col, Container, NavDropdown, Navbar, Nav, Row } from "react-bootstrap";
import Link from "next/link";
import Script from "next/script";
import {
  Github,
  Linkedin,
  Twitter,
  Flag,
  Youtube
} from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";
import { CategoryEN, CategoryID } from "@/libs/data-type";

const BaseLayout = (props: any): JSX.Element => {
  const { children } = props;
  const date = new Date();
  const { t, lang } = useTranslation();

  const businessText = t("common:business");
  const musicText = t("common:music");
  const programmingText = t("common:programming");
  const lifeText = t("common:life");
  const estoniaText = t("common:estonia");
  const personalText = t("common:personal");

  const businessRoute =
    lang === "id" ? `/${CategoryID.BUSINESS}` : `/${CategoryEN.BUSINESS}`;
  const musicRoute =
    lang === "id" ? `/${CategoryID.MUSIC}` : `/${CategoryEN.MUSIC}`;
  const programmingRoute =
    lang === "id" ? `/${CategoryID.PROGRAMMING}` : `/${CategoryEN.PROGRAMMING}`;
  const estoniaRoute =
    lang === "id" ? `/${CategoryID.ESTONIA}` : `/${CategoryEN.ESTONIA}`;
  const personalRoute =
    lang === "id" ? `/${CategoryID.PERSONAL}` : `/${CategoryEN.PERSONAL}`;
  const homeRoute = lang === "en" ? "" : lang;

  return (
    <div className="flex-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href={`/${homeRoute}`}>Asep Bagja</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="me-auto">
              <NavDropdown title={<Flag />} id="language-chooser">
                <Link href={"/"} passHref locale={"en"}>
                  <NavDropdown.Item>English</NavDropdown.Item>
                </Link>
                <Link href={"/"} passHref locale={"id"}>
                  <NavDropdown.Item>Bahasa Indonesia</NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Nav>
            <Nav className="mr-auto">
              <Link href={businessRoute} passHref locale={lang}>
                <Nav.Link>{businessText}</Nav.Link>
              </Link>
              {lang === "en" && (
                <Link href={musicRoute} passHref locale={lang}>
                  <Nav.Link>{musicText}</Nav.Link>
                </Link>
              )}
              <Link href={programmingRoute} passHref locale={lang}>
                <Nav.Link>{programmingText}</Nav.Link>
              </Link>
              <NavDropdown title={lifeText} id="basic-nav-dropdown">
                <Link href={estoniaRoute} passHref locale={lang}>
                  <NavDropdown.Item>{estoniaText}</NavDropdown.Item>
                </Link>
                <Link href={personalRoute} passHref locale={lang}>
                  <NavDropdown.Item>{personalText}</NavDropdown.Item>
                </Link>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {children}

      <footer className="bg-dark py-3 mt-5">
        <Container>
          <Row>
            <Col xs={12} md={6}>
              <Nav>
                <Nav.Item>
                  <Link
                    href={lang === "id" ? "/id/tentang" : "/about"}
                    passHref
                  >
                    <Nav.Link className="text-white">
                      {t("meta:about")} Asep
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xs={12} md={6}>
              <Nav className="justify-content-start justify-content-lg-end">
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://www.youtube.com/channel/UCjGnuWk0n6BWx7rXshMysbw"
                    target="_blank"
                    rel="me"
                  >
                    <Youtube />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://github.com/bepitulaz"
                    target="_blank"
                    rel="me"
                  >
                    <Github />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://twitter.com/bepitulaz"
                    target="_blank"
                    rel="me"
                  >
                    <Twitter />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://linkedin.com/in/asepbagja"
                    target="_blank"
                    rel="me"
                  >
                    <Linkedin />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="pt-3 mt-3 copyright-section">
                <p className="text-center text-white fw-light">
                  &copy; 2014-{date.getFullYear()} Asep Bagja Priandana
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
      <Script strategy={"beforeInteractive"} src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js" />
      <Script
        strategy={"afterInteractive"}
        dangerouslySetInnerHTML={{
          __html: `kofiWidgetOverlay.draw('asepbagja', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Tip Me',
          'floating-chat.donateButton.background-color': '#d9534f',
          'floating-chat.donateButton.text-color': '#fff'
          })`
        }}
      />
    </div>
  );
};

export default BaseLayout;
