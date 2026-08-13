const fs = require("fs");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../reforger-bindings.js"), "utf8");
assert(source.includes('id: "player.list.connected"'), "connected-player binding must remain in the catalog");
assert(source.includes('sourceOfTruth: "live PlayerManager"'), "player bindings must declare the live engine authority");
assert(source.includes('emptyValuePolicy: "omit-row"'), "connected-player binding must declare that empty names are omitted");
assert(source.includes('identityField: "playerId"'), "connected-player binding must carry the runtime identity field");
assert(source.includes('previewPolicy: "snapshot-only"'), "browser context must be documented as preview-only");
assert(source.includes('targetKinds: ["table"]'), "connected-player list binding must be table-only");
assert(source.includes('id: "player.count"') && source.includes('GetPlayerName(playerId)'), "player count must count valid named PlayerManager records, not raw slots");

console.log("binding-contract.test.js: PASS");
