export type Metadata = {
  title: string | null
  images: string[] | null
  categories: string[] | null
  aliases: string[] | null
  summary: string | null
}

export type Article = {
  filename: string
  language: Content | null
  slug: string | null
  date: string | null
  metadata: Metadata
  content: string |null
}

export enum Content {
  FEATURED = "featured",
  EN = "en",
  ID = "id",
}

export enum Category {
  BUSINESS = "business",
  PERSONAL = "personal",
  PROGRAMMING = "programming",
}
