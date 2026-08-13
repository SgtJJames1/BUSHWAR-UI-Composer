const fs = require("fs");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../reforger-functions.js"), "utf8");
const matches = source.match(/id: "ui\.widget\.toggle-visibility"/g) || [];
assert.strictEqual(matches.length, 1, "visibility action must have one canonical function entry");
assert(source.includes('requiresTarget: true'), "targetable actions must declare that they accept a Workbench widget name");
assert(source.includes('implementation: { status: "generated"'), "safe local actions must declare their generated implementation status");
assert(source.includes('id: "ui.widget.set-text"'), "function database must include the concrete native text action");

console.log("function-contract.test.js: PASS");
