# SRIKAR. — Beyond the Interface

Premium 3D portfolio for **G Srikarbabu** — React + Vite + TypeScript, Tailwind v4, React Three Fiber / Drei, GSAP + ScrollTrigger, Framer Motion, Lenis.

```bash
npm install
npm run dev       # local dev
npm run build     # production build -> dist/
npm run preview
```

## Everything personal lives in `src/data/`

| File | What to edit |
| --- | --- |
| `profile.ts` | Name, roles, hero/about copy, journey timeline, **education**, SEO text, site URL |
| `skills.ts` | All 11 categories / 102 technologies. Change a skill's level with the 3rd argument of `s(name, description, level)` — `'building' \| 'working' \| 'familiar' \| 'exploring'`. Set `SHOW_SKILL_LEVELS = false` to hide labels. No percentages anywhere. |
| `projects.ts` | The 9 projects. Set `status`, `links.live / github / caseStudy`, `media.image / video` (files in `public/projects/`). **Buttons only render for links you fill in.** |
| `achievements.ts` | Verified hackathon / expo records. Section + stat appear only when non-empty. |
| `social.ts` | `email`, `github`, `linkedin`, `formEndpoint`. Unset fields are hidden. With `formEndpoint` (Formspree, Web3Forms, your API) the form POSTs JSON; with only `email` it opens the visitor's mail app; with neither, the form isn't shown. |

### Things deliberately left blank (nothing invented)
- Contact details, GitHub, LinkedIn, education, achievements, project links/videos.
- Project `status` for 7 of 9 projects (only TELLI AI and GURUJI are `Concept`, as described in your brief). Search for `TODO: confirm`.
- Skill levels are a **conservative first pass** — review every one.

## Architecture
```
src/
  sections/   Hero · About · Projects · Skills · Contact
  scenes/     ChromeScene (hero liquid chrome) · TechnologyScene (skills constellation)
  components/ Loader · Cursor · Nav · Magnetic · SplitText · Reveal · ProjectCover · ui
  hooks/      useSmoothScroll (Lenis ↔ GSAP) · useEnv (reduced-motion, WebGL, viewport)
  data/       all content
```
Performance notes: both 3D scenes are lazy-loaded and only render while on screen; DPR is capped; the offline studio lighting needs no HDR download; three.js is split into its own chunk.
Accessibility: skip link, semantic landmarks, keyboard-focusable constellation nodes, a complete searchable skills index, reduced-motion support, WebGL fallback.

## SEO
Edit `index.html` (title, description, OG tags, JSON-LD), set the real domain in `public/robots.txt` and `public/sitemap.xml`, and replace `public/og-image.svg` with a 1200×630 PNG for best social previews.

## Admin panel (add / edit projects)

Open `/#/admin`. On first visit you choose a passcode (stored hashed in your browser). You can add, edit, reorder and delete projects; the site updates instantly.

**Important:** edits are saved in *your browser's localStorage* — there is no server. Use **Export backup** after editing, and **Import backup** to restore them or load them in another browser. The passcode is a local lock, not server security. A real shared CMS (Express + MongoDB, from the expansion spec) is the next step.

Highlighted CTA: `src/components/BookButton.tsx` (nav, hero, end of Projects, floating pill).
