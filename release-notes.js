window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.9.0",
  published: "12 August 2026",
  title: "Executable Workbench controller handoff",
  summary: "Workbench exports now include a reviewable controller scaffold so data bindings and row callbacks can be compiled and tested instead of stopping at a visual mockup.",
  changes: [
    "Connected players uses PlayerManager.GetPlayerCount() + GetPlayerName(playerId), with empty-slot filtering.",
    "The inspector now separates Engine data / function bindings from Engine callback / action contracts.",
    "Connected-player tables default to a row-selection contract that carries the real playerId into the controller.",
    "The GM base template no longer seeds fake Alpha/Bravo/Charlie player rows; it uses the engine-backed table instead.",
    "Workbench plans now export callbacks alongside runtimeScaffolds with named count/scroll/list widgets and native Button/Text row scaffolds.",
    "Table previews show a truthful runtime-backed design row instead of fake player placeholders.",
    "Native Workbench scaffold output uses supported layout properties and pixel-fixed slots so a 24 px / 360 px panel stays the same at the exported root size.",
    "Connected-player row scaffolds use native Button/Text widgets with vertical padding, and the runtime controller applies the Composer font contract with TextWidget.SetExactFontSize().",
    "Handoff validation now flags static player-name text without a runtime binding instead of allowing fake Alpha/Bravo/Sgt.James rows through silently.",
    "Schema 3 Workbench plans include controllerPath and controllerSource, plus a one-click EnforceScript controller export.",
    "Connected-player scaffolds include a named selection label; generated OnPlayerRowClicked writes SELECTED: <engine name> while retaining the real playerId.",
    "The validation addon compiles the exported controller pattern and uses local InputManager variables, matching the engine's private-destructor contract."
  ]
};
