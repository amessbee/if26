// browser-sync config for `npm run dev` — serves the repo root as a static site
// and reloads the browser when site files change.
module.exports = {
  server: { baseDir: "./" },
  port: 5500,
  files: [
    "*.html",
    "assets/**/*.{css,js}",
    "data/**/*.json",
    "resources/**/*.pdf",
  ],
  ignore: ["node_modules/**"],
  open: "local",
  notify: false,
  ui: false,
  ghostMode: false,
};
