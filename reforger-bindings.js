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
      sourceMethods: ["GetPlayers(playerIds) [out parameter]", "GetPlayerName(playerId)"],
      targetKinds: ["table", "player"],
      updateEvents: ["player joined", "player left"],
      authority: "client-read",
      runtime: "Read the authoritative connected-player ID array (the API parameter is out, but the EnforceScript call is GetPlayers(playerIds)), resolve each name, and omit empty values; never scan a guessed ID range or create placeholder rows.",
      preview: "engine-list"
    },
    {
      id: "player.name",
      label: "Player display name",
      category: "Players",
      valueType: "string",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayerName(playerId)"],
      targetKinds: ["text", "badge", "player"],
      updateEvents: ["player identity changed"],
      authority: "client-read",
      runtime: "Read the selected player record; empty values must render as unavailable, not as a fake name.",
      preview: "scalar"
    },
    {
      id: "player.count",
      label: "Connected player count",
      category: "Players",
      valueType: "int",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayers(playerIds) [out parameter]"],
      targetKinds: ["text", "badge"],
      updateEvents: ["player joined", "player left"],
      authority: "client-read",
      runtime: "Read the current PlayerManager ID array and show its valid non-empty-name count; never show a design-time placeholder count.",
      preview: "scalar"
    },
    {
      id: "editor.gm.open",
      label: "GM editor is open",
      category: "Game Master",
      valueType: "bool",
      sourceClass: "SCR_EditorManagerEntity",
      sourceMethods: ["IsOpenedInstance(includeLimited)"],
      targetKinds: ["text", "badge"],
      updateEvents: ["editor opened", "editor closed"],
      authority: "client-read",
      runtime: "Hide GM-only widgets when the local editor is closed or limited.",
      preview: "scalar"
    },
  ];

  window.BUSHWAR_REFORGER_BINDINGS = {
    schema: 1,
    checked: "2026-08-13",
    disclaimer: "Bindings are explicit Workbench implementation contracts. The browser cannot call the game engine directly.",
    entries: bindings,
    byId(id) { return bindings.find(binding => binding.id === id) || null; }
  };
})();
