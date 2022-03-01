export type Metadata = {
  title: string | null;
  images: string[] | null;
  categories: string[] | null;
  aliases: string[] | null;
  summary: string | null;
};

export type Article = {
  filename: string;
  language: Language | null;
  slug: string | null;
  date: string | null;
  metadata: Metadata;
  content: string | null;
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

export enum CategoryEN {
  BUSINESS = "business",
  PERSONAL = "personal",
  PROGRAMMING = "programming",
  MUSIC = "music",
  ESTONIA = "estonia",
}

export enum CategoryID {
  BUSINESS = "bisnis",
  PERSONAL = "pribadi",
  PROGRAMMING = "pemrograman",
  MUSIC = "musik",
  ESTONIA = "estonia",
}

export enum TrackingEvent {
  READ_UNTIL_END = "Read until end",
  FINANCIAL_BOX_APPEARED = "Financial box appeared",
}
