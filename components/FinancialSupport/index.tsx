import { FunctionComponent } from "react";
import { Language, Content, Article } from "@/libs/data-type";
import Button from "react-bootstrap/Button";
import { CashStack } from "react-bootstrap-icons";
import styles from "./FinancialSupport.module.css";

interface FinancialSupportProps {
  article: Article;
}

const LANGUAGE = {
  [Content.EN]: {
    title: "Give a tip for Asep",
    description: "If you like my content, you can give a little tip for me and support my writing.",
    paymentLink: "https://buy.stripe.com/7sI5nugP63C53WUbII",
    buttonDescription: "Tip him now",
    paymentDescription: "Your payment will be processed by Stripe",
  },
  [Content.ID]: {
    title: "Tip untuk Asep",
    description: "Jika kamu senang dengan konten saya, kamu bisa beri sedikit tip untuk mendukung tulisan saya.",
    paymentLink: "https://buy.stripe.com/14kg288iA8Wp6527st",
    buttonDescription: "Beri dia tip sekarang",
    paymentDescription: "Pembayaranmu akan diproses oleh Stripe",
  },
};

const FinancialSupport: FunctionComponent<FinancialSupportProps> = ({
  article,
}) => {
  const lang = article.language === Language.EN ? Content.EN : Content.ID;
  console.log(lang);
  return (
    <div className={styles.financialSupportBox}>
      <h5>{LANGUAGE[lang].title}</h5>
      <p>{LANGUAGE[lang].description}</p>
      <div className="mt-2">
        <Button href={LANGUAGE[lang].paymentLink} variant="primary" size="lg">
          <CashStack size={25} className="pb-1" />
          {" "}
          <span>{LANGUAGE[lang].buttonDescription}</span>
        </Button>
        <p className={styles.paymentText}>{LANGUAGE[lang].paymentDescription}</p>
      </div>
    </div>
  );
};

export default FinancialSupport;
