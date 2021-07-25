import { ArrowRight } from "react-bootstrap-icons"
import Link from "next/link"

interface Props {
  sectionTitle: string
  showButton?: boolean
  buttonTitle?: string
  linkHref?: string
  bsTextColourClass?: string
}

const SectionTitle = ({ showButton = true, buttonTitle, sectionTitle, linkHref, bsTextColourClass } : Props): JSX.Element => {
  return (
    <div className="d-flex justify-content-between">
      <h3 className={`text-decoration-underline ${bsTextColourClass}`}>
        {sectionTitle}
      </h3>
      { showButton && (
        <Link href={linkHref} passHref>
          <a className="btn btn-outline-dark">{buttonTitle} <ArrowRight /></a>
        </Link>
      )}
    </div>
  )
}

export default SectionTitle
