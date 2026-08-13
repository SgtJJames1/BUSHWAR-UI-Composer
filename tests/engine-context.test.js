const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = source.indexOf("function normalizeEnginePlayers");
const end = source.indexOf("function engineContextLabel", start);
assert(start >= 0 && end > start, "engine context normalizer must remain present in app.js");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}; this.normalizeEnginePlayers = normalizeEnginePlayers;`, sandbox);

const players = sandbox.normalizeEnginePlayers([
  { id: 1, name: "Sgt.James" },
  { id: 1, name: "duplicate" },
  { id: 2, name: "" },
  { id: 3, name: "   " },
  { id: 0, name: "invalid zero" },
  { id: -4, name: "invalid negative" },
  { id: "not-a-number", name: "invalid id" },
  { id: 5, name: "Second real player" }
]);

assert.deepStrictEqual(players.map(player => ({ id: player.id, name: player.name })), [
  { id: 1, name: "Sgt.James" },
  { id: 5, name: "Second real player" }
], "browser context must keep only unique positive IDs with non-empty names");
assert(source.includes('return state.engineContext?.source === "workbench"'), "browser must distinguish an imported zero-player snapshot from no snapshot");
assert(source.includes('hasEngineContextSnapshot() ? String(enginePlayers().length) : "NO WORKBENCH PLAYER SNAPSHOT"'), "player count preview must show zero for an imported empty roster and unknown only without a snapshot");
assert(source.includes('const countLabel = hasEngineContextSnapshot() ? `${players.length} CONNECTED` : "ENGINE SNAPSHOT REQUIRED";'), "connected-player canvas preview must not claim zero without an imported engine snapshot");
assert(source.includes('status.className = `engine-context-status${hasEngineContextSnapshot() ? " loaded" : " warn"}`'), "engine context status must report loaded even when the imported roster is empty");
assert(source.includes('preview: hasEngineContextSnapshot() ? "Imported Workbench snapshot" : "Runtime fetch required; browser does not invent values"'), "Workbench plans must mark snapshot provenance independently of player count");
assert(source.includes('snapshotLoaded: hasEngineContextSnapshot(),'), "Workbench plans must carry explicit snapshot provenance");
assert(source.includes('if (!hasEngineContextSnapshot()) return;'), "an imported zero-player snapshot must still be clearable from the context controls");

console.log("engine-context.test.js: PASS");
