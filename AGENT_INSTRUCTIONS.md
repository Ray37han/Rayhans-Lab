# 🤖 Agent Instructions — Rayhan's Lab

> **Purpose**: This file is the single source of truth for any coding agent working on this repository.
> Read this file in full before touching any code. Then scan the target HTML file. Then act.

---

## 📌 Project Overview

**Rayhan's Lab** is a personal educational website live at **[rhrayhan.dev](https://rhrayhan.dev/)**.
It is hosted via **GitHub Pages** on the repository `Ray37han/Rayhans-Lab`.
The custom domain is configured through the `CNAME` file at the root (value: `rhrayhan.dev`).

There is **no build step, no bundler, no framework**. Every file is plain HTML, CSS, and vanilla JavaScript.
Deployment is automatic — every `git push` to the `main` branch goes live within ~1–2 minutes.

---

## 🗂️ Repository Structure

```
Rayhan's Lab/                        ← Repo root (also GitHub Pages root)
├── index.html                       ← Main landing page (home)
├── style.css                        ← Global design system
├── script.js                        ← Landing page animations
├── CNAME                            ← Custom domain (rhrayhan.dev)
├── README.md                        ← Public project documentation
├── AGENT_INSTRUCTIONS.md            ← THIS FILE — read first
└── Topics/
    ├── index.html                   ← Subject-picker page (Math / Physics / CS)
    ├── Math/
    │   └── index.html               ← Math topic list
    ├── Physics/
    │   ├── index.html               ← Physics topic list
    │   ├── style.css                ← Physics-specific styles (shared by physics pages)
    │   └── script.js                ← Physics-specific scripts (shared by physics pages)
    └── Computer Science/
        └── index.html               ← CS topic list
```

### URL Mapping

| File path (repo root) | Live URL |
|---|---|
| `index.html` | `https://rhrayhan.dev/` |
| `Topics/index.html` | `https://rhrayhan.dev/Topics/` |
| `Topics/Math/index.html` | `https://rhrayhan.dev/Topics/Math/` |
| `Topics/Physics/index.html` | `https://rhrayhan.dev/Topics/Physics/` |
| `Topics/Computer Science/index.html` | `https://rhrayhan.dev/Topics/Computer%20Science/` |
| `Topics/Physics/vector.html` | `https://rhrayhan.dev/Topics/Physics/vector.html` |
| `Topics/Computer Science/dijkstra_interactive.html` | `https://rhrayhan.dev/Topics/Computer%20Science/dijkstra_interactive.html` |

> **Note:** GitHub Pages URL-encodes spaces. A directory called `Computer Science` becomes `Computer%20Science` in the URL. Always use relative paths in HTML (`href="dijkstra_interactive.html"`) — never hardcode absolute URLs.

---

## 🎯 Your Primary Task

When given a command like:

> *"I've added `[filename].html` to `Topics/[Subject]/`. Make it live on rhrayhan.dev."*

You must do **all** of the following steps — in order.

---

## ✅ Step-by-Step Integration Workflow

### Step 1 — Scan the New HTML File

Open and read the new HTML file completely. Extract:

- **`<title>`** — use this as the display name for nav links.
- **`<meta name="description">`** — use as a subtitle/description in the index card if one exists.
- **Topic / subject area** — inferred from its directory:
  - `Topics/Math/` → Math
  - `Topics/Physics/` → Physics
  - `Topics/Computer Science/` → Computer Science
- **Any relative asset references** (`<link href="...">`, `<script src="...">`, `<img src="...">`) — verify they resolve correctly relative to the file's location.
- **Back-link depth** — count the depth from root to determine the correct relative path for nav links:
  - Files in `Topics/[Subject]/` → back to subject index: `../` → back to Topics: `../../Topics/` → back to home: `../../index.html`

---

### Step 2 — Validate the HTML File's Internal Navigation

Every standalone page in this project must have:

1. **A back-link** pointing to the subject's `index.html`:
   ```html
   <a class="back-link" href="../index.html">← Back to [Subject]</a>
   ```
2. **A site footer** (see the Footer Template section below).
3. **Correct relative paths** for any shared CSS/JS it imports.

If these are missing, **add them** before registering the page in any index.

---

### Step 3 — Register the Page in the Correct Subject Index

Open the `index.html` of the matching subject directory:
- Math → `Topics/Math/index.html`
- Physics → `Topics/Physics/index.html`
- Computer Science → `Topics/Computer Science/index.html`

Find the `<div class="list">` (or `<section class="grid">`) block.
Add a new card entry for the new page:

```html
<a class="card" href="[filename].html" data-card>[Display Title from title tag]</a>
```

> **Important:** Also update the topic count in the `<p class="meta" id="...-count">` element to reflect the new total.
> Example: if there were 10 topics, it becomes `11 topics available`.

---

### Step 4 — Update `README.md`

Open `README.md`. Under the correct subject heading in the **🚀 Key Modules & Interactive Tools** section, add a bullet for the new page:

```markdown
- **[Display Title]**: [One-sentence description of what the page does.]
```

Also update the **📂 Project Structure** section to include the new filename.

---

### Step 5 — Commit and Push

Run the following git commands from the repo root:

```bash
git add Topics/[Subject]/[filename].html
git add Topics/[Subject]/index.html
git add README.md
git commit -m "feat([subject]): add [display title] page"
git push origin main
```

> **Do not use `git add .`** unless you have verified every changed file. Only stage the files you intentionally modified.

---

### Step 6 — Verify It's Live

After pushing, wait ~60–90 seconds, then confirm the page is accessible at:

```
https://rhrayhan.dev/Topics/[Subject]/[filename].html
```

If the page is not live after 3 minutes, check:
- The `CNAME` file still contains only `rhrayhan.dev` (no extra whitespace or newlines).
- GitHub Actions → Pages deployment status in the repository settings.
- That the file was actually committed to the `main` branch.

---

## 🎨 Design Conventions

All pages in this project share a consistent visual language. When adding or editing HTML files, follow these rules precisely.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Background deep | `#020617` | Page background start |
| Background mid | `#0f172a` | Page background mid |
| Background surface | `#111827` | Page background end |
| Text primary | `#e2e8f0` | Body text |
| Text muted | `#94a3b8` | Subtitles, descriptions |
| Accent blue | `#93c5fd` / `#60a5fa` | Links, focus rings |
| Border | `rgba(148,163,184,.16)` | Card/input borders |
| Card background | `rgba(15,23,42,.68)` | Card fill |
| Primary gradient | `#4f46e5` → `#06b6d4` | Brand mark, accents |

### Typography

- **Font**: `Inter, system-ui, sans-serif` — loaded from system fonts, no CDN needed unless a page explicitly loads it.
- **Heading size**: `clamp(2rem, 8vw, 3rem)` for `<h1>`, `letter-spacing: -0.04em`.
- **Body line-height**: `1.7`.
- **Dark mode**: Always include `:root { color-scheme: dark; }`.

### Layout

- **Max content width**: `min(900px, calc(100% - 1rem))` for topic pages; `min(1120px, ...)` for grid pages.
- **Spacing unit**: multiples of `4px` (e.g. `16px`, `20px`, `28px`).
- **Border radius**: `16px`–`20px` for cards; `14px` for icon buttons.
- **Cards**: Use `border: 1px solid rgba(148,163,184,.16)` + hover `border-color: rgba(96,165,250,.44)` and `transform: translateY(-2px)`.

### Touch & Accessibility

- All interactive elements must have `min-height: 44px` (mobile tap target minimum).
- Search inputs use `<input type="search" autocomplete="off">`.
- Footer social links must have `aria-label` attributes.

---

## 🦶 Footer Template

Every page must include this footer. Adjust the relative path depth (`../../index.html` for pages in `Topics/[Subject]/`):

```html
<style id="home-footer-styles">
.site-footer {
  padding: 2rem 0 2.5rem;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(2, 6, 23, 0.28);
}
.footer-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 1rem;
  align-items: start;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.brand-mark {
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  box-shadow: 0 10px 28px rgba(79, 70, 229, 0.32);
}
.footer-brand { margin-bottom: 0.75rem; }
.footer-layout p, .footer-bottom { color: #94a3b8; }
.footer-links, .social-links { display: flex; flex-wrap: wrap; gap: 0.85rem; }
.social-links a {
  width: 44px; height: 44px;
  display: inline-grid; place-items: center;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.38);
  font-weight: 800;
}
.footer-bottom {
  margin-top: 1.4rem;
  display: flex; flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem; font-size: 0.95rem;
}
@media (max-width: 900px) {
  .footer-layout { grid-template-columns: 1fr; }
}
</style>

<footer class="site-footer">
  <div class="container footer-layout">
    <div>
      <a class="brand footer-brand" href="../../index.html#home">
        <span class="brand-mark">RL</span>
        <span>Rayhan's Lab</span>
      </a>
      <p>Math, Physics, and CSE learning notes built for clarity.</p>
    </div>
    <div class="footer-links">
      <a href="../../index.html#home">Home</a>
      <a href="../../index.html#topics">Topics</a>
      <a href="../../index.html#about">About</a>
      <a href="../../index.html#contact">Contact</a>
    </div>
    <div class="social-links" aria-label="Social links">
      <a href="https://github.com/Ray37han" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
      <a href="https://www.facebook.com/ray32han" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
      <a href="https://www.linkedin.com/in/rakibul-hasan-rayhan/" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© 2026 Rayhan's Lab.</span>
    <span>Built with HTML, CSS, and vanilla JavaScript.</span>
  </div>
</footer>
```

> **Path depth reminder:**
> - Pages in `Topics/[Subject]/` use `../../index.html` for home links.
> - Pages in `Topics/` use `../index.html` for home links.
> - The root `index.html` uses `#home`, `#topics`, etc.

---

## 📐 Subject Index Card Pattern

When registering a new page in a subject's `index.html`, the card element pattern is:

```html
<!-- Simple list card (used in CS and Math indexes) -->
<a class="card" href="[filename].html" data-card>[Page Title]</a>

<!-- Rich grid card (used in the Topics/index.html subject picker) -->
<a class="card" href="[Subject]/" data-card>
  <h2>[Subject Name]</h2>
  <p>[One-sentence description]</p>
</a>
```

The `data-card` attribute is required — it is used by the live search filter script.

---

## 🔍 Search Filter Script

Each subject index page has a search filter. After adding a card, verify the script targets the correct element IDs:

```html
<script>
  const search = document.getElementById('[subject]-search');  // e.g. cs-search, physics-search
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const count = document.getElementById('[subject]-count');    // e.g. cs-count, physics-count

  const updateCount = () => {
    const visible = cards.filter((card) => !card.hidden).length;
    count.textContent = visible === 1 ? '1 topic available' : `${visible} topics available`;
  };

  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    cards.forEach((card) => {
      card.hidden = Boolean(query) && !card.textContent.toLowerCase().includes(query);
    });
    updateCount();
  });

  updateCount();
</script>
```

---

## ⚠️ Rules & Constraints

1. **Never modify `CNAME`** — it must always contain only `rhrayhan.dev`.
2. **Never add a build tool** (webpack, vite, npm, etc.) — this is a static site with zero dependencies.
3. **Never use absolute URLs** for internal links — always use relative paths.
4. **Never use external CDNs** for CSS/JS unless the page already uses one (e.g. Three.js via CDN is acceptable in physics pages that already import it).
5. **Preserve all existing comments and code** in files you edit — only add what is needed.
6. **Match the existing dark-mode design exactly** — do not introduce new color schemes.
7. **All new pages must be mobile-responsive** — test at 320px, 768px, and 1280px viewport widths conceptually.
8. **Do not create `node_modules/`, `package.json`, or any npm artifacts.**

---

## 🧪 Quick Pre-Push Checklist

Before committing, verify every item:

- [ ] New HTML file is in the correct subject directory (`Topics/Math/`, `Topics/Physics/`, or `Topics/Computer Science/`)
- [ ] Page has a `<title>` tag and `<meta name="description">` tag
- [ ] Page includes `:root { color-scheme: dark; }`
- [ ] Page has a back-link to the subject's `index.html`
- [ ] Page has the standard site footer with correct relative paths
- [ ] Subject `index.html` has a new `<a class="card" data-card>` entry for this page
- [ ] Topic count in the subject index has been incremented
- [ ] `README.md` has been updated with the new page
- [ ] All relative asset paths in the new file resolve correctly
- [ ] Only the intended files are staged for commit

---

## 👤 Project Author

**Md. Rakibul Hasan Rayhan**
- Website: [rhrayhan.dev](https://rhrayhan.dev/)
- GitHub: [@Ray37han](https://github.com/Ray37han)
- LinkedIn: [Md. Rakibul Hasan Rayhan](https://www.linkedin.com/in/rakibul-hasan-rayhan/)

---

*Last updated: August 2026*
