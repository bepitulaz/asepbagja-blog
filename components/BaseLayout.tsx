import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Link from "next/link";
import { Github, Linkedin, Twitter, Spotify } from "react-bootstrap-icons";
import { Category } from "@/libs/data-type";
import { capitalize } from "@/libs/utilities";

const BaseLayout = (props: any): JSX.Element => {
  const { children } = props;

  return (
    <div className="flex-wrapper">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Asep Bagja</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="mr-auto">
              <Link href={`/${Category.BUSINESS}`} passHref>
                <Nav.Link>{capitalize(Category.BUSINESS)}</Nav.Link>
              </Link>
              <Link href={`/${Category.MUSIC}`} passHref>
                <Nav.Link>{capitalize(Category.MUSIC)}</Nav.Link>
              </Link>
              <Link href={`/${Category.PERSONAL}`} passHref>
                <Nav.Link>{capitalize(Category.PERSONAL)}</Nav.Link>
              </Link>
              <Link href={`/${Category.PROGRAMMING}`} passHref>
                <Nav.Link>{capitalize(Category.PROGRAMMING)}</Nav.Link>
              </Link>
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
                  <Link href="/about" passHref>
                    <Nav.Link className="text-white">About Asep</Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xs={12} md={6}>
              <Nav className="justify-content-start justify-content-lg-end">
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://open.spotify.com/artist/6v8f8XuEE8LPI8CHmbB0HM?si=YwcoObFyRq-eeSyEegsEDw"
                    target="_blank"
                  >
                    <Spotify />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://github.com/bepitulaz"
                    target="_blank"
                  >
                    <Github />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://twitter.com/bepitulaz"
                    target="_blank"
                  >
                    <Twitter />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="text-white"
                    href="https://linkedin.com/in/asepbagja"
                    target="_blank"
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
                  &copy; 2021 Asep Bagja Priandana
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default BaseLayout;
