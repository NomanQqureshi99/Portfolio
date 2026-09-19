# Nauman Qureshi — Portfolio

A premium, responsive personal portfolio for **Nauman Qureshi**, Web Designer &amp; Developer.
Built with plain **HTML, CSS and JavaScript** — no framework, no build step, no backend, no API keys.

Deep-blue / black theme, glassmorphism cards, animated glow orbs, scroll reveals, animated
counters and a working (mailto-based) contact form. Fully responsive and accessible, with
`prefers-reduced-motion` support.

---

## Project structure

```
web-portfolio/
├── index.html          # All page markup
├── css/
│   └── style.css       # All styles + responsive + animations
├── js/
│   └── main.js         # Nav, scroll reveal, counters, scroll-spy, form
├── assets/
│   └── favicon.svg     # NQ monogram favicon
├── package.json        # Optional dev-server scripts
├── vercel.json         # Vercel config (clean URLs, caching, headers)
├── .gitignore
└── README.md
```

---

## Run it locally

It's a static site, so you can just **double-click `index.html`**.

For a proper local server (recommended so paths behave like production), use any one of:

```bash
# Option 1 — Node (no install needed)
npx serve .

# Option 2 — Python 3
python -m http.server 5173

# Option 3 — VS Code
# Install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

Then open the URL shown in the terminal (e.g. `http://localhost:3000` or `http://localhost:5173`).

---

## Deploy to GitHub + Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/web-portfolio.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to <https://vercel.com> and sign in with GitHub.
2. Click **Add New → Project** and import your `web-portfolio` repo.
3. Framework preset: **Other** (it's a static site — no build command needed).
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty / root)*
4. Click **Deploy**. Done — you'll get a live `*.vercel.app` URL.

Every push to `main` will auto-deploy. You can also deploy from the CLI:

```bash
npm i -g vercel
vercel
```

> Works equally well on **Netlify** or **GitHub Pages** — it's just static files.

---

## How to make it yours (editable placeholders)

Everything is plain HTML/CSS — open `index.html` and edit the text. Key spots:

| What to change | Where |
| --- | --- |
| Social links (Facebook / LinkedIn / GitHub) | `href="#"` attributes in the hero &amp; footer `.social-link`s |
| Phone number | search `+92 321 9304030` |
| Email | search `nomi00001@gmail.com` |
| **Projects** (names, tech, links) | the `#portfolio` section — each `<article class="project-card">`. They're **labelled "Sample project"** — swap in your real work and update the `project-link` `href`. |
| Stats (years / projects) | `data-target` on the `.counter` spans in `#about` |
| Services | the six `<article class="service-card">` blocks in `#services` |
| Skills | the `.skill-card` blocks in `#skills` |

### Colors

All theming lives in CSS variables at the top of `css/style.css` (`:root`). Change
`--blue`, `--bg`, etc. to re-skin the whole site.

---

## Notes

- The contact form has **no backend** — on submit it opens the visitor's email app
  (`mailto:`) prefilled with their message. To collect submissions server-side instead,
  point the form at a service like [Formspree](https://formspree.io) or
  [Web3Forms](https://web3forms.com).
- Icons are loaded from Font Awesome CDN; fonts from Google Fonts. No API keys required.
- Project previews are pure CSS mockups (no external images), so nothing can break on load.

---

© Nauman Qureshi. MIT licensed — free to reuse and adapt.
