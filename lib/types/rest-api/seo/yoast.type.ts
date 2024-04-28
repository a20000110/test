export interface YoastJsonInterface {
  og_image?: {
    url: string
  }[]
  title: string;
  description: string;
  robots: Robots;
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_published_time: string;
  article_modified_time: string;
  author: string;
  twitter_card: string;
  twitter_misc: Twittermisc;
  schema: Schema;
}
interface Schema {
  '@context': string;
  '@graph': Graph[];
}
interface Graph {
  '@type': string[] | string;
  '@id': string;
  isPartOf?: IsPartOf;
  author?: Author;
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  mainEntityOfPage?: IsPartOf;
  wordCount?: number;
  commentCount?: number;
  publisher?: IsPartOf;
  articleSection?: string[];
  inLanguage?: string;
  potentialAction?: PotentialAction[];
  url?: string;
  name?: string;
  description?: string;
  breadcrumb?: IsPartOf;
  itemListElement?: ItemListElement[];
  image?: Image;
  logo?: IsPartOf;
  sameAs?: string[];
}
interface Image {
  '@type': string;
  inLanguage: string;
  '@id': string;
  url: string;
  contentUrl: string;
  width: number;
  height: number;
  caption: string;
}
interface ItemListElement {
  '@type': string;
  position: number;
  name: string;
  item?: string;
}
interface PotentialAction {
  '@type': string;
  name?: string;
  target: string[] | Target2;
  'query-input'?: string;
}
interface Target2 {
  '@type': string;
  urlTemplate: string;
}
interface Author {
  name: string;
  '@id': string;
}
interface IsPartOf {
  '@id': string;
}
interface Twittermisc {
  '作者': string;
  '预计阅读时间': string;
}
interface Robots {
  index: string;
  follow: string;
  'max-video-preview': string;
  imageindex: string;
  archive: string;
  snippet: string;
}
