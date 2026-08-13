/*
 * BUSHWAR UI Composer Core library manifest.
 *
 * These are BUSHWAR-owned resources from the companion
 * BUSHWAR-UIComposer-Core addon. Workbench must register the layouts and
 * generate their .meta files; the website keeps the paths/contracts in sync
 * but never pretends to execute or serialize the engine resources itself.
 *
 * The GM admin panel is deliberately NOT part of this library; it belongs to
 * the BUSHWAR GM tools project and stays there.
 */
(() => {
  "use strict";

  const entries = [
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
    version: "0.2.0",
    entries,
    disclaimer: "BUSHWAR Core resources. Register the companion addon in Workbench; the website stores paths/contracts only and does not redistribute vanilla assets. The GM admin panel is not part of this library."
  };
})();
