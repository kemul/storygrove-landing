# StoryGrove Landing Page

Landing page for **StoryGrove** — a story & play studio creating connected physical and digital experiences for children.

Static site, no build step required.

## Structure

- `index.html` — page markup and copy
- `styles.css` — styling (fonts via Google Fonts CDN)
- `script.js` — mobile nav toggle + scroll-reveal animations

## Running locally

Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying

The site is plain HTML/CSS/JS, so it can be hosted on GitHub Pages, Netlify, Vercel, or any static host with no build configuration.

**GitHub Pages (this repo):**

1. Go to Settings → Pages.
2. Under "Build and deployment", set Source to "Deploy from a branch".
3. Branch: `main`, folder: `/ (root)`. Save.
4. Site goes live at `https://kemul.github.io/storygrove-landing/` within a minute or two.

A `.nojekyll` file is included so GitHub Pages serves the files as-is without running them through Jekyll.
