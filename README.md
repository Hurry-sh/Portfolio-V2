# Harish Krishnan — Portfolio V2

A data-native portfolio for an AI & Platforms Engineer. Built with React and Vite, with custom canvas, SVG, and CSS motion rather than a heavy animation library.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Vite base path is configured for `https://hurry-sh.github.io/Portfolio-V2/`.

## Deploy

Every push to `main` builds and deploys the site through the GitHub Pages workflow in `.github/workflows/deploy.yml`.

Motion respects `prefers-reduced-motion`, the canvas pauses when off-screen, and the project cards remain fully usable with keyboard or touch input.
