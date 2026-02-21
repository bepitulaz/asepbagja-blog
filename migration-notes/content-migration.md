# Content Repository Audit

## Directory Structure

The content repo at `asepbagja-content` has this ACTUAL structure (note: content is in a `content/` subdirectory, NOT at the root):

```
asepbagja-content/
  content/
    blog/
      en/   ← 44 English blog posts
      id/   ← 32 Indonesian blog posts
    about/
      en.md ← English about page (no frontmatter, plain markdown)
      id.md ← Indonesian about page (no frontmatter, plain markdown)
    music/
      releases.json ← Music discography data
    workspace/
      en.json ← Workspace gear data
  comments/
    en/  ← (empty, no migrated comments yet)
    id/  ← (empty, no migrated comments yet)
  public/
    blog-img/     ← blog featured images
    images/       ← general images
    music-img/    ← music artwork
    portfolio-img/ ← portfolio images
    workspace-img/ ← workspace photos
    favicon*.png, apple-touch-icon.png, etc.
    robots.txt
```

## Frontmatter Validation

Actual frontmatter fields (from content/blog/en/full-stack-clojure-project.md):
```yaml
title: Full Stack Clojure Project
date: 2015-05-26
images:
- "https://upload.wikimedia.org/..."
categories:
- Programming
summary: "Why I'm deeply in love with Clojure?"
```

Actual frontmatter fields (from content/blog/id/40km-pertama-bersepeda.md):
```yaml
title: "40 Kilometer Pertama Lewat EuroVelo 10"
date: 2022-07-17
images:
- "/blog-img/eurovelo-1.jpg"
categories:
- Estonia
summary: "Mencoba bersepeda agak jauh..."
lang: "Bahasa Indonesia"
featured: true
```

**Key finding**: Frontmatter uses `images` (array) and `categories` (array), NOT `featuredImage` and `category` as CLAUDE.md spec says.

## Slug Derivation

Do NOT strip date prefixes. The slug = filename without `.md`.

- `2016-personal-challenges.md` → slug: `2016-personal-challenges`
- `full-stack-clojure-project.md` → slug: `full-stack-clojure-project`
- `40km-pertama-bersepeda.md` → slug: `40km-pertama-bersepeda`

## Music Data (releases.json)

```json
{
  "records": [
    { "title": "Pallasti", "year": "2025", "single": true, "artwork": "/music-img/pallasti.jpg", "link": "..." },
    { "title": "Home Planet", "year": "2024", "single": true, "artwork": "...", "link": "..." },
    ...9 total releases from 2022-2025...
  ]
}
```

## Workspace Data (workspace/en.json)

JSON with sections: `laptop`, `coding`, `music`, `video`. Each item: `{name, description, image, link}`.

## Phoenix App Path Implications

Since the content repo is cloned to `priv/content/`, the GenServer must use these paths:
- English posts: `priv/content/content/blog/en/`
- Indonesian posts: `priv/content/content/blog/id/`
- About EN: `priv/content/content/about/en.md`
- About ID: `priv/content/content/about/id.md`
- Music: `priv/content/content/music/releases.json`
- Workspace: `priv/content/content/workspace/en.json`
- Comments EN: `priv/content/comments/en/`
- Comments ID: `priv/content/comments/id/`

## Status: All Content Migrated

All 44 English and 32 Indonesian blog posts are present in the content repo.
The about pages, music data, and workspace data are all present.
Comments directories exist but are empty (no Disqus migration needed — native comments only).
