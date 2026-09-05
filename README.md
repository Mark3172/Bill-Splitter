# Myo Set Paing — Portfolio v2

A modernized rebuild of [mark-portfolio](https://github.com/Mark3172/mark-portfolio) with a
professional design system and fully viewable projects (in-page Figma prototype player,
GitHub links, and case studies).

## What's new vs. the old portfolio

- **Watch projects on the page** — Figma prototypes open in an embedded preview modal, so
  visitors can click through your designs without leaving the site.
- **Development projects added** — Bill Splitter, GreenLens AI, Spatial 3D Music Player,
  and the JPMC Forage program now appear alongside the design work, with GitHub links and
  auto-generated repo preview images.
- **Filterable project grid** — All / UI/UX Design / Development tabs.
- **Professional design system** — Space Grotesk + Inter typography, refined dark and light
  themes, consistent cards, accessible focus states, and `prefers-reduced-motion` support.
- **SEO & sharing** — proper title, meta description, and Open Graph tags.
- Removed the fake loading screen and "coming soon" placeholders for a cleaner first impression.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Netlify

Option A — copy into your existing `mark-portfolio` repo (recommended):

1. Copy everything in this `portfolio/` folder over the contents of `mark-portfolio`.
2. Commit and push — Netlify redeploys automatically.

Option B — deploy straight from this repo:

1. In Netlify, create a site from `Mark3172/Bill-Splitter`.
2. Set **Base directory** to `portfolio`, build command `npm run build`, publish `portfolio/dist`.

## Editing your projects

All project content lives in one file: `src/data/projects.js`. Add a new object to the
array (title, description, tags, links) and the card, filters, and preview modal are
generated automatically. Your photo is at `public/profile-photo.jpeg` — replace that file
to update it.
