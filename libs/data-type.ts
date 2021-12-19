export type Metadata = {
  title: string | null;
  images: string[] | null;
  categories: string[] | null;
  aliases: string[] | null;
  summary: string | null;
};

export type Article = {
  filename: string;
  language?: Language;
  slug?: string;
  date?: string;
  metadata: Metadata;
  content?: string;
};

export enum Content {
  FEATURED = "featured",
  EN = "en",
  ID = "id",
}

export enum Language {
  EN = "English",
  ID = "Bahasa Indonesia",
}

export enum Category {
  BUSINESS = "business",
  PERSONAL = "personal",
  PROGRAMMING = "programming",
}
