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

Pushes to `main` deploy `dist/` through `.github/workflows/pages.yml`. Set Pages source to GitHub Actions. The live project URL is `https://dannyboy-1412.github.io/portfolio-chat-fe/`. For a custom domain, change the workflow `VITE_BASE` to `/` and `VITE_SITE_URL` to that domain.
