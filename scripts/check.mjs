// Validates site data: every data/*.json parses, and every local link
// referenced from it (or from the HTML pages) points to a file that exists.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
let errors = 0;
const fail = (msg) => {
  errors++;
  console.error("✗ " + msg);
};

const isLocal = (href) =>
  href &&
  !href.includes("${") && // JS template placeholders, not real paths
  !/^(https?:|mailto:|tel:|#|javascript:|data:)/i.test(href) &&
  !href.startsWith("//");
const checkPath = (href, from) => {
  const clean = decodeURIComponent(href.split(/[?#]/)[0]);
  if (clean && !existsSync(join(root, clean)))
    fail(`${from}: missing file "${clean}"`);
};

// 1. JSON files parse; collect `link` fields and hrefs inside strings.
const walk = (v, file) => {
  if (Array.isArray(v)) return v.forEach((x) => walk(x, file));
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      if (k === "link" && typeof x === "string" && isLocal(x)) checkPath(x, file);
      else walk(x, file);
    }
  } else if (typeof v === "string") {
    for (const m of v.matchAll(/href="([^"]+)"/g))
      if (isLocal(m[1])) checkPath(m[1], file);
  }
};
for (const f of readdirSync(join(root, "data")).filter((f) => f.endsWith(".json"))) {
  const rel = `data/${f}`;
  try {
    walk(JSON.parse(readFileSync(join(root, rel), "utf8")), rel);
  } catch (e) {
    fail(`${rel}: invalid JSON — ${e.message}`);
  }
}

// 2. Local href/src references in top-level HTML pages.
for (const f of readdirSync(root).filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(join(root, f), "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g))
    if (isLocal(m[1])) checkPath(m[1], f);
}

if (errors) {
  console.error(`\n${errors} problem(s) found.`);
  process.exit(1);
}
console.log("✓ All data files parse and all local links resolve.");
