import Link from "next/link";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styles from "./PodcastCard.module.scss";
import { FunctionComponent } from "react";

interface PodcastCardProps {
  imageSrc: string;
  imageAlt: string;
  summary: string;
  href: string;
  title: string;
  sizeInLarge?: number;
}

const PodcastCard: FunctionComponent<PodcastCardProps> = ({
  imageSrc,
  imageAlt,
  summary,
  href,
  title,
  sizeInLarge = 4,
  children,
}) => {
  return (
    <Col sm={12} lg={sizeInLarge} className={styles.cardContainer}>
      <Link href={href} passHref>
        <a
          className={`text-white mt-3 mt-lg-0 ${styles.link}`}
          target="_blank"
          rel="noreferrer"
        >
          <Row>
            <Col xs={4}>
              <div className={styles.imageContainer}>
                <Image src={imageSrc} alt={imageAlt} fluid rounded />
              </div>
            </Col>
            <Col xs={8} className="text-start">
              <h3>{title}</h3>
              <p className="text-white">{summary}</p>
              {children}
            </Col>
          </Row>
        </a>
      </Link>
    </Col>
  );
};

export default PodcastCard;
