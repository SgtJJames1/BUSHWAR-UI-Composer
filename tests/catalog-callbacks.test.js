const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../reforger-catalog.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "reforger-catalog.js" });
const catalog = sandbox.window.BUSHWAR_REFORGER_CATALOG;
assert(catalog && catalog.entries.length >= 150, "the Reforger catalog must retain the verified resource inventory");
const button = catalog.entries.find(entry => entry.name === "WLib_ButtonText");
const editBox = catalog.entries.find(entry => entry.name === "WLib_EditBox");
const menu = catalog.entries.find(entry => entry.name === "WLib_MenuBase");
const atlas = catalog.entries.find(entry => entry.name === "iconCredits.edds");
assert(button.functionHints.includes("ui.widget.click"), "button resources must advertise the native click callback");
assert(editBox.functionHints.includes("ui.widget.set-text"), "edit-box resources must advertise the TextWidget update contract");
assert(menu.functionHints.includes("ui.layout.open") && menu.functionHints.includes("ui.layout.close"), "menu resources must advertise open/close contracts");
assert.strictEqual(atlas.functionHints.length, 0, "texture atlas references must not claim widget callbacks");

console.log("catalog-callbacks.test.js: PASS");
