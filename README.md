# KVMverse Code Studio

Production marketing site for **KVMverse Code Studio** — a premium single-page experience with scroll parallax, Framer Motion, and a lightweight React Three Fiber hero.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber + Drei (procedural 3D, no heavy GLTFs)
- Lenis smooth scrolling
- Lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/                 # App Router layout, page, globals
  components/
    layout/            # Navbar, Footer, SmoothScroll
    sections/          # Hero, About, Services, Process, Work, Team, Contact
    three/             # R3F hero scene
    ui/                # Buttons, headings, parallax helpers
  hooks/               # Reduced motion + mobile helpers
  lib/                 # Constants + className helper
```

## Design notes

- Near-black base with a coral accent used sparingly
- Display: Syne · Body: DM Sans
- Hero 3D degrades to a lightweight CSS glow on mobile
- `prefers-reduced-motion` disables Lenis, parallax, and heavy animation
- Contact form is client-side only (wires to your API / email service later)

## Headline options (for copy iteration)

1. We build the internet's next favorite thing *(current)*
2. Code that doesn't feel like code
3. Ship software people actually want to open
4. Products with taste. Code with teeth.
