const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const coreSource = fs.readFileSync(path.join(root, "reforger-core-library.js"), "utf8");
const coreSandbox = { window: {} };
vm.runInNewContext(coreSource, coreSandbox, { filename: "reforger-core-library.js" });
const core = coreSandbox.window.BUSHWAR_REFORGER_CORE_LIBRARY;
const admin = core.entries.find(entry => entry.id === "core.admin-panel");
assert(admin, "Core admin panel fixture must exist");

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const start = appSource.indexOf("function reforgerBoundsFor");
const end = appSource.indexOf("function controllerSourceFor", start);
assert(start >= 0 && end > start, "Composer scaffold functions must remain present");

const sandbox = {
  window: { BUSHWAR_REFORGER_CORE_LIBRARY: core },
  state: { canvas: { width: 1920, height: 1080 } },
  clone: value => JSON.parse(JSON.stringify(value)),
  clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  safeName: value => String(value || "widget").replace(/[^a-z0-9_-]+/gi, "-").toLowerCase(),
  nativeWidgetBaseName: (layer, index = 0) => `m_w${String(layer?.name || `Widget${index + 1}`).replace(/[^a-z0-9]+/gi, "") || `Widget${index + 1}`}`,
  sourceBackedLayer: layer => Boolean(layer?.resourcePath && /\.layout$/i.test(layer.resourcePath)),
  widgetProfileFor: () => ({ runtimeClass: "FrameWidgetClass", layoutType: "Frame", label: "Frame" }),
  bindingFor: layer => layer?.binding === "player.list.connected" ? {
    id: "player.list.connected", sourceClass: "PlayerManager", sourceMethods: ["GetPlayers(playerIds)", "GetPlayerName(playerId)"],
    authority: "client-read", sourceOfTruth: "live PlayerManager", emptyValuePolicy: "omit-row", updateEvents: ["player-connected", "player-disconnected"]
  } : null,
  functionFor: layer => layer?.functionId ? { id: layer.functionId, label: layer.functionId, authority: "client-local", updateEvents: [] } : null,
  enginePlayers: () => [],
  hasEngineContextSnapshot: () => false,
  reforgerVisualFor: () => "core-admin-panel"
};
vm.createContext(sandbox);
vm.runInContext(`${appSource.slice(start, end)}; this.workbenchWidgetFor = workbenchWidgetFor; this.layoutCreateNodeFor = layoutCreateNodeFor; this.reforgerBoundsFor = reforgerBoundsFor; this.reforgerPlacementFor = reforgerPlacementFor;`, sandbox, { filename: "app-core-scaffold.js" });

const layer = {
  id: "core-admin-fixture",
  type: "table",
  name: "BWUIC_CoreAdminPanel",
  x: 24,
  y: 162,
  w: 360,
  h: 702,
  fill: "#11191d",
  color: "#ffffff",
  accent: "#f47b36",
  opacity: 1,
  fontSize: 15,
  resourcePath: admin.resourceReference,
  coreLibraryId: core.projectId,
  coreLibraryEntryId: admin.id,
  rowLayoutPath: admin.rowLayoutPath,
  requiredChildren: admin.requiredChildren,
  runtimeContracts: admin.runtimeContracts,
  binding: admin.defaultBinding,
  functionId: admin.defaultFunction,
  functionTargetWidgetName: admin.defaultFunctionTarget,
  functionHints: admin.functionHints,
  reforgerVisual: admin.visual
};

const widget = sandbox.workbenchWidgetFor(layer, 0, [layer]);
assert.strictEqual(widget.source, admin.resourceReference, "Core widget must retain its GUID-qualified source");
assert.strictEqual(widget.rowLayoutPath, admin.rowLayoutPath, "Core widget must retain its GUID-qualified row resource");
assert.strictEqual(widget.requiredNamedChildren.list, "m_wPlayerList", "Core widget must expose the actual list child");
assert.strictEqual(widget.requiredNamedChildren.selection, "m_wPlayerSelection", "Core widget must expose the actual selection child");

const node = sandbox.layoutCreateNodeFor(layer, 0, [layer]);
assert.strictEqual(node.source, admin.resourceReference, "Core native scaffold must preserve the registered source");
assert.strictEqual(node.children[0].name, "m_wPlayerCount", "native scaffold count child must match Core");
assert.strictEqual(node.children[1].name, "m_wPlayerSelection", "native scaffold selection child must match Core");
assert.strictEqual(node.children[2].name, "m_wPlayerScroll", "native scaffold scroll child must match Core");
assert.strictEqual(node.children[0].slot.anchor, "0 0 0 0", "connected count child must use a point-anchored pixel slot");
assert.strictEqual(node.children[1].slot.anchor, "0 0 0 0", "connected selection child must use a point-anchored pixel slot");
assert.strictEqual(node.children[2].slot.anchor, "0 0 0 0", "connected scroll child must use a point-anchored pixel slot");
assert(node.children[2].slot.offsetRight < 0 && node.children[2].slot.offsetBottom < 0, "connected scroll child must use signed pixel insets instead of fractional anchors");
assert.strictEqual(node.children[2].children[0].name, "m_wPlayerList", "native scaffold list child must match Core");

const catalogAdminBounds = sandbox.reforgerPlacementFor({ id: "core.admin-panel" }, "core-admin-panel");
assert.strictEqual(catalogAdminBounds.x, 24, "catalog-added Core admin must start 24px from the left");
assert.strictEqual(catalogAdminBounds.y, 162, "catalog-added Core admin must start at 15% of a 1080px canvas");
assert.strictEqual(catalogAdminBounds.w, 360, "catalog-added Core admin must retain the native 360px width");
assert.strictEqual(catalogAdminBounds.h, 702, "catalog-added Core admin must span the native 15%-80% slot");
const catalogRowBounds = sandbox.reforgerPlacementFor({ id: "core.player-row" }, "core-player-row");
assert.strictEqual(catalogRowBounds.x, 36, "catalog-added Core row must use the native list inset");
assert.strictEqual(catalogRowBounds.y, 320, "catalog-added Core row must sit below the native list header");
assert.strictEqual(catalogRowBounds.w, 332, "catalog-added Core row must use the native row width");
assert.strictEqual(catalogRowBounds.h, 32, "catalog-added Core row must use the native compact row height");

console.log("core-scaffold.test.js: PASS");
