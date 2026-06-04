# Discrete Structures — Fall 2026 Course Website

A lightweight static website to share lecture notes, plans, announcements, syllabus, office hours, staff info, and resources. The site is published via GitHub Pages here: [https://amessbee.github.io/if26](https://amessbee.github.io/if26)

## Structure (Single Page)

- `index.html` — Single-page site with sections: Home, Syllabus, Schedule, Lectures, Announcements, Staff, Contact (navigate via hash tabs)
- `assets/css/style.css` — Shared styling (dark/light themes, layout)
- `assets/js/main.js` — Hash router, smooth scrolling, data rendering
- `data/` — JSON data for announcements, staff, schedule, lectures
- `resources/notes/` — Place PDFs for lecture notes
- `resources/slides/` — Place PDFs for slides
- `resources/ws/` — Place PDFs for worksheets
- `resources/hw/` — Place PDFs for homework

## Run locally (macOS)

From the workspace root:

```bash
python3 -m http.server 5500
```

Then open: http://localhost:5500

## Updating content

- Announcements: edit `data/announcements.json`
- Staff list: edit `data/staff.json`
- Schedule: edit `data/schedule.json`
- Lecture plans/notes: edit `data/lectures.json`
  - Notes entries: set `link` to path like `resources/notes/l1.pdf`
  - Slides entries: set `link` to path like `resources/slides/l1.pdf`
  - Worksheets entries: set `link` to path like `resources/ws/ws1.pdf`

### Add homework

1. Place files under `resources/hw/` (e.g., `hw1.tex`, `hw1.pdf`).

2. Add an announcement in `data/announcements.json`:

   ```json
   {
     "date": "2026-09-01",
     "title": "Homework 1 Released",
     "body": "Download: https://amessbee.github.io/if26/resources/hw/hw1.pdf"
   }
   ```

3. Publish: commit and push to `main`, then refresh the site (GitHub Pages will redeploy automatically).

## Publish on GitHub Pages (main branch)

- Push changes to the `main` branch of your GitHub repository.
- In GitHub: Settings → Pages → Build and deployment
  - Source: "Deploy from a branch"
  - Branch: `main`
  - Folder: `/` (root)
- Wait ~1–2 minutes for deployment. Your site will be available at:
  - `https://amessbee.github.io/if26`
- `.nojekyll` is included to prevent Jekyll processing.

## TODO before semester starts

- Update `data/staff.json` with actual TA names
- Update Slack link in `index.html` (hero section)
- Update PollEv link in `index.html`
- Add course code to page title and nav brand in `index.html`
