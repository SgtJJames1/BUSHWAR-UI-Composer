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
  defaultConnectedRowResource: () => admin.rowLayoutPath,
  connectedRowResourceFor: layer => layer?.rowLayoutPath || admin.rowLayoutPath,
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
  nativeGeometry: admin.geometry,
  functionHints: admin.functionHints,
  reforgerVisual: admin.visual
};

const widget = sandbox.workbenchWidgetFor(layer, 0, [layer]);
assert.strictEqual(widget.source, admin.resourceReference, "Core widget must retain its GUID-qualified source");
assert.strictEqual(widget.rowLayoutPath, admin.rowLayoutPath, "Core widget must retain its GUID-qualified row resource");
assert.strictEqual(widget.nativeGeometry.width, 360, "Core widget must retain the registered native width contract");
assert.strictEqual(widget.requiredNamedChildren.list, "m_wPlayerList", "Core widget must expose the actual list child");
assert.strictEqual(widget.requiredNamedChildren.selection, "m_wPlayerSelection", "Core widget must expose the actual selection child");

const node = sandbox.layoutCreateNodeFor(layer, 0, [layer]);
assert.strictEqual(node.source, admin.resourceReference, "Core native scaffold must preserve the registered source");
const countNode = node.children.find(child => child.name === "m_wPlayerCount");
const selectionNode = node.children.find(child => child.name === "m_wPlayerSelection");
const scrollNode = node.children.find(child => child.name === "m_wPlayerScroll");
assert(countNode && selectionNode && scrollNode, "native scaffold must include the canonical Core count/selection/scroll children");
assert.strictEqual(countNode.slot.anchor, "0 0 0 0", "connected count child must use a point-anchored pixel slot");
assert.strictEqual(selectionNode.slot.anchor, "0 0 0 0", "connected selection child must use a point-anchored pixel slot");
assert.strictEqual(scrollNode.slot.anchor, "0 0 1 1", "connected scroll child must fill the Core panel with anchored insets");
assert.strictEqual(scrollNode.slot.positionX, 12, "connected scroll child must preserve the native left inset");
assert.strictEqual(scrollNode.slot.positionY, 158, "connected scroll child must preserve the native top inset");
assert.strictEqual(scrollNode.slot.sizeX, -24, "connected scroll child must preserve the native horizontal inset");
assert.strictEqual(scrollNode.slot.sizeY, -12, "connected scroll child must preserve the native bottom inset");
assert.strictEqual(scrollNode.children[0].name, "m_wPlayerList", "native scaffold list child must match Core");
assert.strictEqual(node.children.find(child => child.name === "m_wRefresh")?.slot.sizeX, 96, "Core scaffold must preserve the native refresh button width");
assert.strictEqual(node.children.find(child => child.name === "m_wAdminPanelTitle")?.slot.positionX, 18, "Core scaffold must preserve the native title position");

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
