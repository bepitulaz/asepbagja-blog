---
description: "Full blog migration from Astro to Phoenix with multi-agent orchestration"
---

You are the orchestrator for migrating asepbagja.com from Astro JS to Elixir Phoenix.

## Context

- Astro source code: `../bepitulaz.github.io`
- Content destination: `../asepbagja-content`
- Phoenix app (this repo): `asepbagja-blog`
- The CLAUDE.md in this repo contains the full architecture spec. Read it first.

## Your job

You coordinate 5 subagents. Do NOT write code yourself. Your role is to:

1. Read CLAUDE.md to understand the architecture
2. Spawn agents in the correct order, with clear task descriptions
3. Wait for each agent to report back before spawning dependent agents
4. Verify the final result compiles and serves correctly

## Execution plan

### Phase 1 — Analysis (parallel)

Spawn these two agents in parallel:

**Agent: astro-analyzer**
Prompt: "Analyze the Astro blog at ../bepitulaz.github.io. I need you to document: (1) every route and its URL pattern, (2) all page templates/layouts and their HTML structure, (3) CSS/styling approach — is it Tailwind, custom CSS, or component-scoped? Extract the actual CSS. (4) SEO setup — meta tags, Open Graph, structured data, sitemap, RSS, canonical URLs. (5) All frontmatter fields used across blog posts. (6) How images are referenced and served. (7) Any JavaScript interactivity on pages. Write your findings to ./migration-notes/astro-analysis.md"

**Agent: content-migrator**
Prompt: "Set up the content repository at ../asepbagja-content. (1) Create the directory structure as specified in CLAUDE.md. (2) Copy all markdown blog posts from ../bepitulaz.github.io/src/content/blog/en/ to ../asepbagja-content/blog/en/ and ../bepitulaz.github.io/src/content/blog/id/ to ../asepbagja-content/blog/id/. (3) Copy about page markdown files. (4) Copy music/releases.json and workspace data. (5) Create the empty comments/ directory structure with en/ and id/ subdirectories. (6) Verify all frontmatter is valid YAML. (7) Create a README.md explaining the repo structure. Write a summary of what you did to ./migration-notes/content-migration.md"

### Phase 2 — Build Phoenix app (sequential, after Phase 1)

Wait for astro-analyzer to finish so we know the exact routes, styles, and SEO patterns.

**Agent: phoenix-builder**
Prompt: "Build the Phoenix application in this repo. Read CLAUDE.md for the full architecture spec and ./migration-notes/astro-analysis.md for the Astro analysis. Do the following: (1) Initialize a new Phoenix project here with --no-ecto --no-mailer --no-dashboard. (2) Add dependencies to mix.exs: mdex, yaml_elixir, req, jason. (3) Create all modules specified in CLAUDE.md: Blog.Content (GenServer), Blog.Post, Blog.Comment, Blog.Markdown, Blog.Cache, Blog.Github. (4) Set up the router exactly matching the URL patterns from the Astro analysis. (5) Create the webhook controller with GitHub signature verification. (6) Create the comment submission controller. (7) Add configuration in config/runtime.exs as specified in CLAUDE.md. (8) Make sure mix compile succeeds. Write a summary to ./migration-notes/phoenix-build.md"

### Phase 3 — Templates (after Phase 2)

**Agent: template-migrator**
Prompt: "Convert all Astro templates to Phoenix HEEx templates. Read ./migration-notes/astro-analysis.md for the original HTML structure and CSS. (1) Create the root layout (root.html.heex) matching the Astro site's HTML structure — same head tags, same body classes, same footer. (2) Create the app layout. (3) Create page templates: homepage, blog listing, blog post (with comments section), about, music, workspace. (4) Migrate ALL CSS — if the Astro site uses Tailwind, configure Tailwind in Phoenix. If it uses custom CSS, port it exactly. The visual design must match the existing site. (5) Create components for: post card (used in listings), comment display (threaded), navigation, SEO meta tags. (6) Ensure the templates render properly with sample data. Focus on visual fidelity — the migrated site should look identical to the Astro version. Write a summary to ./migration-notes/template-migration.md"

### Phase 4 — SEO verification (after Phase 3)

**Agent: seo-auditor**
Prompt: "Verify SEO parity between the Astro site and the Phoenix site. Read ./migration-notes/astro-analysis.md for the original SEO setup. Check: (1) Every route from the Astro site has a corresponding Phoenix route — list any missing routes. (2) Meta tags template generates correct title, description, og:title, og:description, og:image, twitter:card for every page type. (3) RSS feed controller generates valid XML at /:lang/feed.xml. (4) Sitemap controller generates valid sitemap.xml with all post URLs. (5) Canonical URLs are set on every page. (6) Robots.txt exists. (7) Structured data (JSON-LD) matches what Astro had. (8) Image alt tags are preserved. Write your audit to ./migration-notes/seo-audit.md with PASS/FAIL for each item and specific fixes needed."

### Phase 5 — Final integration

After all agents complete, YOU (the orchestrator) should:
1. Read all migration-notes/*.md files
2. Run `mix deps.get && mix compile` to verify everything compiles
3. Run `mix test` if tests exist
4. Start the server with `mix phx.server` and verify the homepage loads
5. Report the final status to me with any remaining issues
