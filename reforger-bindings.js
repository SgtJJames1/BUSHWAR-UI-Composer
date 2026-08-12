/*
 * Reforger runtime binding catalogue.
 *
 * These are contracts for generated Workbench handoffs, not browser APIs and
 * not bundled game code. The website can preview the shape of a binding, but
 * only a generated Enfusion script in the target addon can execute it.
 */
(() => {
  "use strict";

  const bindings = [
    {
      id: "player.list.connected",
      label: "Connected players",
      category: "Players",
      valueType: "array<PlayerRecord>",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayerCount()", "GetPlayerName(playerId)"],
      updateEvents: ["player joined", "player left"],
      authority: "client-read",
      runtime: "Enumerate valid player IDs and omit empty names; never create placeholder rows.",
      preview: "engine-list"
    },
    {
      id: "player.name",
      label: "Player display name",
      category: "Players",
      valueType: "string",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayerName(playerId)"],
      updateEvents: ["player identity changed"],
      authority: "client-read",
      runtime: "Read the selected player record; empty values must render as unavailable, not as a fake name.",
      preview: "scalar"
    },
    {
      id: "player.controlled-entity",
      label: "Player controlled entity",
      category: "Players",
      valueType: "IEntity",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayerControlledEntity(playerId)"],
      updateEvents: ["player possession changed", "player respawned"],
      authority: "client-read",
      runtime: "Resolve the entity at refresh time; do not cache a stale entity reference across respawns.",
      preview: "scalar"
    },
    {
      id: "editor.gm.open",
      label: "GM editor is open",
      category: "Game Master",
      valueType: "bool",
      sourceClass: "SCR_EditorManagerEntity",
      sourceMethods: ["GetInstance()", "IsOpened()"],
      updateEvents: ["editor opened", "editor closed"],
      authority: "client-read",
      runtime: "Hide GM-only widgets when the local editor is closed or limited.",
      preview: "scalar"
    },
    {
      id: "menu.close",
      label: "Close this menu",
      category: "UI actions",
      valueType: "event",
      sourceClass: "ScriptedWidgetEventHandler",
      sourceMethods: ["delete root widget", "remove input listener"],
      updateEvents: ["button clicked", "MenuBack"],
      authority: "client-local",
      runtime: "A local UI action; it does not grant server authority.",
      preview: "action"
    },
    {
      id: "player.teleport.near",
      label: "Teleport player (server RPC required)",
      category: "Game Master actions",
      valueType: "event",
      sourceClass: "SCR_PlayerController",
      sourceMethods: ["RplRpc Server", "authority validation", "SetTransform"],
      updateEvents: ["button clicked"],
      authority: "server-rpc",
      runtime: "Only a separately reviewed server RPC may implement this. The Composer never invents or embeds admin authority.",
      preview: "action"
    }
  ];

  window.BUSHWAR_REFORGER_BINDINGS = {
    schema: 1,
    checked: "2026-08-12",
    disclaimer: "Bindings are explicit Workbench implementation contracts. The browser cannot call the game engine directly.",
    entries: bindings,
    byId(id) { return bindings.find(binding => binding.id === id) || null; }
  };
})();
