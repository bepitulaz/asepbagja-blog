import Link from "next/link"
import Image from "react-bootstrap/Image"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import styles from "./PodcastCard.module.scss"

interface PodcastCardProps {
  imageSrc: string
  imageAlt: string
  summary: string
  href: string
  title: string
}

const PodcastCard = ({
  imageSrc,
  imageAlt,
  summary,
  href,
  title
} : PodcastCardProps) : JSX.Element => {
  return (
    <Col sm={12} lg={6} className={styles.cardContainer}>
      <Link href={href} passHref>
        <Row>
          <Col xs={4}>
            <div className={styles.imageContainer}>
              <Image src={imageSrc} alt={imageAlt} fluid rounded />
            </div>
          </Col>
          <Col xs={8} className="text-start">
            <h3><a className={`text-white mt-3 mt-lg-0 ${styles.link}`} target="_blank">{title}</a></h3>
            <p className="text-white">{summary}</p>
          </Col>
        </Row>
      </Link>
    </Col>
  )
}

export default PodcastCard