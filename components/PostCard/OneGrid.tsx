import Col from "react-bootstrap/Col"
import Image from "next/image"
import styles from "./PostCard.module.scss"
import { ReactElement } from "react"

interface OneGridProps {
  title: string
  excerpt: string
  href: string
  imageSrc: string
  imageAlt: string
}

const OneGrid = ({
  title,
  excerpt,
  href,
  imageSrc,
  imageAlt
} : OneGridProps) : ReactElement => {
  return (
    <Col xs={12} lg={3} className={"pb-lg-4"}>
      <div className={styles.imageContainer}>
        <Image src={imageSrc} alt={imageAlt} layout={"fill"} objectFit={"cover"} />
      </div>
      <div className="pt-3 card-summary">
        <a href={href} title={title} className="title-article text-body">
          <h4>{title}</h4>
        </a>
        <p>{excerpt}</p>
      </div>
    </Col>    
  )
}

export default OneGrid