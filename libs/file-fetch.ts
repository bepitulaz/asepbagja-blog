import { promises as fs } from "fs"
import path from "path"
import matter from "gray-matter"
import { Article, Content } from "./data-type"

// Get all contents from the file system
export async function readFromFileSystem(langCode: Content) {
  const contentDir = path.join(process.cwd(), "content", langCode)
  const filenames = await fs.readdir(contentDir)

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(contentDir, filename)
    const fileContents = await fs.readFile(filePath, "utf8")
    const content = matter(fileContents)

    let longNameLang = "English"
    if (langCode == Content.ID) {
      longNameLang = "Bahasa Indonesia"
    }

    const post: Article = {
      filename,
      language: content?.data?.lang ?? longNameLang,
      slug: content?.data?.slug ?? filename.slice(0, -3),
      date: content?.data?.date,
      metadata: {
        title: content?.data?.title,
        images: content?.data?.images,
        categories: content?.data?.categories,
        aliases: content?.data?.aliases ?? [],
        summary: content?.data?.summary ?? "",
      },
      content: content?.content,
    }

    return post
  })

  const articles = await Promise.all(posts)
  const sortedArticle = articles.sort((a, b) => {
    const bDate = b.date as any
    const aDate = a.date as any
    return bDate - aDate
  }).map((post) => {
    const postDate = post?.date as any
    post.date = postDate?.toLocaleDateString("en-GB")
    return post
  })

  return sortedArticle
}
