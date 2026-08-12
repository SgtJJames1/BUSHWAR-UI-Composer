const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = appSource.indexOf("function runtimeContractAuditRows");
const end = appSource.indexOf("function validateHandoff", start);
assert(start >= 0 && end > start, "runtime contract audit functions must remain present in app.js");

const bindings = {
  "player.list.connected": { sourceClass: "PlayerManager", sourceMethods: ["GetPlayers(playerIds)"], authority: "client-read", targetKinds: ["table"] },
  "player.count": { sourceClass: "PlayerManager", sourceMethods: ["GetPlayers(playerIds)"], authority: "client-read", targetKinds: ["text"] }
};
const callbacks = {
  "player.row.select": { label: "Connected-player row selected", authority: "client-local", targetKinds: ["table"], requiresBinding: ["player.list.connected"] },
  "player.row.teleport": { label: "Teleport selected player", authority: "server-rpc", targetKinds: ["table"], requiresBinding: ["player.list.connected"], implementation: { status: "review-required" } }
};
const state = { layers: [
  { id: "connected", name: "Connected players", type: "table", binding: "player.list.connected", functionId: "player.row.select", visible: true },
  { id: "teleport", name: "Teleport", type: "table", binding: "player.list.connected", functionId: "player.row.teleport", visible: true },
  { id: "hidden", name: "Hidden count", type: "text", binding: "player.count", functionId: "", visible: false }
] };

const sandbox = {
  state,
  makeWorkbenchPlan: () => ({ widgets: [
    { id: "connected", name: "m_wConnected", runtimeContract: { valueWidgetName: "m_wConnected" } },
    { id: "teleport", name: "m_wTeleport", runtimeContract: { valueWidgetName: "m_wTeleport" } }
  ] }),
  bindingFor: layer => bindings[layer.binding] || null,
  functionFor: layer => callbacks[layer.functionId] || null,
  escapeHtml: value => String(value)
};
vm.createContext(sandbox);
vm.runInContext(`${appSource.slice(start, end)}; this.runtimeContractAuditRows = runtimeContractAuditRows;`, sandbox);

const rows = sandbox.runtimeContractAuditRows();
assert.strictEqual(rows.length, 3, "audit should include every runtime-bound layer");
assert.strictEqual(rows[0].status, "ready", "connected table should be ready");
assert.strictEqual(rows[1].status, "review", "server-authoritative callback should require review");
assert.strictEqual(rows[2].status, "error", "hidden runtime-bound layers must be flagged");
assert.strictEqual(rows[2].target, "not exported", "hidden layers must not claim an exported target");

console.log("contract-audit.test.js: PASS");
