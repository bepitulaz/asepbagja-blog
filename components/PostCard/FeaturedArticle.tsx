import useTranslation from "next-translate/useTranslation";
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Container from "react-bootstrap/Container"
import SectionTitle from "../SectionTitle"
import { FunctionComponent, ReactElement } from "react";

interface FeaturedArticleProps {
  title: string
  excerpt: string
  href: string
  categoryTitle: string
  publishedDate: string
  imageSrc: string
  imageAlt: string
}

const FeaturedArticle: FunctionComponent<FeaturedArticleProps> = ({
  title,
  excerpt,
  href,
  categoryTitle,
  publishedDate,
  imageSrc,
  imageAlt
}) : ReactElement => {
  const { t } = useTranslation();
  const featuredText = t("common:featured");

  return (
    <article className="mt-5">
      <Container>
        <Row>
          <Col>
            <SectionTitle sectionTitle={featuredText} showButton={false} />
          </Col>
        </Row>
        <Row className="mt-md-3">
          <Col md={6}>
            <Image src={imageSrc} fluid alt={imageAlt} />
          </Col>
          <Col md={6} className="d-flex align-items-center pt-3 pt-md-0">
            <div className="card-summary">
              <div className="mb-3">
                <span className="badge bg-dark">{categoryTitle}</span>
              </div>
              <a href={href} title={title} className="title-article text-body">
                <h2>{title}</h2>
              </a>
              <p className="mt-4">{excerpt}</p>
              <p className="fw-light">{publishedDate}</p>
            </div>
          </Col>
        </Row>
      </Container>    
    </article>
  )
}

export default FeaturedArticle