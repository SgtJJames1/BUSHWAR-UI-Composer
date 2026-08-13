const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

// --- Removed redundant controls must stay gone -----------------------------
assert(!html.includes('id="sceneSelect"'), "duplicate topbar scene picker must remain removed");
assert(!html.includes('id="copySpecBtn"'), "redundant design-spec copy button must remain removed");
assert(!js.includes("async function copySpec"), "dead copySpec function must remain removed");
assert(!js.includes('$("#sceneSelect")'), "duplicate scene listener must remain removed");
assert(!css.includes(".scene-picker"), "dead scene-picker styles must remain removed");

// --- Every visible button must be wired or a delegated/dialog action --------
const dialogStarts = [...html.matchAll(/<dialog\b/g)].map(m => m.index);
const dialogEnds = [...html.matchAll(/<\/dialog>/g)].map(m => m.index + 9);
const inDialog = index => dialogStarts.some((start, i) => index >= start && index <= dialogEnds[i]);
const orphans = [];
for (const match of html.matchAll(/<button\b([^>]*)>/g)) {
  const tag = match[1];
  const hasDataAction = /\bdata-(add|template|scene|size)=/.test(tag);
  const id = tag.match(/\bid="([^"]+)"/)?.[1];
  if (hasDataAction) continue;
  if (id && (js.includes(`$("#${id}")`) || js.includes(`getElementById("${id}")`))) continue;
  if (inDialog(match.index)) continue; // dialog form buttons resolve by value/close
  orphans.push(id ? `#${id}` : tag.trim());
}
assert.strictEqual(orphans.length, 0, `orphaned buttons: ${orphans.join(", ")}`);

// --- Accessibility ----------------------------------------------------------
assert(html.includes('aria-live="polite"'), "status text must announce to screen readers");
assert(html.includes('id="layerUpBtn" title="Move layer forward" aria-label="Move layer forward"'), "icon layer buttons must carry aria-labels");
assert(js.includes('setAttribute("aria-pressed"'), "toggle buttons must expose pressed state");

// --- Modernised design ------------------------------------------------------
assert(css.includes(":focus-visible"), "controls must expose visible focus rings");
assert(css.includes("prefers-reduced-motion"), "reduced-motion preference must be respected");
assert(css.includes(".handoff-export-row"), "handoff actions must be grouped into compact rows");
assert(css.includes("button.accent:hover"), "primary actions must have a hover state");

// --- Right sidebar sizing, collapsibility, and mod prep ---------------------
assert(css.includes("grid-template-columns: 250px minmax(320px, 1fr) 320px"), "right sidebar must be widened to 320px");
assert(html.includes('<details class="sidebar-section" open>'), "right sidebar sections must be collapsible");
assert(html.includes('id="modPrepNote"'), "handoff must expose the live mod-prep note");
assert(js.includes("workflow-details"), "workflow tracker must collapse into a summary");
assert(js.includes("Mod prep"), "mod-prep note must be rendered with controller path and dependency");
assert(html.includes("BUSHWAR-UIComposer-Core") && html.includes("B3A5F08C0D504D96"), "workflow guide must document the Core mod dependency");

console.log("ui-audit.test.js: PASS");
