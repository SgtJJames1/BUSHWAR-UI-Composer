const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const coreManifestPath = path.resolve(root, "..", "..", "Reforger-Workbench-Mods", "BUSHWAR-UIComposer-Core", "UI", "BWUIC_CoreLibrary.json");
const coreManifestSource = fs.readFileSync(path.join(root, "reforger-core-library.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(coreManifestSource, sandbox, { filename: "reforger-core-library.js" });
const website = sandbox.window.BUSHWAR_REFORGER_CORE_LIBRARY;
const addon = JSON.parse(fs.readFileSync(coreManifestPath, "utf8"));

assert.strictEqual(website.projectId, addon.projectId, "website and addon Core project IDs must match");
assert.strictEqual(website.projectGuid, addon.projectGuid, "website and addon Core project GUIDs must match");
assert.strictEqual(website.version, addon.version, "website and addon Core versions must match");
assert.strictEqual(website.entries.length, addon.entries.length, "website and addon Core entry counts must match");
assert(website.entries.length >= 2, "Core library must expose the admin panel and player row resources");
for (const entry of website.entries) {
  assert(entry.path.endsWith(".layout"), `${entry.id} must point at a registered layout resource`);
  assert(entry.coreLibraryId === website.projectId, `${entry.id} must identify the companion Core addon`);
  assert(Object.keys(entry.requiredChildren || {}).length > 0, `${entry.id} must preserve named-child contracts`);
  assert(Array.isArray(entry.runtimeContracts) && entry.runtimeContracts.length > 0, `${entry.id} must declare runtime contracts`);
  assert(fs.existsSync(path.resolve(root, "..", "..", "Reforger-Workbench-Mods", "BUSHWAR-UIComposer-Core", entry.path)), `${entry.path} must exist in the Core addon`);
}

const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(app.includes("BUSHWAR_REFORGER_CORE_LIBRARY"), "app must load the Core library manifest");
assert(app.includes("coreLibraryId: layer.coreLibraryId"), "Workbench widgets must preserve the Core addon identity");
assert(app.includes("declaredRuntimeContracts: layer.runtimeContracts"), "Workbench contracts must preserve Core runtime declarations");
assert(index.includes("reforger-core-library.js"), "index must load the Core library manifest");
assert(index.includes('value="BUSHWAR Core"'), "catalog must expose a separate BUSHWAR Core filter");

console.log("core-library.test.js: PASS");
