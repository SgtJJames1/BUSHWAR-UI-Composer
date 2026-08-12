window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.7.0",
  published: "12 August 2026",
  title: "Engine callback contracts for interactive widgets",
  summary: "Data bindings and runtime callbacks are now separate, explicit contracts so a designed widget can declare what the game engine should read and what the generated controller should do.",
  changes: [
    "Connected players uses PlayerManager.GetPlayerCount() + GetPlayerName(playerId), with empty-slot filtering.",
    "The inspector now separates Engine data / function bindings from Engine callback / action contracts.",
    "Connected-player tables default to a row-selection contract that carries the real playerId into the controller.",
    "The GM base template no longer seeds fake Alpha/Bravo/Charlie player rows; it uses the engine-backed table instead.",
    "Workbench plans now export callbacks alongside runtimeScaffolds with named count/scroll/list widgets and native Button/Text row scaffolds.",
    "Table previews show a truthful runtime-backed design row instead of fake player placeholders.",
    "Native Workbench scaffold output uses supported layout properties and anchored slots; finish and verify it in Layout Editor."
  ]
};
