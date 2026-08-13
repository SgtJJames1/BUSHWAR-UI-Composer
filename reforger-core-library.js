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
      resourceGuid: "92829430AE6EAD05",
      resourceReference: "{92829430AE6EAD05}UI/layouts/BWUIC_CoreAdminPanel.layout",
      preview: "GM",
      visual: "core-admin-panel",
      nativeWidgetClass: "LayoutResource",
      nativeChildHint: "FrameWidgetClass",
      geometry: { left: 24, top: 0.15, width: 360, bottom: 0.8, coordinateSpace: "screen" },
      coreLibraryId: "BUSHWAR-UIComposer-Core",
      rowLayoutPath: "{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout",
      defaultBinding: "player.list.connected",
      defaultFunction: "engine.context.refresh",
      defaultFunctionTarget: "m_wRefresh",
      functionHints: ["ui.widget.click", "player.row.select", "engine.context.refresh", "ui.layout.close"],
      nativeTree: "Frame m_wRoot > Frame m_wAdminPanel > Text m_wAdminPanelTitle + Button m_wClose + Button m_wRefresh + Text m_wConnectedLabel + Text m_wPlayerCount + Text m_wPlayerSelection + ScrollLayout m_wPlayerScroll > VerticalLayout m_wPlayerList > Button Row > Text NameText",
      workbenchAction: "Drag this registered Core layout into the target layout and preserve the named children",
      requiredChildren: {
        root: "m_wRoot", panel: "m_wAdminPanel", title: "m_wAdminPanelTitle", close: "m_wClose", refresh: "m_wRefresh",
        connectedLabel: "m_wConnectedLabel", count: "m_wPlayerCount", selection: "m_wPlayerSelection",
        scroll: "m_wPlayerScroll", list: "m_wPlayerList", rowRoot: "Row", rowName: "NameText",
        // Legacy semantic aliases remain for imported plans created before the
        // controller contract was made canonical.
        playerCount: "m_wPlayerCount", playerSelection: "m_wPlayerSelection",
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
      resourceGuid: "F487371808027463",
      resourceReference: "{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout",
      preview: "ROW",
      visual: "core-player-row",
      nativeWidgetClass: "LayoutResource",
      nativeChildHint: "ButtonWidgetClass",
      geometry: { width: 332, height: 32, coordinateSpace: "panel-list" },
      coreLibraryId: "BUSHWAR-UIComposer-Core",
      defaultBinding: "player.name",
      runtimeValueWidgetName: "NameText",
      functionHints: ["ui.widget.click", "player.row.select", "ui.widget.set-text"],
      nativeTree: "Button Row > Text NameText",
      workbenchAction: "Use as the rowLayoutPath for player.list.connected and preserve Row/NameText",
      requiredChildren: { rowRoot: "Row", rowName: "NameText" },
      runtimeContracts: ["player.list.connected", "player.row.select"]
    }
  ];

  window.BUSHWAR_REFORGER_CORE_LIBRARY = {
    schema: 1,
    projectId: "BUSHWAR-UIComposer-Core",
    projectGuid: "B3A5F08C0D504D96",
    version: "0.1.2",
    entries,
    disclaimer: "BUSHWAR Core resources. Register the companion addon in Workbench; the website stores paths/contracts only and does not redistribute vanilla assets."
  };
})();
