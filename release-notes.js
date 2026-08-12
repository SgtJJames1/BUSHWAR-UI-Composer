window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.6.1",
  published: "12 August 2026",
  title: "Runtime scaffold targets for bound widgets",
  summary: "Bound tables now export concrete count, scroll, list, and row targets so Workbench implementation can follow the same structure as the Composer design.",
  changes: [
    "Connected players uses PlayerManager.GetPlayerCount() + GetPlayerName(playerId), with empty-slot filtering.",
    "The inspector binding selector carries the contract into project and Workbench-plan exports.",
    "Bound tables now include runtimeScaffolds with named count/scroll/list widgets and a row-layout path.",
    "Table previews show a truthful runtime-backed design row instead of fake player placeholders.",
    "Native Workbench scaffold output uses supported layout properties and anchored slots; finish and verify it in Layout Editor."
  ]
};
