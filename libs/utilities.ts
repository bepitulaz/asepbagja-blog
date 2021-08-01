import remark from "remark"
import html from "remark-html"

export function capitalize(string: string | string[] | undefined): string | string[] | undefined {
  if (typeof string === "string") {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return string
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}