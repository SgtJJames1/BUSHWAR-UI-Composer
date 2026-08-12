window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.6.0",
  published: "12 August 2026",
  title: "Runtime binding contracts for Reforger UI",
  summary: "The Composer now describes a live connected-player list without inventing placeholder rows and exports the engine contract for Workbench implementation.",
  changes: [
    "Added PlayerManager.GetPlayerCount() + GetPlayerName(playerId), with empty-slot filtering.",
    "The Connected players (engine) component and inspector binding selector carry the contract into project and Workbench-plan exports.",
    "Table previews now show a truthful runtime-backed design row instead of fake player placeholders.",
    "Native Workbench scaffold output uses supported layout properties and anchored slots; finish and verify it in Layout Editor."
  ]
};
