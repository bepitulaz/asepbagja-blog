import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

export function capitalize(
  string: string | string[] | undefined
): string | string[] | undefined {
  if (typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return string;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return result.toString();
}

export async function markdownToRSS(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeRaw)
    .use(rehypeStringify, { allowDangerousHtml: false })
    .process(markdown);
  
  return result.toString();
}

export function getFirstParagraph(content: string): string {
  const regex = /<p>(.*?)<\/p>/;
  const result = regex.exec(content);
  return (result) ? result[0] : "";
};
