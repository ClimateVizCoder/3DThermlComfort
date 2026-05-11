# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server (localhost:3000)
pnpm build      # production build (ESLint and TypeScript errors are suppressed — see next.config.js)
pnpm lint       # run ESLint
pnpm start      # serve production build
```

There is no test suite.

## Architecture

This is a **Next.js 14 App Router** single-page portfolio website for Manuel Kipp (thermal comfort engineer / PhD). It uses pnpm, React 19, TypeScript, Tailwind CSS v3, shadcn/ui, and Framer Motion.

### Data flow and i18n

All UI text supports **German (DE) and English (EN)**. The active language is stored in `localStorage` and provided globally via `contexts/language-context.tsx`, which exposes `{ language, setLanguage, t }`.

- The canonical translation strings live in **`app/translations.ts`** as a nested object keyed by `de` / `en`. The `t("some.key")` function resolves dot-separated paths into that tree.
- **`translations.ts`** at the repo root is a stale placeholder with flat English-only strings — it is not imported anywhere meaningful. Ignore it.
- Many data objects (skills, hobbies, work history, publications) in `app/page.tsx` are also bilingual inline objects with the shape `{ de: "...", en: "..." }`, resolved at render time with `item.name[language]`.

When adding new visible text, add both `de` and `en` keys to `app/translations.ts` and access them via `t()` in components.

### Page structure

The entire page is one long component (`app/page.tsx`) rendered as a single scroll document. Section IDs match the navigation anchors: `über-mich`, `skills`, `sprachen`, `industrieerfahrung`, `werdegang`, `veröffentlichungen`, `interessen`, `kontakt`, `dokumente`.

An `IntersectionObserver` tracks which section is active for the fixed dot-navigation on the right side. The sticky `Header` (`components/header.tsx`) only renders once the user scrolls past 100px.

All content data (work experience, projects, publications, skills, languages, hobbies) is hardcoded as TypeScript constants near the top of `app/page.tsx`. The `ErfahrungBlock` component renders all accordion-style content items generically from these arrays.

### Contact form

The contact form (`ContactSection` in `app/page.tsx`) sends email via **EmailJS**. Credentials are in `lib/emailjs.ts` (service/template/public-key). Spam protection is layered inline in the submit handler: localStorage rate-limiting (3 attempts / 15 min), honeypot field, minimum fill time (3s), session token, email regex, URL count limit, and input sanitization. `lib/form-security.ts` and `lib/rate-limiter.ts` provide equivalent utility classes but the active form does **not** use them — the logic is duplicated inline. If refactoring the form, switch to the library helpers to remove the duplication.

### Image hosting

Project images in the slider are hosted on **Vercel Blob** (`urlyaqdfmocz1d9x.public.blob.vercel-storage.com`). Static assets (logos, profile photo) are under `public/images/`. The Next.js image config allows both domains and has `unoptimized: true`.

### UI components

`components/ui/` contains shadcn/ui primitives (Button, Input, Textarea, Accordion, Toast). The brand color used throughout is `#1a365d` (dark navy). Tailwind classes use CSS variables for theme tokens defined in `app/globals.css` / `styles/globals.css`.

### Build quirks

`next.config.js` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, so `pnpm build` will succeed even with type errors. Run `pnpm lint` and `tsc --noEmit` manually to surface issues.
