import { FunctionComponent, useEffect } from "react";
import { Article, TrackingEvent } from "@/libs/data-type";
import Button from "react-bootstrap/Button";
import { EnvelopeCheck } from "react-bootstrap-icons";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import styles from "./CtaBox.module.css";

interface CtaBoxProps {
  article: Article;
}

const CtaBox: FunctionComponent<CtaBoxProps> = ({ article }) => {
  const plausible = usePlausible();
  const { t } = useTranslation("single");

  const titleText = t("title");
  const descriptionText = t("description");
  const ctaLinkText = t("ctaLink");
  const buttonDescriptionText = t("buttonDescription");
  const ctaDescriptionText = t("ctaDescription");

  useEffect(() => {
    // Detecting if the financial box is shown
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            plausible(TrackingEvent.CTA_BOX_APPEARED, {
              props: {
                article: article?.slug,
              },
            });
          }
        });
      },
      {
        threshold: [0.1],
      }
    );

    if (typeof window !== undefined) {
      const observedTag = window.document.querySelector("#ctabox");
      if (observedTag) {
        observer.observe(observedTag);
      }
    }
  }, []);

  return (
    <div id="ctabox" className={styles.financialSupportBox}>
      <h5>{titleText}</h5>
      <p className="px-5">{descriptionText}</p>
      <div className="mt-2">
        <Button href={ctaLinkText} variant="primary" size="lg">
          <EnvelopeCheck size={25} className="pb-1" />{" "}
          <span>{buttonDescriptionText}</span>
        </Button>
        <p className={styles.paymentText}>{ctaDescriptionText}</p>
      </div>
    </div>
  );
};

export default CtaBox;
