import Link from "next/link"
import Col from "react-bootstrap/Col"
import Image from "next/image"
import styles from "./PostCard.module.scss"

interface TwoGridProps {
  title: string
  excerpt: string
  href: string
  imageSrc: string
  imageAlt: string
}

const TwoGrids = ({
  title,
  excerpt,
  href,
  imageSrc,
  imageAlt
} : TwoGridProps) : JSX.Element => {
  return (
    <Col xs={12} lg={6}>
      <div className={styles.imageContainer}>
        <Image src={imageSrc} alt={imageAlt} layout={"fill"} objectFit={"cover"} />
      </div>
      <div className="pt-3">
        <Link href={href} passHref>
          <a title={title} className="title-article text-body">
            <h4>{title}</h4>
          </a>
        </Link>
        <p>{excerpt}</p>
      </div>
    </Col>
  )
}

export default TwoGrids