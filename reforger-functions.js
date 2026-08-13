/*
 * Reforger UI callback catalogue.
 *
 * These entries describe real Enfusion callback seams or explicit controller
 * contracts. They are exported into a Workbench plan; the browser never calls
 * the game runtime and never claims that a controller was generated for you.
 */
(() => {
  "use strict";

  const functions = [
    {
      id: "ui.widget.click",
      label: "Widget click (OnClick)",
      category: "UI events",
      kind: "engine-event",
      targetKinds: ["button", "player", "table", "input", "toggle", "context", "dialog", "panel", "window", "text", "badge"],
      callback: "ScriptedWidgetEventHandler.OnClick(Widget w, int x, int y, int button)",
      authority: "client-local",
      runtime: "Route the clicked widget to the generated controller and return true only when the action is consumed.",
      implementation: { status: "generated-route", method: "OnClick", notes: "The generated controller owns the widget-name/row-ID route; game logic remains in the target addon." }
    },
    {
      id: "ui.widget.update",
      label: "Widget update (OnUpdate)",
      category: "UI events",
      kind: "engine-event",
      targetKinds: ["panel", "window", "dialog", "table", "player", "toolbar"],
      callback: "ScriptedWidgetEventHandler.OnUpdate(Widget w)",
      authority: "client-local",
      runtime: "Use a throttled refresh or state comparison; do not rebuild widgets every frame.",
      implementation: { status: "generated-route", method: "OnUpdate", notes: "Connected-player scaffolds compare a PlayerManager signature every 30 updates." }
    },
    {
      id: "ui.widget.toggle-visibility",
      label: "Toggle widget visibility",
      category: "UI actions",
      kind: "engine-api",
      targetKinds: ["button", "panel", "window", "dialog", "context", "prompt", "toast", "toolbar", "tabs", "categorybar", "text", "badge", "icon", "image", "table", "input", "toggle"],
      callback: "Widget.SetVisible(!Widget.IsVisible())",
      authority: "client-local",
      runtime: "Toggle the named target widget in the registered layout. Leave the target blank to toggle the clicked widget itself.",
      requiresTarget: true,
      implementation: { status: "generated", method: "ToggleWidgetVisibility", notes: "The controller resolves the target by its exact Workbench widget name and never changes server/game state." }
    },
    {
      id: "ui.layout.open",
      label: "Open native layout",
      category: "UI actions",
      kind: "engine-api",
      targetKinds: ["panel", "window", "dialog", "context", "table", "button", "player"],
      callback: "GetGame().GetWorkspace().CreateWidgets(ResourceName)",
      authority: "client-local",
      runtime: "Create the registered layout, keep the returned root alive, and resolve named m_w widgets with FindAnyWidget."
    },
    {
      id: "ui.layout.close",
      label: "Close native layout",
      category: "UI actions",
      kind: "engine-pattern",
      targetKinds: ["panel", "window", "dialog", "context", "table", "button", "player"],
      callback: "RemoveHandler(...) + delete root widget",
      authority: "client-local",
      runtime: "Remove input listeners and handlers before deleting the root so the UI cannot retain stale callbacks."
    },
    {
      id: "player.list.refresh",
      label: "Refresh connected players",
      category: "Player data",
      kind: "engine-api",
      targetKinds: ["table", "player", "button"],
      callback: "PlayerManager.GetPlayers(playerIds) + GetPlayerName(playerId) [out parameter]",
      authority: "client-read",
      runtime: "Read the authoritative connected-player ID array (call syntax omits the out keyword), omit empty names, and create exactly one row per returned player.",
      implementation: { status: "generated", method: "RefreshConnectedPlayers", notes: "The controller carries each playerId beside its native row and never scans guessed IDs." }
    },
    {
      id: "engine.context.refresh",
      label: "Refresh live engine values",
      category: "Engine diagnostics",
      kind: "engine-api",
      targetKinds: ["button", "panel", "context", "window", "table"],
      callback: "PlayerManager.GetPlayers(playerIds) + bound widget refresh",
      authority: "client-local",
      runtime: "Re-query the current local engine state and repaint bound widgets in memory; no browser snapshot or file export is treated as runtime authority.",
      implementation: { status: "generated", method: "RefreshRuntimeBindings", notes: "The generated controller refreshes connected rows and scalar bindings when this route is invoked." }
    },
    {
      id: "player.row.select",
      label: "Connected-player row selected",
      category: "Player actions",
      kind: "controller-contract",
      targetKinds: ["table"],
      callback: "OnPlayerRowClicked(int playerId)",
      authority: "client-local",
      runtime: "Carry the actual PlayerManager ID alongside the row; never recover identity from display text or row position.",
      requiresBinding: ["player.list.connected"],
      inputs: ["native row widget", "PlayerManager playerId"],
      outputs: ["selectedPlayerId", "selected player label"],
      sideEffects: "none",
      implementation: { status: "generated", method: "OnPlayerRowClicked", notes: "Selection stores the real playerId and updates the named selection TextWidget." }
    },
    {
      id: "player.row.teleport",
      label: "Teleport selected player (server RPC)",
      category: "Player actions",
      kind: "controller-contract",
      targetKinds: ["table", "player", "button"],
      callback: "RplRpc server request with authority validation",
      authority: "server-rpc",
      runtime: "The Composer exports only the contract. A reviewed server RPC must validate the player ID and permission before changing a transform.",
      requiresBinding: ["player.list.connected"],
      implementation: { status: "review-required", method: "RequestTeleportSelectedPlayer", notes: "The generated controller emits a compile-safe hook only; add the separately reviewed server RPC in the target addon." }
    },
    {
      id: "gm.context-action.perform",
      label: "GM context action performed",
      category: "Game Master",
      kind: "engine-event",
      targetKinds: ["context", "button"],
      callback: "SCR_BaseContextAction.Perform(...)",
      authority: "editor-local",
      runtime: "Gate CanBeShown/CanBePerformed on the local GM editor state before opening the UI.",
      implementation: { status: "review-required", method: "Perform", notes: "Use the target context-action class as the authority; the Composer only describes the route." }
    }
  ];

  window.BUSHWAR_REFORGER_FUNCTIONS = {
    schema: 1,
    checked: "2026-08-13",
    disclaimer: "Callbacks are explicit Workbench implementation contracts. The browser cannot invoke Enforce Script directly.",
    entries: functions,
    byId(id) { return functions.find(callback => callback.id === id) || null; },
    forLayer(layer) { return functions.filter(callback => callback.targetKinds.includes(layer?.type)); }
  };
})();
