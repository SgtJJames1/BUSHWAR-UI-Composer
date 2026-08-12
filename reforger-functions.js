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
      targetKinds: ["button", "player", "table", "input", "toggle", "context", "dialog"],
      callback: "ScriptedWidgetEventHandler.OnClick(Widget w, int x, int y, int button)",
      authority: "client-local",
      runtime: "Route the clicked widget to the generated controller and return true only when the action is consumed."
    },
    {
      id: "ui.widget.update",
      label: "Widget update (OnUpdate)",
      category: "UI events",
      kind: "engine-event",
      targetKinds: ["panel", "window", "dialog", "table", "player", "toolbar"],
      callback: "ScriptedWidgetEventHandler.OnUpdate(Widget w)",
      authority: "client-local",
      runtime: "Use a throttled refresh or state comparison; do not rebuild widgets every frame."
    },
    {
      id: "ui.layout.open",
      label: "Open native layout",
      category: "UI actions",
      kind: "engine-api",
      targetKinds: ["panel", "window", "dialog", "context", "table"],
      callback: "GetGame().GetWorkspace().CreateWidgets(ResourceName)",
      authority: "client-local",
      runtime: "Create the registered layout, keep the returned root alive, and resolve named m_w widgets with FindAnyWidget."
    },
    {
      id: "ui.layout.close",
      label: "Close native layout",
      category: "UI actions",
      kind: "engine-pattern",
      targetKinds: ["panel", "window", "dialog", "context", "table"],
      callback: "RemoveHandler(...) + delete root widget",
      authority: "client-local",
      runtime: "Remove input listeners and handlers before deleting the root so the UI cannot retain stale callbacks."
    },
    {
      id: "player.list.refresh",
      label: "Refresh connected players",
      category: "Player data",
      kind: "engine-api",
      targetKinds: ["table", "player"],
      callback: "PlayerManager.GetPlayerCount() + GetPlayerName(playerId)",
      authority: "client-read",
      runtime: "Enumerate valid IDs, omit empty names, and create exactly one row per returned player."
    },
    {
      id: "player.row.select",
      label: "Connected-player row selected",
      category: "Player actions",
      kind: "controller-contract",
      targetKinds: ["table", "player"],
      callback: "OnPlayerRowClicked(int playerId)",
      authority: "client-local",
      runtime: "Carry the actual PlayerManager ID alongside the row; never recover identity from display text or row position."
    },
    {
      id: "player.row.teleport",
      label: "Teleport selected player (server RPC)",
      category: "Player actions",
      kind: "controller-contract",
      targetKinds: ["table", "player", "button"],
      callback: "RplRpc server request with authority validation",
      authority: "server-rpc",
      runtime: "The Composer exports only the contract. A reviewed server RPC must validate the player ID and permission before changing a transform."
    },
    {
      id: "gm.context-action.perform",
      label: "GM context action performed",
      category: "Game Master",
      kind: "engine-event",
      targetKinds: ["context", "button"],
      callback: "SCR_BaseContextAction.Perform(...)",
      authority: "editor-local",
      runtime: "Gate CanBeShown/CanBePerformed on the local GM editor state before opening the UI."
    }
  ];

  window.BUSHWAR_REFORGER_FUNCTIONS = {
    schema: 1,
    checked: "2026-08-12",
    disclaimer: "Callbacks are explicit Workbench implementation contracts. The browser cannot invoke Enforce Script directly.",
    entries: functions,
    byId(id) { return functions.find(callback => callback.id === id) || null; },
    forLayer(layer) { return functions.filter(callback => callback.targetKinds.includes(layer?.type)); }
  };
})();
