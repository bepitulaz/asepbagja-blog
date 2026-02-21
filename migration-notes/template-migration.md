# Template Migration: Astro → Phoenix HEEx

## Summary

All Astro blog templates have been converted to Phoenix HEEx templates. The following changes were made across 10 steps.

---

## Step 1: Root Layout (`lib/blog_web/components/layouts/root.html.heex`)

Replaced the minimal Phoenix scaffold with a production-quality root layout including:

- Full SEO meta tags: `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`), Twitter Card
- Favicon links (apple-touch-icon, favicon-32x32, favicon-16x16, safari-pinned-tab)
- RSS feed alternate links for EN and ID
- Google Fonts: "Archivo Black" via `<link>` preconnect + stylesheet
- Plausible analytics script (deferred, `data-domain="asepbagja.com"`)
- Body classes: `bg-white dark:bg-slate-800 dark:text-neutral-200 flex flex-col min-h-screen`
- Dynamic `<title>` from `assigns[:meta_title]` with fallback

Meta assigns are populated by controllers and fall back to sensible defaults if absent.

---

## Step 2: App Layout (`lib/blog_web/components/layouts.ex`)

The `app/1` function was simplified to a pass-through wrapper. Navigation and footer are now rendered inside each page template (not the layout), allowing full per-page control.

```elixir
def app(assigns) do
  ~H"""
  <.flash_group flash={@flash} />
  {render_slot(@inner_block)}
  """
end
```

---

## Step 3: Shared Components (`lib/blog_web/components/core_components.ex`)

Two new components were added to `BlogWeb.CoreComponents`:

### `navbar/1`

- `attr :lang, :string, default: "en"`
- Sticky floating pill-shaped navbar: `sticky top-0 z-50 max-w-2xl rounded-[2rem]`
- English links: `/discography`, `/blog`, `/about`
- Indonesian links (when `lang="id"`): `/id/diskografi`, `/id/blog`, `/id/tentang`
- Mobile hamburger button (`id="navbar-toggle"`) toggling `id="navbar-menu"`
- Full dark mode support

### `site_footer/1`

- Three-column layout: logo / copyright / social icons
- Background: `bg-emerald-300 dark:bg-emerald-900`
- Social links: X/Twitter, GitHub, Patreon (with SVG icons)
- Dynamic copyright year: `Date.utc_today().year`

---

## Step 4: CSS (`assets/css/app.css`)

Added after the existing Tailwind/daisyUI configuration:

**Archivo Black font theme variable:**
```css
@theme {
  --font-archivo: "Archivo Black", sans-serif;
}
```

This makes the `font-archivo` Tailwind utility class available.

**Blog content CSS (`.blog` wrapper):**
- Links: blue underlined, bold
- Paragraphs, headings (h2–h4) with proper spacing and font weights
- Lists: disc/decimal, 2.5rem left margin, 1.2rem font size
- Figures and images: centered, 70% width (100% on mobile)
- Blockquotes: left border 10px #ccc, open-quote pseudo-element
- Code/pre: light gray background, border-radius
- Responsive: full-width images on mobile (max-width: 767px)

---

## Step 5: JavaScript (`assets/js/app.js`)

Added navbar mobile toggle after `liveSocket.connect()`:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navbar-toggle");
  const menu = document.getElementById("navbar-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }
});
```

This replaces the Preline UI dependency from the original Astro site.

---

## Step 6: Endpoint (`lib/blog_web/endpoint.ex`)

Added a second `Plug.Static` mount to serve static files from the cloned content repo:

```elixir
plug Plug.Static,
  at: "/",
  from: "priv/content/public",
  gzip: false
```

This serves `/blog-img/`, `/images/`, `/portfolio-img/`, `/workspace-img/`, `/music-img/`, and `/favicon*` files from the content repository's `public/` directory.

---

## Step 7: Controllers — Meta Assigns

Both `PageController` and `PostController` were updated to set SEO meta assigns on every action:

- `:meta_title` — page-specific title string
- `:meta_description` — short description for meta/OG
- `:og_image` — featured image URL for Open Graph
- `:og_url` — canonical URL for the page
- `:og_type` — `"article"` for posts, `"website"` for listing/static pages

---

## Step 8: Page Templates

### `home.html.heex` (English homepage)
- `<.navbar />` (English)
- Hero: "ASEP BAGJA / Code & Music" using `font-archivo` at up to 9xl size
- Latest Works section (bg-blue-200): 3 portfolio cards (Nanas Sound, Sonastik, Bandcamp)
- Patreon support section (bg-yellow-200)
- Latest Blog Posts: 2-column overlay card grid with featured images and gradient overlay
- `<.site_footer />`

### `home_id.html.heex` (Indonesian homepage)
- `<.navbar lang="id" />`
- Hero: "ASEP BAGJA / Kode & Musik"
- Music Releases section (bg-blue-200): grid of up to 4 releases with artwork, title, year
- "Lihat semua rilis" link to /id/diskografi
- Patreon support section in Indonesian
- Latest Blog Posts (4 most recent ID posts)
- `<.site_footer />`

### `about.html.heex` / `about_id.html.heex`
- Navbar (correct lang), centered header section
- Blog content body wrapped in `div.blog` for styled rendering
- Footer

### `discography.html.heex` / `discography_id.html.heex`
- 4-column grid of release cards
- Each card: artwork image with hover scale, title, year, "Single" badge if applicable
- Links open in new tab

### `workspace.html.heex`
- Iterates `@workspace` map sections (laptop, coding, music, video)
- Each section: 3-column card grid with image, name, description, "Learn more" link
- External link SVG icon on "Learn more"

---

## Step 9: Post Templates

### `all_posts.html.heex` / `all_posts_id.html.heex`
- 3-column card grid layout
- Each card: featured image (with hover scale), category badge, date, title, summary (line-clamp-3), "Continue reading" link with arrow icon

### `index.html.heex` / `index_id.html.heex`
- Same 3-column card grid for category listing pages
- Category name displayed as page title (capitalized)

### `show.html.heex` (individual English post)
- `<.navbar />` (English)
- Post header: category pill link, date, title (4xl–5xl), summary, featured image
- Post body: `div.blog` with `Phoenix.HTML.raw(@post.body_html)`
- Category tag section with pill link
- Comments section with emerald left-border styling
  - Comment avatar (initial letter), author name, date
  - Comment body in `div.blog`
- Comment form with CSRF token, author input, body textarea
  - Posts to `/{post.category}/{post.slug}/comments`
  - Emerald submit button
- `<.site_footer />`

### `show_id.html.heex` (individual Indonesian post)
- Mirror of `show.html.heex` with Indonesian labels
- `<.navbar lang="id" />`
- Category and comment form post to `/id/{post.category}/{post.slug}/comments`
- "Komentar", "Tinggalkan komentar", "Kirim Komentar" labels

---

## Design Decisions

1. **No Preline UI** — replaced `hs-collapse` with a plain JS toggle (`classList.toggle("hidden")`)
2. **No LiveView** — all pages use standard Phoenix controllers and HEEx templates
3. **Archivo Black font** — loaded via Google Fonts and referenced as `font-archivo` Tailwind class via `@theme` in CSS
4. **Dark mode** — all templates use `dark:` variants for full dark mode support
5. **Flash group** — managed by the `app` layout, not repeated in individual templates
6. **Static assets** — served from `priv/content/public` via a second `Plug.Static` mount

---

## Files Changed

| File | Change |
|---|---|
| `lib/blog_web/components/layouts/root.html.heex` | Full SEO root layout |
| `lib/blog_web/components/layouts.ex` | Simplified app layout (pass-through) |
| `lib/blog_web/components/core_components.ex` | Added `navbar/1` and `site_footer/1` |
| `assets/css/app.css` | Added `@theme` font var + `.blog` CSS |
| `assets/js/app.js` | Added navbar mobile toggle |
| `lib/blog_web/endpoint.ex` | Added Plug.Static for content repo public/ |
| `lib/blog_web/controllers/page_controller.ex` | Added meta assigns to all actions |
| `lib/blog_web/controllers/post_controller.ex` | Added meta assigns to all actions |
| `lib/blog_web/controllers/page_html/home.html.heex` | Full English homepage |
| `lib/blog_web/controllers/page_html/home_id.html.heex` | Full Indonesian homepage |
| `lib/blog_web/controllers/page_html/about.html.heex` | About page |
| `lib/blog_web/controllers/page_html/about_id.html.heex` | Indonesian about page |
| `lib/blog_web/controllers/page_html/discography.html.heex` | Discography grid |
| `lib/blog_web/controllers/page_html/discography_id.html.heex` | Indonesian discography |
| `lib/blog_web/controllers/page_html/workspace.html.heex` | Workspace gear page |
| `lib/blog_web/controllers/post_html/all_posts.html.heex` | English blog listing |
| `lib/blog_web/controllers/post_html/all_posts_id.html.heex` | Indonesian blog listing |
| `lib/blog_web/controllers/post_html/index.html.heex` | English category listing |
| `lib/blog_web/controllers/post_html/index_id.html.heex` | Indonesian category listing |
| `lib/blog_web/controllers/post_html/show.html.heex` | English post detail |
| `lib/blog_web/controllers/post_html/show_id.html.heex` | Indonesian post detail |
