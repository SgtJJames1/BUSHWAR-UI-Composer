const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = source.indexOf("function normalizeLayoutGuid");
const end = source.indexOf("function controllerSourceFor", start);
assert(start >= 0 && end > start, "layout metadata helpers must remain present in app.js");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}; this.normalizeLayoutGuid = normalizeLayoutGuid; this.parseWorkbenchLayoutMeta = parseWorkbenchLayoutMeta; this.normalizeLayoutPath = normalizeLayoutPath;`, sandbox);

const parsed = sandbox.parseWorkbenchLayoutMeta('Name "{f487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout"');
assert.strictEqual(parsed.guid, "F487371808027463", "registered layout metadata must produce the GUID");
assert.strictEqual(parsed.path, "UI/layouts/BWUIC_CorePlayerRow.layout", "registered layout metadata must produce the resource path");
assert.throws(() => sandbox.parseWorkbenchLayoutMeta('Name "{0000000000000000}UI/layouts/invalid.layout"'), /No GUID-qualified/, "null GUID metadata must not be accepted");
assert.strictEqual(sandbox.normalizeLayoutGuid("{f487371808027463}"), "F487371808027463", "GUID normalization must accept braces and lower-case metadata");
assert.strictEqual(sandbox.normalizeLayoutPath("UI/layouts/Sub/BWUIC_CorePlayerRow.layout", "Fallback"), "UI/layouts/Sub/BWUIC_CorePlayerRow.layout", "nested registered layout paths must be preserved");
assert.strictEqual(sandbox.normalizeLayoutPath("", "Fallback"), "UI/layouts/Fallback.layout", "missing layout paths must use the layout-name fallback");

console.log("layout-guid.test.js: PASS");
