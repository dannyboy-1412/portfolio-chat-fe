# Daniel Rodrigues — portfolio

Static Vite + React site. Content lives in `src/shared/profile.ts` and `src/shared/projects.ts`.

```bash
npm install
npm run dev
```

Dev server: [http://localhost:5173/](http://localhost:5173/). Build and preview also use `/`. Set `VITE_BASE=/portfolio-fe/` if you still publish under the GitHub project URL.

```bash
npm run build
npm run preview
```

`npm run build` writes `dist/` with `404.html` and `dist/projects/<slug>/index.html` so GitHub Pages can serve project URLs. Deploy that folder yourself.
