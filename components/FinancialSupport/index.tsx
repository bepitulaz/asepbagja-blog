import { FunctionComponent, useEffect } from "react";
import { Language, Content, Article, TrackingEvent } from "@/libs/data-type";
import Button from "react-bootstrap/Button";
import { EnvelopeCheck } from "react-bootstrap-icons";
import { usePlausible } from "next-plausible";
import styles from "./FinancialSupport.module.css";

interface FinancialSupportProps {
  article: Article;
}

const LANGUAGE = {
  [Content.EN]: {
    title: "The newsletter from 59°",
    description:
      "If you like my content, you can subscribe to my newsletter to get updates regularly. It's free!",
    paymentLink: "https://www.getrevue.co/profile/bepitulaz",
    buttonDescription: "Subscribe now!",
    paymentDescription: "You'll be redirected to Asep's Revue profile.",
  },
  [Content.ID]: {
    title: "The newsletter from 59°",
    description:
      "Jika kamu senang dengan tulisan saya, kamu bisa berlangganan newsletter saya untuk mendapatkan konten secara reguler. Gratis!",
    paymentLink: "https://www.getrevue.co/profile/bepitulaz",
    buttonDescription: "Berlangganan sekarang!",
    paymentDescription: "Kamu akan dialihkan ke profil Revue Asep.",
  },
};

const FinancialSupport: FunctionComponent<FinancialSupportProps> = ({
  article,
}) => {
  const lang = article.language === Language.EN ? Content.EN : Content.ID;
  const plausible = usePlausible();

  useEffect(() => {
    // Detecting if the financial box is shown
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          plausible(TrackingEvent.FINANCIAL_BOX_APPEARED, {
            props: {
              article: article.slug,
            },
          });
        }
      });
    }, {
      threshold: [0.1],
    });
    
    if (typeof window !== undefined) {
      const observedTag = window.document.querySelector("#financialbox");
      if (observedTag) {
        observer.observe(observedTag);
      }
    }
  }, []);

  return (
    <div id="financialbox" className={styles.financialSupportBox}>
      <h5>{LANGUAGE[lang].title}</h5>
      <p className="px-5">{LANGUAGE[lang].description}</p>
      <div className="mt-2">
        <Button href={LANGUAGE[lang].paymentLink} variant="primary" size="lg">
          <EnvelopeCheck size={25} className="pb-1" />{" "}
          <span>{LANGUAGE[lang].buttonDescription}</span>
        </Button>
        <p className={styles.paymentText}>
          {LANGUAGE[lang].paymentDescription}
        </p>
      </div>
    </div>
  );
};

export default FinancialSupport;
