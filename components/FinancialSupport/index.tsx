import { FunctionComponent, useEffect } from "react";
import { Language, Content, Article, TrackingEvent } from "@/libs/data-type";
import Button from "react-bootstrap/Button";
import { CashStack } from "react-bootstrap-icons";
import { usePlausible } from "next-plausible";
import styles from "./FinancialSupport.module.css";

interface FinancialSupportProps {
  article: Article;
}

const LANGUAGE = {
  [Content.EN]: {
    title: "Give a tip for Asep",
    description:
      "If you like my content, you can give a little tip for me and support my writing.",
    paymentLink: "https://buy.stripe.com/7sI5nugP63C53WUbII",
    buttonDescription: "Tip him now",
    paymentDescription: "Your payment will be processed by Stripe",
  },
  [Content.ID]: {
    title: "Tip untuk Asep",
    description:
      "Jika kamu senang dengan konten saya, kamu bisa beri sedikit tip untuk mendukung tulisan saya.",
    paymentLink: "https://buy.stripe.com/14kg288iA8Wp6527st",
    buttonDescription: "Beri dia tip sekarang",
    paymentDescription: "Pembayaranmu akan diproses oleh Stripe",
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
          plausible(TrackingEvent.FINANCIAL_BOX_APPEARED);
        }
      });
    }, {
      threshold: [0.1],
    });
    
    if (typeof window !== undefined) {
      const observedTag = window.document.querySelector("#financialbox");
      console.log(observedTag);
      if (observedTag) {
        observer.observe(observedTag);
      }
    }
  }, []);

  return (
    <div id="financialbox" className={styles.financialSupportBox}>
      <h5>{LANGUAGE[lang].title}</h5>
      <p>{LANGUAGE[lang].description}</p>
      <div className="mt-2">
        <Button href={LANGUAGE[lang].paymentLink} variant="primary" size="lg">
          <CashStack size={25} className="pb-1" />{" "}
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
