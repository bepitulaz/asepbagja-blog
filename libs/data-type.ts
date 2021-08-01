export type Metadata = {
  title: string | null
  images: string[] | null
  categories: string[] | null
  aliases: string[] | null
  summary: string | null
}

export type Article = {
  filename: string
  language: string | null
  slug: string | null
  date: string | null
  metadata: Metadata
  content: string |null
}
