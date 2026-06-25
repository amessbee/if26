---
title: Discrete Structures — Fall 2026
layout: default
redirect_to: https://amessbee.github.io/if26/
---

# Discrete Structures — Fall 2026

Course website for **Discrete Structures** at LUMS SSE, Fall 2026.

The site is live at **[amessbee.github.io/if26](https://amessbee.github.io/if26)** and includes:

- Syllabus and course policies
- Weekly schedule
- Lecture notes, slides, and worksheets (PDF)
- Homework assignments
- Announcements
- Staff and office hours

## Updating the site

All content is driven by JSON files in `data/` — no HTML editing required for routine updates:

| File | Controls |
|------|----------|
| `data/announcements.json` | Pinned announcements |
| `data/staff.json` | Instructor/TA list |
| `data/schedule.json` | Week-by-week schedule |
| `data/lectures.json` | Lecture notes, slides, and worksheet links |

Place resource PDFs in `resources/notes/`, `resources/slides/`, `resources/ws/`, or `resources/hw/`, then reference them from the JSON files.

Commit and push to `main`; GitHub Pages redeploys automatically.

---

[View on GitHub](https://github.com/amessbee/if26) &nbsp;|&nbsp; [Live site](https://amessbee.github.io/if26)
