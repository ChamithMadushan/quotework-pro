# Deployment

This is a static Vite app. Any static host works: Netlify, Cloudflare Pages, GitHub Pages, or Vercel.

## Local

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

Upload the `dist/` folder, or connect the Git repository to a host with:

- Build command: `npm run build`
- Publish directory: `dist`

## After go-live

1. Replace `https://example.com/` in `index.html` and `public/sitemap.xml` with the real domain.
2. Confirm HTTPS.
3. Recheck PDF download on mobile Safari and Chrome.
4. If using GitHub Pages with a project path, set Vite `base` accordingly.
