window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.5.2",
  published: "12 August 2026",
  title: "Workbench import-plan update",
  summary: "Reforger reference layers now behave like visual UI compositions, and your design can be handed to Workbench with structured implementation data.",
  changes: [
    "Reforger database layers no longer sit inside one generic reference card; each renders as its own UI composition.",
    "Added Export Workbench import plan with target type, layout name, widget sources, root data, anchors, bounds, and script-safe widget names.",
    "The exported plan preserves real vanilla layout paths while keeping reference-board images out of a game import.",
    "Workbench authoring remains Layout Editor-owned so widget GUIDs and serialization stay valid."
  ]
};
