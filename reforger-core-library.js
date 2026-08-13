/*
 * BUSHWAR UI Composer Core library manifest.
 *
 * These are BUSHWAR-owned resources from the companion
 * BUSHWAR-UIComposer-Core addon. Workbench must register the layouts and
 * generate their .meta files; the website keeps the paths/contracts in sync
 * but never pretends to execute or serialize the engine resources itself.
 */
(() => {
  "use strict";

  const entries = [
    {
      id: "core.admin-panel",
      category: "BUSHWAR Core",
      kind: "Layout prefab",
      name: "BWUIC_CoreAdminPanel",
      path: "UI/layouts/BWUIC_CoreAdminPanel.layout",
      preview: "GM",
      nativeWidgetClass: "LayoutResource",
      nativeChildHint: "FrameWidgetClass",
      coreLibraryId: "BUSHWAR-UIComposer-Core",
      workbenchAction: "Drag this registered Core layout into the target layout and preserve the named children",
      requiredChildren: {
        root: "m_wRoot", panel: "m_wAdminPanel", title: "m_wAdminPanelTitle", close: "m_wClose", refresh: "m_wRefresh",
        connectedLabel: "m_wConnectedLabel", playerCount: "m_wPlayerCount", playerSelection: "m_wPlayerSelection",
        playerScroll: "m_wPlayerScroll", playerList: "m_wPlayerList"
      },
      runtimeContracts: ["player.list.connected", "player.count", "player.row.select", "engine.context.refresh"]
    },
    {
      id: "core.player-row",
      category: "BUSHWAR Core",
      kind: "Layout prefab",
      name: "BWUIC_CorePlayerRow",
      path: "UI/layouts/BWUIC_CorePlayerRow.layout",
      preview: "ROW",
      nativeWidgetClass: "LayoutResource",
      nativeChildHint: "ButtonWidgetClass",
      coreLibraryId: "BUSHWAR-UIComposer-Core",
      workbenchAction: "Use as the rowLayoutPath for player.list.connected and preserve Row/NameText",
      requiredChildren: { rowRoot: "Row", rowName: "NameText" },
      runtimeContracts: ["player.list.connected", "player.row.select"]
    }
  ];

  window.BUSHWAR_REFORGER_CORE_LIBRARY = {
    schema: 1,
    projectId: "BUSHWAR-UIComposer-Core",
    projectGuid: "B3A5F08C0D504D96",
    version: "0.1.0",
    entries,
    disclaimer: "BUSHWAR Core resources. Register the companion addon in Workbench; the website stores paths/contracts only and does not redistribute vanilla assets."
  };
})();
