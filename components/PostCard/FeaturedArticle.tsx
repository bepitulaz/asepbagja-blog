import Link from "next/link"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Image from "react-bootstrap/Image"
import Container from "react-bootstrap/Container"
import SectionTitle from "../SectionTitle"

interface FeaturedArticleProps {
  title: string
  excerpt: string
  href: string
  categoryTitle: string
  publishedDate: string
  language: string
  imageSrc: string
  imageAlt: string
}

const FeaturedArticle = ({
  title,
  excerpt,
  href,
  categoryTitle,
  publishedDate,
  language,
  imageSrc,
  imageAlt
} : FeaturedArticleProps) : JSX.Element => {
  return (
    <article className="mt-5">
      <Container>
        <Row>
          <Col>
            <SectionTitle sectionTitle="Featured article" showButton={false} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Image src={imageSrc} fluid alt={imageAlt} />
          </Col>
          <Col md={6} className="d-flex align-items-center pt-3 pt-md-0">
            <div>
              <p className="h5 text-decoration-underline">{categoryTitle}</p>
              <Link href={href} passHref>
                <a title={title} className="title-article text-body">
                  <h2>{title}</h2>
                </a>
              </Link>
              <p>{excerpt}</p>
              <p className="fw-light">{publishedDate} | Language: {language}</p>
            </div>
          </Col>
        </Row>
      </Container>    
    </article>
  )
}

export default FeaturedArticle