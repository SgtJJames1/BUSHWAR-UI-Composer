window.BUSHWAR_COMPOSER_RELEASE = {
  version: "0.5.3",
  published: "12 August 2026",
  title: "Workbench layout scaffold update",
  summary: "Your import plan now includes a native-widget scaffold request that can create a real layout in an isolated Workbench addon before Layout Editor refinement.",
  changes: [
    "Exported Workbench import plans now include a layoutCreateRequest for a native-widget scaffold.",
    "The scaffold path was verified in a disposable addon: Workbench registered it, assigned a GUID, and loaded the layout.",
    "Reforger database layers render as their own UI compositions instead of a generic reference card.",
    "Open and resave every generated scaffold in Layout Editor, then replace source-backed frames with the listed WLib or vanilla layout prefabs."
  ]
};
