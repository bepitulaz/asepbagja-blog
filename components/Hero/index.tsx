import Link from "next/link"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"

const Hero = () : JSX.Element => {
  return (
    <Container className="py-5">
      <Row>
        <Col xs={12} className="text-center">
          <Image src="/img/asep.jpg" roundedCircle width={200} alt="Asep Bagja Priandana's photograph" />
        </Col>
        <Col xs={12} className="pt-3 text-center">
          <p className="h4">Hi! I&apos;m</p>
          <h1>Asep Bagja Priandana</h1>
          <p className="lead">An indie hacker, full-stack programmer, podcaster, and bedroom musician.</p>
          <Link href="/about" passHref>
            <a className="btn btn-outline-dark btn-lg">About me</a>
          </Link>
        </Col>
      </Row>
    </Container>
  )
}

export default Hero