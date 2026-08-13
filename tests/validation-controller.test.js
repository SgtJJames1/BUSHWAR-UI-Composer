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
const contextActionCandidates = [
  process.env.BUSHWAR_VALIDATION_CONTEXT_ACTION,
  path.resolve(__dirname, "../../../Reforger-Workbench-Mods/BUSHWAR-UIComposer-Validation/Scripts/Game/Editor/Actions/BWUIC_OpenAdminMenuContextAction.c")
].filter(Boolean);
const contextActionPath = contextActionCandidates.find(candidate => fs.existsSync(candidate));
assert(contextActionPath, "validation addon context-action source must be present beside this Composer checkout");
const contextActionSource = fs.readFileSync(contextActionPath, "utf8");
const adminMenuPath = path.resolve(__dirname, "../../../Reforger-Workbench-Mods/BUSHWAR-UIComposer-Validation/Scripts/Game/UI/BWUIC_AdminMenu.c");
assert(fs.existsSync(adminMenuPath), "validation addon admin-menu fixture must be present beside this Composer checkout");
const adminMenuSource = fs.readFileSync(adminMenuPath, "utf8");

assert(source.includes("playerManager.GetPlayers(playerIds);"), "validation controller must use compile-valid GetPlayers syntax");
assert(source.includes('{92829430AE6EAD05}UI/layouts/BWUIC_CoreAdminPanel.layout'), "validation controller must use the registered BUSHWAR Core admin layout GUID");
assert(source.includes('{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout'), "validation controller must use the registered BUSHWAR Core row layout GUID");
assert(!source.includes("GetPlayers(out"), "validation controller must not emit the API metadata out keyword");
assert(source.includes('GetPlayerName(playerId)'), "validation controller must resolve each returned player ID");
assert(source.includes("if (playerName.IsEmpty())"), "validation controller must filter empty player names");
assert(source.includes('unavailableCount.SetText("0 CONNECTED")'), "validation controller must clear count when PlayerManager is unavailable");
assert(source.includes('unavailableSelection.SetText("SELECTED: NONE")'), "validation controller must clear selection when PlayerManager is unavailable");
assert(source.includes("if (m_aPlayerRowIds.Find(playerId) >= 0)"), "validation controller must deduplicate PlayerManager IDs before creating rows");
assert(source.includes("if (playerId <= 0)"), "validation controller must reject non-positive PlayerManager IDs");
assert(source.includes("IsWidgetNamedOrChild"), "validation controller must support nested WLib callback targets");
assert(source.includes('IsWidgetNamedOrChild(w, "m_wClose")'), "close callback must use the nested-widget route");
assert(source.includes('IsWidgetNamedOrChild(w, "m_wRefresh")'), "refresh callback must use the nested-widget route");
assert(source.includes("RefreshRuntimeBindings()"), "validation controller must refresh scalar runtime bindings");
assert(source.includes("FindPlayerRowIndex(w)"), "validation controller must resolve nested row clicks to one row identity");
assert(!source.includes("m_aPlayerRows.Insert(nameText)"), "validation controller must not duplicate rows for nested name widgets");
assert(adminMenuSource.includes("if (m_aPlayerRowIds.Find(playerId) >= 0)"), "admin-menu fixture must deduplicate PlayerManager IDs before creating rows");
assert(adminMenuSource.includes("if (playerId <= 0)"), "admin-menu fixture must reject non-positive PlayerManager IDs");
assert(adminMenuSource.includes("array<int> signaturePlayerIds = {};"), "admin-menu fixture signature must deduplicate PlayerManager IDs");
assert(contextActionSource.includes("class BWUIC_ValidationRuntimeContextSnapshot : JsonApiStruct"), "validation addon must define a JSON runtime context snapshot");
assert(contextActionSource.includes('RegV("players")'), "runtime context snapshot must register its player array");
assert(contextActionSource.includes("playerManager.GetPlayers(playerIds);"), "runtime context exporter must read the authoritative PlayerManager IDs");
assert(contextActionSource.includes("if (playerName.IsEmpty())"), "runtime context exporter must filter empty player names");
assert(contextActionSource.includes("array<int> capturedPlayerIds = {};"), "runtime context exporter must deduplicate PlayerManager IDs");
assert(contextActionSource.includes("if (playerId <= 0)"), "runtime context exporter must reject non-positive PlayerManager IDs");
assert(contextActionSource.includes('PackToFile("$profile:BUSHWAR-UIComposer/runtime-context.json")'), "runtime context exporter must write the documented profile snapshot path");
assert(contextActionSource.includes("class BWUIC_ExportEngineContextContextAction"), "GM context menu must expose the runtime context export action");

console.log("validation-controller.test.js: PASS");
