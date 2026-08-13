const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = source.indexOf("function sourceBackedLayer");
const end = source.indexOf("function makeWorkbenchPlan", start);
assert(start >= 0 && end > start, "row resource helpers and controller generator must remain present in app.js");
const sandbox = { window: { BUSHWAR_REFORGER_CORE_LIBRARY: { entries: [{ id: "core.player-row", resourceReference: "{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout" }] } } };
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}; this.controllerSourceFor = controllerSourceFor; this.defaultConnectedRowResource = defaultConnectedRowResource;`, sandbox);

assert.strictEqual(sandbox.defaultConnectedRowResource(), "{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout", "connected tables must have a qualified Core row fallback");
const generated = sandbox.controllerSourceFor("Admin", "Admin", [{ name: "Players", binding: "player.list.connected", requiredNamedChildren: { list: "m_wPlayerList", count: "m_wPlayerCount", selection: "m_wPlayerSelection", scroll: "m_wPlayerScroll", rowName: "NameText" } }]);
assert(generated.includes('CONNECTED_ROW_LAYOUT = "{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout"'), "generated controllers must not use an unregistered bare row path");
assert(generated.includes("playerManager.GetPlayers(playerIds);"), "connected rows must still read the authoritative PlayerManager list");

console.log("row-layout-contract.test.js: PASS");
