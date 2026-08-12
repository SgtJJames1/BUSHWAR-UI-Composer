const fs = require("fs");
const assert = require("assert");
const path = require("path");

const controllerCandidates = [
  process.env.BUSHWAR_VALIDATION_CONTROLLER,
  path.resolve(__dirname, "../../../Reforger-Workbench-Mods/BUSHWAR-UIComposer-Validation/Scripts/Game/UI/BWUIC_BushwarComposerlayoutController.c")
].filter(Boolean);
const controllerPath = controllerCandidates.find(candidate => fs.existsSync(candidate));
if (!controllerPath) {
  console.log("validation-controller.test.js: SKIP (validation addon is not present beside this Composer checkout)");
  process.exit(0);
}
const source = fs.readFileSync(controllerPath, "utf8");

assert(source.includes("playerManager.GetPlayers(playerIds);"), "validation controller must use compile-valid GetPlayers syntax");
assert(!source.includes("GetPlayers(out"), "validation controller must not emit the API metadata out keyword");
assert(source.includes('GetPlayerName(playerId)'), "validation controller must resolve each returned player ID");
assert(source.includes("if (playerName.IsEmpty())"), "validation controller must filter empty player names");
assert(source.includes("IsWidgetNamedOrChild"), "validation controller must support nested WLib callback targets");
assert(source.includes('IsWidgetNamedOrChild(w, "m_wClose")'), "close callback must use the nested-widget route");
assert(source.includes("RefreshRuntimeBindings()"), "validation controller must refresh scalar runtime bindings");

console.log("validation-controller.test.js: PASS");
