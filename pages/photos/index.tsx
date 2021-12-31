import BaseLayout from "@/components/BaseLayout";
import { makeSlug } from "@/libs/utilities";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";

const PLACES = [
  "Tallinn",
  "Tartu",
  "Bali",
  "Jakarta & Tangerang Selatan",
];

const PhotosPage: NextPage = () => {
  return (
    <BaseLayout>
      <Head>
        <title>Photos | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container className="py-5">
        <Row>
          <Col className="pt-3 text-center">
            <h1>Photos</h1>
            <p className="lead">
              The photo gallery from some parts of my life. It is organised by the place where I was visited or lived.
            </p>
          </Col>
        </Row>
        <Row>
          {PLACES.map((place) => (
            <Col key={place} xs={12} md={6} lg={4}>
              <h3>{makeSlug(place)}</h3>
            </Col>
          ))}
        </Row>
      </Container>
    </BaseLayout>
  );
};

export default PhotosPage;
