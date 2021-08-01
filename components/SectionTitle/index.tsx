import { ArrowRight } from "react-bootstrap-icons"
import Link from "next/link"
import styles from "./SectionTitle.module.scss"

interface Props {
  sectionTitle: string | string[] | undefined
  showButton?: boolean
  buttonTitle?: string
  linkHref?: string
  bsTextColourClass?: string
}

const SectionTitle = ({ showButton = true, buttonTitle, sectionTitle, linkHref = "", bsTextColourClass } : Props): JSX.Element => {
  return (
    <div className="d-flex justify-content-between">
      <h3 className={`${bsTextColourClass === "text-white" ? styles.underlineWhite : styles.underlineDark} ${bsTextColourClass}`}>
        {sectionTitle}
      </h3>
      { showButton && (
        <Link href={linkHref} passHref>
          <a className={`btn btn-outline-dark ${styles.buttonSection}`}>{buttonTitle} <ArrowRight /></a>
        </Link>
      )}
    </div>
  )
}

export default SectionTitle
