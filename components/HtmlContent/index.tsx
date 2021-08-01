import styles from "./HtmlContent.module.scss"

interface ContentProps {
  content: string
}

const HtmlContent = ({ content }: ContentProps): JSX.Element => {
  return (<div className={styles.linkStyle} dangerouslySetInnerHTML={{ __html: content }} />)
}

export default HtmlContent