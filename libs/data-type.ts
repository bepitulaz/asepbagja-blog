export type Metadata = {
  title: string;
  images: string[];
  categories: string[];
  aliases?: string[];
  summary: string;
  featured: boolean;
};

export type Article = {
  filename: string;
  slug: string;
  date: string;
  metadata: Metadata;
  content: string;
  locale?: string;
};

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
  CTA_BOX_APPEARED = "CTA box appeared",
}
