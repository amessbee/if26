// CS310/5102 Course Website JS
(function () {
  const navToggle = document.getElementById("nav-toggle");
  const header = document.querySelector(".header");
  if (navToggle && header) {
    navToggle.addEventListener("click", () =>
      header.querySelector(".nav").classList.toggle("open"),
    );
  }

  // Theme toggle
  const themeBtn = document.getElementById("theme-toggle");
  const applyTheme = (t) => {
    const theme = t === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeBtn)
      themeBtn.textContent = theme === "light" ? "🌙 Dark" : "☀️ Light";
  };
  const storedTheme = localStorage.getItem("theme");
  applyTheme(storedTheme || "light");
  if (themeBtn)
    themeBtn.addEventListener("click", () => {
      const next =
        (localStorage.getItem("theme") || "dark") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

  async function loadJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error("Failed to load " + path);
      return await res.json();
    } catch (e) {
      console.warn("JSON load error:", e);
      return null;
    }
  }

  async function renderAnnouncements() {
    const el = document.getElementById("announcements-list");
    if (!el) return;
    const data = await loadJSON("data/announcements.json");
    if (!data || !data.items || !data.items.length) {
      el.innerHTML = '<p class="small">No announcements yet.</p>';
      return;
    }
    const autoLink = (text) => {
      if (!text) return "";
      const url = /(https?:\/\/[^\s]+)/g;
      return text.replace(url, (m) => `<a target="_blank" href="${m}">${m}</a>`);
    };
    const items = (data.items || [])
      .slice()
      .sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        if (!isNaN(db) && !isNaN(da)) return db - da;
        return String(b.date).localeCompare(String(a.date));
      })
      .map(
        (a) =>
          `<div class="ann-item"><span class="ann-date">${a.date}</span><span class="ann-title">${a.title}</span><span class="ann-body">${autoLink(a.body)}</span></div>`,
      )
      .join("");
    el.innerHTML = `<div class="ann-list">${items}</div>`;
  }

  async function renderStaff() {
    const el = document.getElementById("staff-list");
    if (!el) return;
    const data = await loadJSON("data/staff.json");
    if (!data) return;
    const mk = (role, items) => `
      <div class="card">
        <h3>${role}</h3>
        <ul class="list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </div>`;
    el.innerHTML = `
      <div class="grid-2">
        ${mk("Instructor", [data.instructor.name + (data.instructor.affiliation ? " — " + data.instructor.affiliation : "")])}
        ${mk("Co-Instructor", [data.coInstructor])}
        ${mk("Teaching Assistants (Group A)", data.tas.slice(0, Math.ceil(data.tas.length / 2)))}
        ${mk("Teaching Assistants (Group B)", data.tas.slice(Math.ceil(data.tas.length / 2)))}
      </div>
    `;
  }

  async function renderSchedule() {
    const el = document.getElementById("schedule-table");
    if (!el) return;
    const data = await loadJSON("data/schedule.json");
    if (!data) return;
    el.innerHTML = `
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Weeks 1–7</th><th>Weeks 8–14</th></tr></thead>
          <tbody>
            ${data.rows.map((r) => `<tr><td>${r.left}</td><td>${r.right}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  async function renderLectures() {
    const materialsEl = document.getElementById("lecture-materials");
    const plansEl = document.getElementById("lecture-plans");
    if (!materialsEl && !plansEl) return;
    const data = await loadJSON("data/lectures.json");
    if (!data) return;
    if (materialsEl) {
      const notes = (data.notes || []).map((n) => ({
        date: n.date,
        title: n.title,
        notesLinks: n.link ? [n.link] : [],
      }));
      const slides = (data.slides || []).map((s) => ({
        date: s.date,
        title: s.title,
        slidesLinks: s.link ? [s.link] : [],
      }));
      const worksheets = (data.worksheets || []).map((w) => ({
        date: w.date,
        title: w.title,
        worksheetsLinks: w.link ? [w.link] : [],
      }));
      const recordings = (data.recordings || []).map((r) => ({
        date: r.date,
        title: r.title,
        recordingLinks: r.link ? [r.link] : [],
      }));
      const misc = (data.misc || []).map((m) => ({
        date: m.date,
        title: m.title,
        miscLinks: m.link ? [{ href: m.link, label: m.title || "Misc" }] : [],
      }));
      const byDate = new Map();
      for (const n of notes) {
        byDate.set(n.date, {
          date: n.date,
          title: n.title,
          notesLinks: n.notesLinks,
          slidesLinks: [],
          worksheetsLinks: [],
          recordingLinks: [],
          miscLinks: [],
        });
      }
      for (const s of slides) {
        const existing = byDate.get(s.date);
        if (existing) {
          existing.slidesLinks = existing.slidesLinks.concat(s.slidesLinks);
          if (!existing.title) existing.title = s.title;
        } else {
          byDate.set(s.date, {
            date: s.date,
            title: s.title,
            notesLinks: [],
            slidesLinks: s.slidesLinks,
            worksheetsLinks: [],
            recordingLinks: [],
            miscLinks: [],
          });
        }
      }
      for (const w of worksheets) {
        const existing = byDate.get(w.date);
        if (existing) {
          existing.worksheetsLinks = existing.worksheetsLinks.concat(
            w.worksheetsLinks,
          );
          if (!existing.title) existing.title = w.title;
        } else {
          byDate.set(w.date, {
            date: w.date,
            title: w.title,
            notesLinks: [],
            slidesLinks: [],
            worksheetsLinks: w.worksheetsLinks,
            recordingLinks: [],
            miscLinks: [],
          });
        }
      }
      for (const r of recordings) {
        const existing = byDate.get(r.date);
        if (existing) {
          existing.recordingLinks = existing.recordingLinks.concat(
            r.recordingLinks,
          );
          if (!existing.title) existing.title = r.title;
        } else {
          byDate.set(r.date, {
            date: r.date,
            title: r.title,
            notesLinks: [],
            slidesLinks: [],
            worksheetsLinks: [],
            recordingLinks: r.recordingLinks,
            miscLinks: [],
          });
        }
      }
      for (const m of misc) {
        const existing = byDate.get(m.date);
        if (existing) {
          existing.miscLinks = existing.miscLinks.concat(m.miscLinks);
          if (!existing.title) existing.title = m.title;
        } else {
          byDate.set(m.date, {
            date: m.date,
            title: m.title,
            notesLinks: [],
            slidesLinks: [],
            worksheetsLinks: [],
            recordingLinks: [],
            miscLinks: m.miscLinks,
          });
        }
      }
      const combined = Array.from(byDate.values()).sort((a, b) =>
        a.date > b.date ? -1 : 1,
      );
      materialsEl.innerHTML = combined
        .map((item) => {
          const notesChips = item.notesLinks
            .map(
              (l, idx) =>
                `<a class="chip chip-notes" target="_blank" href="${l}">📄 Notes${item.notesLinks.length > 1 ? " " + (idx + 1) : ""}</a>`,
            )
            .join("");
          const slidesChips = item.slidesLinks
            .map(
              (l, idx) =>
                `<a class="chip chip-slides" target="_blank" href="${l}">📊 Slides${item.slidesLinks.length > 1 ? " " + (idx + 1) : ""}</a>`,
            )
            .join("");
          const wsChips = item.worksheetsLinks
            .map(
              (l, idx) =>
                `<a class="chip chip-ws" target="_blank" href="${l}">📝 Worksheet${item.worksheetsLinks.length > 1 ? " " + (idx + 1) : ""}</a>`,
            )
            .join("");
          const recChips = item.recordingLinks
            .map(
              (l, idx) =>
                `<a class="chip chip-rec" target="_blank" href="${l}">🎥 Recording${item.recordingLinks.length > 1 ? " " + (idx + 1) : ""}</a>`,
            )
            .join("");
          const miscChips = item.miscLinks
            .map((m) => `<a class="chip chip-misc" target="_blank" href="${m.href}">${m.label}</a>`)
            .join("");
          const chips = [notesChips, slidesChips, wsChips, recChips, miscChips].filter(Boolean).join("");
          return `
        <div class="card">
          <div class="kicker">${item.date}</div>
          <h3>${item.title}</h3>
          ${chips ? `<div class="chip-row">${chips}</div>` : ""}
        </div>`;
        })
        .join("");
    }
    if (plansEl && data.plans) {
      plansEl.innerHTML = data.plans
        .map(
          (p) => `
        <div class="card">
          <div class="kicker">${p.week}</div>
          <h3>${p.title}</h3>
          <p class="small">${p.summary || ""}</p>
        </div>
      `,
        )
        .join("");
    }
  }

  renderAnnouncements();
  renderStaff();
  renderSchedule();
  renderLectures();

  // Simple hash-based router for single-page tabs
  const sections = [
    "announcements",
    "lectures",
    "schedule",
    "syllabus",
    "staff",
    "contact",
    "misc",
    "home",
  ];
  function showSection(id) {
    const target = id && sections.includes(id) ? id : "home";
    // Update active nav state only; do not hide sections to allow free scrolling
    const navLinks = document.querySelectorAll(".nav ul li a");
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const hash = href.startsWith("#") ? href.slice(1) : "";
      if (hash === target) a.classList.add("active");
      else a.classList.remove("active");
    });
    const targetEl = document.getElementById(target);
    if (targetEl) {
      const header = document.querySelector(".header");
      const headerHeight = header ? header.offsetHeight : 80;
      const y =
        targetEl.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  // Intercept nav link clicks for consistent smooth scrolling
  document.querySelectorAll(".nav ul li a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = href.slice(1);
        // Update URL without triggering default jump
        if (history.pushState) history.pushState(null, "", "#" + id);
        else location.hash = id;
        showSection(id);
      });
    }
  });
  window.addEventListener("hashchange", () =>
    showSection(location.hash.slice(1)),
  );
  showSection(location.hash.slice(1));
})();
