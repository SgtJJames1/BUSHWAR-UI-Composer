const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = appSource.indexOf("function controllerSourceFor");
const end = appSource.indexOf("function makeWorkbenchPlan", start);
assert(start >= 0 && end > start, "controllerSourceFor must remain present in app.js");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${appSource.slice(start, end)}; this.controllerSourceFor = controllerSourceFor;`, sandbox);

const source = sandbox.controllerSourceFor("TestLayout", "TestLayout", [
  {
    name: "Players",
    binding: "player.list.connected",
    functionId: "player.row.select",
    requiredWidgetNames: { count: "PlayersCount", selection: "PlayersSelection", list: "PlayersList", rowName: "NameText" },
    rowLayoutPath: "UI/layouts/TestLayout-player-row.layout"
  },
  { name: "PlayerCount", binding: "player.count", functionId: "engine.context.refresh" },
  { name: "SelectedPlayer", layerType: "player", binding: "player.name" },
  { name: "Refresh", functionId: "engine.context.refresh" }
]);

assert(source.includes("playerManager.GetPlayers(playerIds);"), "generated source must use compile-valid GetPlayers call syntax");
assert(!source.includes("GetPlayers(out"), "generated source must not copy the API metadata out label into source syntax");
assert(source.includes("RefreshRuntimeBindings();"), "live refresh callback must route to runtime bindings");
assert(source.includes("runtimePlayerCount++"), "player.count must be computed from non-empty runtime names");
assert(source.includes('IsWidgetNamedOrChild(w, "Refresh")'), "named refresh widget route must be generated");
assert(source.includes('FindAnyWidget("SelectedPlayerText")'), "player.name on a Player row must target its generated Text child");
assert(!source.includes('FindAnyWidget("SelectedPlayer"))'), "player.name must not cast the Button root as a TextWidget");
assert(source.includes("current = current.GetParent();"), "callback routing must handle nested WLib child widgets");
assert(source.includes("RefreshConnectedPlayers();"), "refresh route must rebuild the connected-player rows");

console.log("controller-source.test.js: PASS");
