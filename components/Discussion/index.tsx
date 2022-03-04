import { FunctionComponent } from "react";
import { DiscussionEmbed } from "disqus-react";
import { Article } from "@/libs/data-type";

interface DiscussionProps {
  article: Article;
  locale: string;
}

const Discussion: FunctionComponent<DiscussionProps> = ({ article, locale }) => {
  const disqusConfig = {
    url: `https://www.asepbagja.com/${article?.metadata.categories?.[0].toLowerCase()}/${article?.slug}`,
    identifier: article?.slug as string,
    title: article?.metadata.title as string,
    language: locale,
  }

  return (
    <DiscussionEmbed
      shortname="asepnew"
      config={disqusConfig}
    />
  );
};

export default Discussion;
