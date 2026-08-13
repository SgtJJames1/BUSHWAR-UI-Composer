const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = appSource.indexOf("function normalizeLayoutGuid");
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
    requiredWidgetNames: { count: "m_wPlayerCount", selection: "m_wPlayerSelection", scroll: "m_wPlayerScroll", list: "m_wPlayerList", rowName: "NameText" },
    rowLayoutPath: "UI/layouts/TestLayout-player-row.layout"
  },
  { name: "PlayerCount", binding: "player.count", functionId: "engine.context.refresh", runtimeContract: { valueWidgetName: "CountText" } },
  { name: "SelectedPlayer", layerType: "player", binding: "player.name" },
  { name: "GmState", layerType: "text", binding: "editor.gm.open" },
  { name: "Refresh", functionId: "engine.context.refresh" },
  { name: "ToggleDetails", functionId: "ui.widget.toggle-visibility", functionTargetWidgetName: "DetailsPanel" },
  { name: "StatusButton", layerType: "button", properties: { text: "READY" }, functionId: "ui.widget.set-text", functionTargetWidgetName: "StatusText" },
  { name: "ExportContext", layerType: "button", functionId: "engine.context.export" },
  { name: "RuntimePanel", layerType: "panel", functionId: "ui.widget.update", functionTargetWidgetName: "RuntimePanel" }
]);
const qualifiedSource = sandbox.controllerSourceFor("TestLayout", "TestLayout", [], "92829430ae6ead05", "UI/layouts/Sub/TestLayout.layout");
const updateOnlySource = sandbox.controllerSourceFor("UpdateOnly", "UpdateOnly", [
  { name: "RuntimePanel", layerType: "panel", functionId: "ui.widget.update", functionTargetWidgetName: "RuntimePanel" }
]);
const rootUpdateSource = sandbox.controllerSourceFor("RootUpdate", "RootUpdate", [
  { name: "RootUpdate", layerType: "panel", functionId: "ui.widget.update", functionTargetWidgetName: "RootUpdate" }
]);

assert(source.includes("playerManager.GetPlayers(playerIds);"), "generated source must use compile-valid GetPlayers call syntax");
assert(qualifiedSource.includes('{92829430AE6EAD05}UI/layouts/Sub/TestLayout.layout'), "a registered layout GUID must preserve the qualified layout ResourceName path");
assert(!source.includes("GetPlayers(out"), "generated source must not copy the API metadata out label into source syntax");
assert(source.includes("RefreshRuntimeBindings();"), "live refresh callback must route to runtime bindings");
assert(source.includes("runtimePlayerCount++"), "player.count must be computed from non-empty runtime names");
assert(source.includes("runtimeEnginePlayerCount = playerManager.GetPlayerCount();"), "player.count must read the authoritative PlayerManager count");
assert(source.includes("runtimeEnginePlayerCount.ToString()"), "player.count must display the authoritative engine count");
assert(source.includes('IsWidgetNamedOrChild(w, "Refresh")'), "named refresh widget route must be generated");
assert(source.includes('FindAnyWidget("SelectedPlayerText")'), "player.name on a Player row must target its generated Text child");
assert(source.includes('FindAnyWidget("CountText")'), "scalar runtime child override must flow into generated controller source");
assert(!source.includes('FindAnyWidget("SelectedPlayer"))'), "player.name must not cast the Button root as a TextWidget");
assert(source.includes("m_iSelectedPlayerId >= 0"), "player.name must read the selected PlayerManager ID when one is selected");
assert(source.includes("SCR_EditorManagerEntity.IsOpenedInstance(true)"), "GM editor binding must pass the includeLimited argument required by the engine API");
assert(source.includes('ToggleWidgetVisibility("DetailsPanel", w);'), "targeted visibility actions must carry the exact Workbench widget name into generated source");
assert(source.includes("target.SetVisible(!target.IsVisible());"), "visibility action must generate a concrete native widget operation");
assert(source.includes('SetWidgetText("StatusText", "READY");'), "set-text action must generate a concrete TextWidget operation");
assert(source.includes("ExportRuntimeContext();"), "engine context export must generate a concrete snapshot route");
assert(source.includes('FindAnyWidget("RuntimePanel")'), "widget update must resolve its exact target widget");
assert(source.includes("m_aWidgetUpdateTargets.Insert(updateTarget_"), "widget update must attach the controller to its target widget");
assert(source.includes("m_aWidgetUpdateTargets.Find(w)"), "widget update must route OnUpdate only from registered target widgets");
assert(source.includes("OnWidgetUpdateContract(w)"), "widget update must expose a compile-safe generated callback seam");
assert(source.includes("m_iWidgetUpdateCounter < 30"), "widget update must be throttled instead of rebuilding every frame");
assert(updateOnlySource.includes("override bool OnUpdate(Widget w)"), "update-only designs must still generate the native OnUpdate override");
assert(!updateOnlySource.includes('OnReviewRequiredCallback("ui.widget.update"'), "generated widget update must not be misrouted through the review-only click hook");
assert(rootUpdateSource.includes("m_aWidgetUpdateTargets.Insert(updateTarget_0);"), "widget update must support a root widget target without losing the handler");
assert(source.includes('PackToFile("$profile:BUSHWAR-UIComposer/runtime-context.json")'), "engine context export must write the documented local snapshot path");
assert(source.includes('snapshot.players.Insert(player);'), "engine context export must append only filtered runtime player records");
assert(source.includes('snapshot.playerCount = playerManager.GetPlayerCount();'), "engine context export must preserve the authoritative PlayerManager count separately from filtered rows");
assert(source.includes('RegV(\"playerCount\");'), "generated context snapshots must register playerCount for JSON export");
assert(source.includes('snapshot.playerCountKnown = true;'), "generated context snapshots must mark the PlayerManager scalar as known only when the manager is available");
assert(source.includes('RegV(\"playerCountKnown\");'), "generated context snapshots must register playerCountKnown for JSON export");
assert(source.includes("current = current.GetParent();"), "callback routing must handle nested WLib child widgets");
assert(source.includes("RefreshConnectedPlayers();"), "refresh route must rebuild the connected-player rows");
assert(source.includes("if (m_aPlayerRowIds.Find(playerId) >= 0)"), "generated controllers must deduplicate PlayerManager IDs before creating rows");
assert(source.includes("array<int> capturedPlayerIds = {};"), "generated context snapshots must deduplicate PlayerManager IDs");
assert(source.includes("array<int> countedPlayerIds = {};"), "generated scalar player counts must deduplicate PlayerManager IDs");
assert(source.includes("if (playerId <= 0)"), "generated controllers must reject non-positive PlayerManager IDs");
assert(source.includes("if (runtimePlayerIds[runtimeIndex] <= 0) continue;"), "generated scalar bindings must reject non-positive PlayerManager IDs");
assert(source.includes('FindAnyWidget("m_wPlayerList")'), "Core connected-player controllers must use the manifest list child name");
assert(source.includes('FindAnyWidget("m_wPlayerSelection")'), "Core connected-player controllers must use the manifest selection child name");
assert(source.includes("if (playerName.IsEmpty())"), "row selection must reject a stale or unnamed PlayerManager ID");
assert(source.includes("unavailableCount.SetText(\"PLAYER DATA UNAVAILABLE\")"), "missing PlayerManager must expose unavailable runtime state instead of claiming zero players");
assert(source.includes("if (!nameText)"), "generated controllers must reject a row prefab that lacks the required NameText child");
assert(source.includes("runtimePlayerDataAvailable"), "scalar player bindings must distinguish unavailable PlayerManager state from a real zero count");
assert(source.includes("SetReadableFont(m_wRoot, \"NameText\""), "generated controller must carry the Composer font contract into the native row");
assert(source.includes("FindPlayerRowIndex(w)"), "nested row children must resolve to one canonical row identity");
assert(!source.includes("m_aPlayerRows.Insert(nameText)"), "nested row text must not become a duplicate player row");

console.log("controller-source.test.js: PASS");
