// Extracts problem data from the standalone DSAT_Practice_Set/*.jsx files into
// src/data/problemSets.json (the single source the app reads).
//
// Run:  npm run extract
// Add a new set:  drop a new dsat-*.jsx in DSAT_Practice_Set/, then re-run.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "DSAT_Practice_Set");
const outFile = join(root, "src", "data", "problemSets.json");

// Capture a balanced [ ... ] or { ... } literal starting after `const NAME =`,
// while ignoring brackets that appear inside strings / template literals.
function extractLiteral(text, name) {
  const m = new RegExp(`const\\s+${name}\\s*=\\s*`).exec(text);
  if (!m) return null;
  let i = m.index + m[0].length;
  const open = text[i];
  const close = open === "[" ? "]" : "}";
  let depth = 0, str = null, esc = false;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (str) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === str) str = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { str = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) { return text.slice(m.index + m[0].length, i + 1); } }
  }
  return null;
}

const evalLiteral = (lit) => (lit ? vm.runInNewContext("(" + lit + ")") : undefined);

function meta(text, file) {
  const id = file.replace(/^dsat-/, "").replace(/\.jsx$/, ""); // june2026-set4
  // The badge div: <div style={{...background:"#XXXXXX"...}}>June 2026 · SET N</div>
  const labelM = />\s*(June 2026[^<]*?SET\s*\d+)\s*<\/div>/i.exec(text);
  const label = labelM?.[1]?.trim() || id;
  const title = (/<h1[^>]*>([^<]*)<\/h1>/.exec(text) || [])[1]?.trim() || label;
  let subtitle = (/<p[^>]*>([^<]*)<\/p>/.exec(text) || [])[1]?.trim() || "";
  subtitle = subtitle.replace(/\s*·?\s*All verified.*$/i, "").trim();
  // accent = the background color immediately preceding the badge label
  const before = text.slice(0, labelM ? labelM.index : text.indexOf("June 2026"));
  const colors = [...before.matchAll(/background:\s*"(#[0-9A-Fa-f]{6})"/g)];
  const accent = colors.length ? colors[colors.length - 1][1] : "#264653";
  return { id, label, title, subtitle, accent };
}

const files = readdirSync(srcDir).filter((f) => f.endsWith(".jsx")).sort();
const sets = [];

for (const file of files) {
  const text = readFileSync(join(srcDir, file), "utf8");
  const problems = evalLiteral(extractLiteral(text, "problems"));
  const catColors = evalLiteral(extractLiteral(text, "catColors")) || {};
  if (!Array.isArray(problems)) { console.warn(`⚠︎ skipped ${file}: no problems[]`); continue; }
  sets.push({ ...meta(text, file), catColors, problems });
  console.log(`✓ ${file} → ${problems.length} problems`);
}

sets.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

// Give each set a distinct accent for the dashboard (originals all use red badges).
const palette = ["#E63946", "#457B9D", "#2A9D8F", "#E08A1E", "#6A4C93", "#1982C4", "#D6336C", "#2B8A3E"];
sets.forEach((s, i) => { s.accent = palette[i % palette.length]; });

writeFileSync(outFile, JSON.stringify(sets, null, 2) + "\n");
console.log(`\nWrote ${sets.length} sets → ${outFile}`);
