# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

A single-page bilingual (German/English) personal portfolio / CV website for
Manuel Kipp — a thermal-comfort researcher and founder of ThermalNext. It was
originally scaffolded and is still iterated on via **v0.app** (see
`generator: 'v0.app'` in `app/layout.tsx` and the `components.json` shadcn
config) and deploys to Vercel. There is no backend/API — content (bio, work
history, publications, skills) is hardcoded as JS objects directly in the
page component, and the contact form sends mail client-side via EmailJS.

## Stack

- **Next.js 14** (App Router, `app/` directory), **React 19**, TypeScript
  (`strict: true`)
- **Tailwind CSS 3** + **shadcn/ui** (`components/ui/*`, config in
  `components.json`, base color `neutral`, no class prefix)
- **framer-motion** for animations/transitions, **lucide-react** and
  **react-icons** (`Fa*`, `Gi*`) for icons
- **@emailjs/browser** for the contact form (no server route)
- Package manager: **pnpm** (`pnpm-lock.yaml` is the source of truth — don't
  introduce `package-lock.json` or `yarn.lock`)

## Commands

```bash
pnpm install
pnpm dev      # next dev
pnpm build    # next build
pnpm start    # next start (serve production build)
pnpm lint     # eslint .
```

There is no test suite and no CI configuration (`.github/workflows` does not
exist). `next.config.js` sets `eslint.ignoreDuringBuilds: true` and
`typescript.ignoreBuildErrors: true`, so `pnpm build` will succeed even with
lint/type errors — run `pnpm lint` and `tsc --noEmit` yourself if you want
those checks enforced.

## Structure

```
app/
  page.tsx           # THE app — ~2000 lines, one big client component (see below)
  layout.tsx          # root layout: fonts (DM Sans, Fraunces), LanguageProvider, Toaster
  translations.ts     # DE/EN copy actually used by the site (via useLanguage/t())
  globals.css         # Tailwind base + CSS variables for the shadcn theme
  types.ts            # Translation type shape (partially out of date, see below)
contexts/
  language-context.tsx # LanguageProvider/useLanguage — DE/EN toggle, persisted to localStorage
components/
  ui/                 # shadcn primitives (button, input, textarea, accordion, toast...)
  header.tsx           # sticky header shown once the user scrolls past the hero
  cookie-banner.tsx     # simple consent banner
  *Divider*.tsx, *Separator*.tsx  # decorative section dividers used between page sections
lib/
  emailjs.ts            # thin wrapper around @emailjs/browser
  form-security.ts       # honeypot/timing/session-token/sanitization helpers for the contact form
  rate-limiter.ts        # localStorage-backed client-side rate limiter for form submissions
  utils.ts               # cn() (clsx + tailwind-merge)
public/images/          # project photos, partner logos, profile picture
```

### `app/page.tsx` is the actual app

Nearly all UI — hero, skills, languages, industry experience/timeline,
publications, hobbies, contact form, image slider, in-page vertical dot
navigation — is defined **inline in `app/page.tsx`** as local components
(`ProjectImageSlider`, `HobbiesSection`, `ContactSection`, `TimelineItem`,
`TimelineBlock`, `InfoCard`, `CardListByYear`, and a `VerticalNavigation`
defined *inside* `Home`), not imported from `components/`. All CV content
(work history, education, publications, talks, skills, hobbies) lives in
plain JS objects near the top of this file with `{ de, en }` shape per
string.

**When editing CV/bio content or page sections, edit `app/page.tsx` directly.**
Don't assume the similarly-named files under `components/` are in use.

### Known dead/duplicate files — don't edit these expecting them to do anything

- `components/ContactSection.tsx`, `components/ErfahrungBlock.tsx`,
  `components/cv-section.tsx`, `components/VerticalNavigation.tsx` are legacy
  v0 iterations **not imported anywhere**; `app/page.tsx` defines its own
  same-named components inline instead. Confirm with a repo-wide grep before
  touching them — if a task is about "the contact form" or "the timeline",
  it almost certainly means the inline version in `app/page.tsx`.
- `/translations.ts` (repo root) is an old scaffold **not imported** by
  anything — the live translations are `app/translations.ts`, consumed via
  `contexts/language-context.tsx`. Edit `app/translations.ts`.
- `app/types.ts` describes an older, smaller translation shape than what
  `app/translations.ts` actually contains (e.g. it's missing `nav.aboutMe`,
  `sections`, `career`, `industryExperience`, etc.). It isn't enforced
  anywhere (`useLanguage().t()` returns `string | any`), so don't treat it as
  authoritative — update it only if you want to keep it in sync while adding
  new translation keys.

## Conventions

- Bilingual content is modeled as `{ de: "...", en: "..." }` objects (or
  plain strings for language-independent CV structure like `year`, `doi`,
  `tools`). Access the current string via `field[language]` or
  `typeof field === "string" ? field : field[language]`, mirroring the
  existing helpers in `app/page.tsx` (e.g. inside `TimelineItem`, `InfoCard`).
  Default language is German (`de`) — see `LanguageProvider`'s initial state.
- Reusable copy (labels, nav, section titles) goes through
  `useLanguage().t("namespace.key")` against `app/translations.ts`; one-off
  CV content (job history, papers) is inlined as bilingual objects instead of
  going through `t()`.
- Brand accent color is the literal `ACCENT = "#E63C2D"` (with
  `ACCENT_DARK = "#C32A1C"`) constant defined in `app/page.tsx`, used via
  inline `style={{ color: ACCENT }}` rather than a Tailwind color token —
  follow this pattern for new accent-colored UI rather than adding a new
  Tailwind color.
- shadcn/ui primitives in `components/ui/` follow the standard shadcn
  pattern (Radix + `cva` + `cn()` from `lib/utils.ts`). Add new primitives
  via the same pattern (or `npx shadcn add <component>`) rather than
  hand-rolling.
- The contact form's client-side security stack (honeypot field, minimum
  fill time, session token, localStorage rate limiting, input sanitization)
  is duplicated between the inline `ContactSection` in `app/page.tsx` and the
  standalone helpers in `lib/form-security.ts` / `lib/rate-limiter.ts`. The
  inline version in `page.tsx` is what's actually wired up and running in
  production; the `lib/` helpers look like an extraction that was never
  fully swapped in. If you touch form security logic, check whether the
  change needs to be made in both places or just `page.tsx`.
- EmailJS service ID, template ID, and public key are hardcoded in
  `app/page.tsx`'s `handleSubmit` (not in env vars). There is no `.env` file
  in this repo (`.env*` is gitignored). Treat these as public client-side
  keys, not secrets — EmailJS keys are designed to be exposed in frontend
  code and are scoped/rate-limited server-side.
- Images are unoptimized (`images.unoptimized: true` in `next.config.js`);
  many project photos are hosted on Vercel Blob Storage
  (`*.public.blob.vercel-storage.com`) and referenced by absolute URL rather
  than checked into `public/`.

## Notes for making changes

- This is a marketing/CV site, not an application with business logic —
  most "features" are content and presentation. Prefer minimal, targeted
  edits to the relevant section in `app/page.tsx` over introducing new
  abstractions/components, consistent with the existing style of large
  inline component definitions.
- There's no test suite; verify changes by running `pnpm dev` and checking
  the page in a browser (both `DE` and `EN` via the header toggle, and at
  mobile/desktop widths — the layout leans heavily on Tailwind responsive
  classes and `framer-motion` viewport-triggered animations).
- Comments in existing code mix German and English (e.g. section header
  comments like `// Sprachdaten`, `// Hauptkomponente`); match the
  surrounding file's language when adding comments near existing German
  comments rather than switching everything to English.
