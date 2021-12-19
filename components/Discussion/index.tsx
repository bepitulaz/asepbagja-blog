import { FunctionComponent } from "react";
import { DiscussionEmbed } from "disqus-react";
import { Language, Content, Article } from "@/libs/data-type";

interface DiscussionProps {
  article: Article;
}

const Discussion: FunctionComponent<DiscussionProps> = ({ article }) => {
  const lang = article.language === Language.EN ? Content.EN : Content.ID;
  const disqusConfig = {
    url: `https://www.asepbagja.com/${article.metadata.categories?.[0].toLowerCase()}/${article.slug}`,
    identifier: article.slug as string,
    title: article.metadata.title as string,
    language: lang,
  }

  return (
    <DiscussionEmbed
      shortname="asepnew"
      config={disqusConfig}
    />
  );
};

export default Discussion;
