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
      targetKinds: ["table"],
      updateEvents: ["player joined", "player left"],
      authority: "client-read",
      runtime: "Read the authoritative connected-player ID array (the API parameter is out, but the EnforceScript call is GetPlayers(playerIds)), resolve each name, and omit empty values; never scan a guessed ID range or create placeholder rows.",
      sourceOfTruth: "live PlayerManager",
      emptyValuePolicy: "omit-row",
      identityField: "playerId",
      previewPolicy: "snapshot-only",
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
      sourceOfTruth: "live PlayerManager",
      emptyValuePolicy: "unavailable-label",
      identityField: "playerId",
      previewPolicy: "snapshot-only",
      preview: "scalar"
    },
    {
      id: "player.count",
      label: "Connected player count",
      category: "Players",
      valueType: "int",
      sourceClass: "PlayerManager",
      sourceMethods: ["GetPlayerCount()", "GetPlayers(playerIds) [out parameter]", "GetPlayerName(playerId)"],
      targetKinds: ["text", "badge"],
      updateEvents: ["player joined", "player left"],
      authority: "client-read",
      runtime: "Read the authoritative PlayerManager.GetPlayerCount() for the scalar count, while the connected-player table independently filters IDs and empty names before creating rows; never show a design-time placeholder count.",
      sourceOfTruth: "live PlayerManager",
      emptyValuePolicy: "count-valid-names",
      identityField: "playerId",
      previewPolicy: "snapshot-only",
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
      runtime: "Hide GM-only widgets when the local editor is closed or limited; generated source calls IsOpenedInstance(true) to include the engine's limited-editor argument.",
      sourceOfTruth: "live SCR_EditorManagerEntity",
      emptyValuePolicy: "unknown-state",
      previewPolicy: "snapshot-only",
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
