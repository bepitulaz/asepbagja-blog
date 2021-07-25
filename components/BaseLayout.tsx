import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Row from "react-bootstrap/Row"
import Link from "next/link"
import {
  Github,
  Linkedin,
  Twitter
} from "react-bootstrap-icons"

const BaseLayout = (props: any) : JSX.Element => {
  const { children } = props

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Asep Bagja</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Business</Nav.Link>
              <Nav.Link href="#podcast">Personal</Nav.Link>
              <Nav.Link href="#podcast">Programming</Nav.Link>
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
                  <Link href="/" passHref>
                    <Nav.Link className="text-white">About Asep</Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xs={12} md={6}>
              <Nav className="justify-content-start justify-content-lg-end">
                <Nav.Item>
                  <Nav.Link className="text-white" href="https://github.com/bepitulaz" target="_blank">
                    <Github />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="text-white" href="https://twitter.com/bepitulaz" target="_blank">
                    <Twitter />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="text-white" href="https://linkedin.com/in/asepbagja" target="_blank">
                    <Linkedin />
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="pt-3 mt-3 copyright-section">
                <p className="text-center text-white fw-light">&copy; 2021 Asep Bagja Priandana</p>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default BaseLayout