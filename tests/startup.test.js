const fs = require("fs");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const index = fs.readFileSync(require.resolve("../index.html"), "utf8");

assert(source.includes("const previousSessionStorageKey"), "startup must keep an explicit previous-session restore slot");
assert(source.includes("state = freshState();"), "startup must reset to a fresh blank state");
assert(source.includes("showLandingPage();"), "startup must show the blank workspace landing dialog");
assert(source.includes('if (choice === "restore" && persistedSession)'), "landing dialog must make restore explicit");
assert(!source.includes('if (!state.layers.length) applyTemplate("gm-admin"); else render();'), "startup must not auto-load the GM template");
assert(index.includes('id="landingDialog"'), "index must contain the blank workspace landing dialog");
assert(index.includes('id="landingRestoreBtn"'), "landing dialog must expose previous-session restore explicitly");
assert(index.includes('id="templatesSection"'), "template browse action needs a stable target section");

console.log("startup.test.js: PASS");
