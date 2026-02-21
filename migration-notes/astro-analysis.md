# Astro Site Analysis

## CRITICAL: URL Structure (Differs from CLAUDE.md Spec)

The CLAUDE.md spec says `/:lang/:category/:slug`, but the ACTUAL live Astro URLs are:

**English routes (no /en/ prefix):**
- `/` — English homepage
- `/about` — English about page (hardcoded, NOT from markdown)
- `/discography` — Music discography
- `/workspace` — Workspace page
- `/blog` — All blog posts listing (both languages)
- `/works` — Works/portfolio page (coming soon page)
- `/:category` — Category listing (e.g., `/programming`, `/personal`)
- `/:category/:slug` — Individual post (e.g., `/programming/full-stack-clojure-project`)

**Indonesian routes (/id/ prefix):**
- `/id` — Indonesian homepage
- `/id/tentang` — Indonesian about (from `content/about/id.md`)
- `/id/diskografi` — Indonesian discography
- `/id/blog` — Indonesian blog listing
- `/id/:category` — Indonesian category listing (e.g., `/id/estonia`)
- `/id/:category/:slug` — Indonesian post (e.g., `/id/estonia/40km-pertama-bersepeda`)

**Important**: English posts have NO language prefix in the URL. The `/:lang/:category/:slug` pattern from CLAUDE.md would break all existing English post URLs.

## Frontmatter Schema (ACTUAL - differs from CLAUDE.md)

CLAUDE.md says `category` (singular string) and `featuredImage`. The actual content uses:

```yaml
title: "Post Title"          # string, required
date: 2024-01-15             # date, required
images:                       # array of strings, required (first = featured image)
  - "/blog-img/some-image.jpg"
categories:                   # array of strings, required (first = URL category)
  - "Programming"
summary: "Short description"  # string, required
featured: true                # boolean, optional
lang: "Bahasa Indonesia"      # string, optional (some ID posts only)
```

- `images` not `featuredImage` — the FIRST element is the featured image
- `categories` not `category` — array; use `categories[0].downcase()` for URL
- Category values are capitalized in frontmatter (e.g., "Programming") but lowercased in URLs

## Slug Derivation

Slug = filename without `.md` extension, NO date stripping.

Examples:
- `full-stack-clojure-project.md` → slug: `full-stack-clojure-project`
- `2016-personal-challenges.md` → slug: `2016-personal-challenges` (keep the year)
- `40km-pertama-bersepeda.md` → slug: `40km-pertama-bersepeda`

**Do NOT strip date prefixes** — the Astro site keeps the full filename as the slug.

## Content Repo Path Structure

The content repo is cloned to `priv/content/`. The actual layout inside the repo is:

```
content/          ← this is the content/ subdir inside the cloned repo
  blog/
    en/           ← blog posts in English (44 files)
    id/           ← blog posts in Indonesian (32 files)
  about/
    en.md         ← English about content (no frontmatter)
    id.md         ← Indonesian about content (no frontmatter)
  music/
    releases.json ← music discography
  workspace/
    en.json       ← workspace gear
comments/         ← at repo root (not inside content/)
  en/
  id/
public/           ← static assets (images, favicons)
  blog-img/
  images/
  music-img/
  portfolio-img/
  workspace-img/
```

So Blog.Content GenServer must look in:
- `priv/content/content/blog/en/` for English posts
- `priv/content/content/blog/id/` for Indonesian posts
- `priv/content/content/about/en.md` and `id.md` for about pages
- `priv/content/content/music/releases.json`
- `priv/content/content/workspace/en.json`
- `priv/content/comments/en/` and `comments/id/` for comments

## Design / CSS

**Typography:**
- Font: "Archivo Black" from Google Fonts (used for headings)
- CSS: `@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');`
- Tailwind custom font: `fontFamily: { archivo: ["Archivo Black", "sans-serif"] }`

**Framework:** Tailwind CSS v3 + Preline UI plugin (for navbar collapse)

**Body classes:** `bg-white dark:bg-slate-800 dark:text-neutral-200`

**Color scheme:**
- Background: white / dark:slate-800
- Text: gray-800 / dark:neutral-200
- Footer: bg-emerald-300 / dark:bg-emerald-900
- Links in blog content: #2563eb (blue-600)
- Category badges: bg-gray-100 text-gray-800

**Blog content styles (applied to `div.blog`):**
```css
div.blog a { color: #2563eb; text-decoration: underline; font-weight: 600; }
div.blog p { margin-top: 1.5rem; margin-bottom: 1.5rem; }
div.blog h3 { font-weight: 600; font-size: 1.5rem; }
div.blog ol, div.blog ul { margin-left: 2.5rem; font-size: 1.2rem; line-height: 2.25rem; list-style-type: disc; }
div.blog ol { list-style-type: decimal; }
div.blog .figure { text-align: center; margin-top: 1.5rem; margin-bottom: 1.5rem; }
div.blog .figure img, div.blog p img { width: 70%; display: block; margin: auto; }
div.blog blockquote { background: #f9f9f9; border-left: 10px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px; }
div.blog blockquote:before { color: #ccc; content: open-quote; font-size: 4em; }
div.blog figcaption { font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem; }
@media (max-width: 767.98px) { div.blog .figure img { width: 100%; } }
```

## SEO Setup

**Layout.astro uses `astro-seo` package which generates:**
- `<title>` tag
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta property="og:image">`
- `<meta property="og:url">`
- `<meta property="og:type">`
- `<meta name="twitter:creator" content="@bepituLaz">`

**Favicons (all pages):**
```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#af2424" />
<link rel="sitemap" href="/sitemap-index.xml" />
```

**Analytics:** Plausible (defer) at `https://plausible.io/js/script.js` with `data-domain="asepbagja.com"`

**Per page OpenGraph:**
- Homepage: type=website, url=https://www.asepbagja.com, image=/images/paljassaare.jpg
- Blog listing: type=website, url=.../blog, image=/images/blog.png
- Post: type=website, url=https://www.asepbagja.com/{category}/{slug}, image=first article image
- Category: type=website, url=.../category, image=first article image
- About: image=/images/about.jpg
- Discography: image=/images/discography.png

## Homepage Sections

**English homepage (/):**
1. Navbar
2. Hero — "ASEP BAGJA / Code & Music" (font-archivo, massive text)
3. LatestWorks section (bg-blue-200) — 3 cards: Nanas Sound, Sonastik, music
4. PatreonSupport section (bg-yellow-200) — Patreon call-to-action
5. LatestBlog — 4 most recent posts (any language, sorted by date), overlay cards with featured images
6. Footer

**Indonesian homepage (/id):**
1. NavbarIndonesia
2. HeroIndonesia
3. MusicReleases (latest music releases)
4. LatestBlog (lang="id", 4 latest ID posts)
5. Footer

## Navbar

**English navbar (sticky, floating pill shape):**
- Logo: "asep.bagja" linking to /
- Links: discography → /discography, blog → /blog, about → /about
- Mobile: collapsible via Preline hs-collapse
- Classes: `sticky top-0 z-50`, `max-w-2xl rounded-[2rem] bg-white border border-gray-200`

**Footer:**
- bg-emerald-300 dark:bg-emerald-900
- 3 columns: logo, copyright, social icons (X/Twitter, GitHub, Patreon)

## JavaScript

- **Preline UI** — for navbar mobile collapse (`hs-collapse-toggle`)
- **Disqus** — embedded comments on post pages (to be replaced with native comments)
- **Plausible** — analytics

## Content Schema (from Astro config.ts)

```typescript
blogCollection: {
  title: z.string(),
  date: z.date(),
  images: z.array(z.string()),
  categories: z.array(z.string()),
  featured: z.boolean().optional(),
  summary: z.string(),
}

musicCollection: {
  records: [{
    title: string, year: string, single: boolean,
    artwork: string, link: string
  }]
}

workspaceCollection: {
  laptop: [{name, description, image, link}],
  coding: [{name, description, image, link}],
  music: [{name, description, image, link}],
  video: [{name, description, image, link}]
}
```

## Image References

- Blog post featured images: `/blog-img/filename.jpg` (served from CDN/public)
- Some older posts use full URLs: `https://upload.wikimedia.org/...`
- The app does NOT need to serve blog-img (CDN handles it), but the static public/ assets (favicons, portfolio images, workspace images) need to be served

## Comments (Current: Disqus)

Posts currently use Disqus (`https://asepnew.disqus.com/embed.js`). The Phoenix migration replaces Disqus with the native comment system (markdown files in content repo).
