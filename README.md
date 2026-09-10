# Daniel Rodrigues — portfolio

Static Vite + React site. Content lives in `src/shared/profile.ts` and `src/shared/projects.ts`.

```bash
npm install
npm run dev
```

Dev server: [http://localhost:5173/](http://localhost:5173/). Local Vite uses `/`.

```bash
npm run build
npm run preview
```

`npm run build` writes `dist/` with `404.html` and `dist/projects/<slug>/index.html` so GitHub Pages can serve project URLs.

Pushes to `main` deploy `dist/` through `.github/workflows/pages.yml`. Set Pages source to GitHub Actions. The live site URL is `https://dannyboy-1412.github.io/`. Vite `base` is `/`. For a custom domain, set `VITE_SITE_URL` to that domain.
