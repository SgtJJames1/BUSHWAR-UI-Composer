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
  const addonEntry = addon.entries.find(candidate => candidate.id === entry.id);
  assert(addonEntry, `${entry.id} must exist in the addon manifest`);
  assert(entry.path.endsWith(".layout"), `${entry.id} must point at a registered layout resource`);
  assert(/^[0-9A-F]{16}$/.test(entry.resourceGuid || ""), `${entry.id} must carry the Workbench-generated resource GUID`);
  assert(entry.resourceReference === `{${entry.resourceGuid}}${entry.path}`, `${entry.id} must carry a GUID-qualified resource reference`);
  assert(entry.coreLibraryId === website.projectId, `${entry.id} must identify the companion Core addon`);
  assert(Object.keys(entry.requiredChildren || {}).length > 0, `${entry.id} must preserve named-child contracts`);
  assert(Array.isArray(entry.runtimeContracts) && entry.runtimeContracts.length > 0, `${entry.id} must declare runtime contracts`);
  assert(Array.isArray(entry.functionHints) && entry.functionHints.length > 0, `${entry.id} must declare supported callback hints`);
  assert.strictEqual(JSON.stringify(entry.functionHints), JSON.stringify(addonEntry.functionHints), `${entry.id} callback hints must match between website and addon manifests`);
  assert(fs.existsSync(path.resolve(root, "..", "..", "Reforger-Workbench-Mods", "BUSHWAR-UIComposer-Core", entry.path)), `${entry.path} must exist in the Core addon`);
}

const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(app.includes("BUSHWAR_REFORGER_CORE_LIBRARY"), "app must load the Core library manifest");
assert(app.includes("coreLibraryId: layer.coreLibraryId"), "Workbench widgets must preserve the Core addon identity");
assert(app.includes("declaredRuntimeContracts: layer.runtimeContracts"), "Workbench contracts must preserve Core runtime declarations");
assert(app.includes("availableCallbacks: layer.functionHints"), "Workbench plans must preserve catalog callback hints");
assert(app.includes("const callbackHints = (item.functionHints || []).join"), "catalog cards must expose callback hints");
assert(index.includes("reforger-core-library.js"), "index must load the Core library manifest");
assert(index.includes('value="BUSHWAR Core"'), "catalog must expose a separate BUSHWAR Core filter");
assert(website.entries.find(entry => entry.id === "core.admin-panel")?.defaultBinding === "player.list.connected", "Core admin panel must default to the authoritative connected-player binding");
assert(website.entries.find(entry => entry.id === "core.admin-panel")?.defaultFunctionTarget === "m_wRefresh", "Core admin panel refresh contract must target the named refresh button");
assert(website.entries.find(entry => entry.id === "core.player-row")?.runtimeValueWidgetName === "NameText", "Core row must declare the actual TextWidget child used for player names");
const adminChildren = website.entries.find(entry => entry.id === "core.admin-panel")?.requiredChildren || {};
assert.strictEqual(adminChildren.count, "m_wPlayerCount", "Core admin panel must expose the canonical connected-count child key");
assert.strictEqual(adminChildren.selection, "m_wPlayerSelection", "Core admin panel must expose the canonical selection child key");
assert.strictEqual(adminChildren.list, "m_wPlayerList", "Core admin panel must expose the canonical connected-list child key");
assert.strictEqual(adminChildren.rowName, "NameText", "Core admin panel must expose the canonical row text child key");
assert(app.includes("normalizeRequiredChildren"), "app must normalize legacy Core named-child aliases before generating controller contracts");
assert(app.indexOf("const declaredChildren = normalizeRequiredChildren(layer.requiredChildren)") < app.indexOf("const runtimeChildNames = declaredChildren"), "Core child normalization must happen before controller child-name selection");
assert(app.includes("${names.list}"), "generated connected-player controllers must use the canonical connected-list child name");

console.log("core-library.test.js: PASS");
