const fs = require("fs");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
assert(source.includes('name: "Connected count (engine)"'), "GM template must include a connected-count layer");
assert(source.includes('binding: "player.count"'), "GM template count must use the PlayerManager-backed scalar binding");
assert(source.includes('name: "Refresh live values"'), "GM template must include a refresh control");
assert(source.includes('functionId: "engine.context.refresh"'), "GM template refresh control must use the engine refresh callback");

console.log("template-runtime.test.js: PASS");
