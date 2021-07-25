import Link from "next/link"
import Image from "react-bootstrap/Image"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import styles from "./PodcastCard.module.scss"

interface PodcastCardProps {
  imageSrc: string
  imageAlt: string
  publishedDate: string
  href: string
  title: string
}

const PodcastCard = ({
  imageSrc,
  imageAlt,
  publishedDate,
  href,
  title
} : PodcastCardProps) : JSX.Element => {
  return (
    <Col sm={12} lg={6}>
      <Link href={href} passHref>
        <a className="button-as-link text-white mt-3 mt-lg-0">
          <Row>
            <Col xs={4}>
              <div className={styles.imageContainer}>
                <Image src={imageSrc} alt={imageAlt} fluid />
              </div>
            </Col>
            <Col xs={8} className="text-start">
              <h3>{title}</h3>
              <p className="fw-light">{publishedDate}</p>
            </Col>
          </Row>
        </a>
      </Link>
    </Col>
  )
}

export default PodcastCard