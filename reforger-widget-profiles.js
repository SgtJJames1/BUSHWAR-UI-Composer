/*
 * Native Reforger widget profiles used by the Composer handoff.
 *
 * These profiles are deliberately small and source-backed: they describe the
 * engine widget class/scaffold the Composer can request. They do not bundle
 * Bohemia assets or pretend that a browser preview is a runtime layout.
 */
(() => {
  "use strict";

  const profiles = {
    panel: { label: "Frame panel", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_MenuBase" },
    text: { label: "Text widget", layoutType: "Text", runtimeClass: "TextWidgetClass" },
    button: { label: "Button widget", layoutType: "Button", runtimeClass: "ButtonWidgetClass", sourceRecommended: "WLib_ButtonText" },
    icon: { label: "Image widget", layoutType: "Image", runtimeClass: "ImageWidgetClass", sourceRecommended: "WLib_IconText" },
    image: { label: "Image widget", layoutType: "Image", runtimeClass: "ImageWidgetClass" },
    player: { label: "Player row button", layoutType: "Button", runtimeClass: "ButtonWidgetClass", sourceRecommended: "WLib_ListButtonEntry", bindingHint: "player.list.connected" },
    divider: { label: "Frame divider", layoutType: "Frame", runtimeClass: "FrameWidgetClass" },
    badge: { label: "Text badge", layoutType: "Text", runtimeClass: "TextWidgetClass" },
    window: { label: "Frame window", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_MenuBase" },
    dialog: { label: "Frame dialog", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_CoreMenuBase" },
    prompt: { label: "Frame prompt", layoutType: "Frame", runtimeClass: "FrameWidgetClass" },
    toast: { label: "Frame notification", layoutType: "Frame", runtimeClass: "FrameWidgetClass" },
    context: { label: "Frame context menu", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_MenuBaseSimple" },
    tooltip: { label: "Frame tooltip", layoutType: "Frame", runtimeClass: "FrameWidgetClass" },
    tabs: { label: "Horizontal tab layout", layoutType: "HorizontalLayout", runtimeClass: "HorizontalLayoutWidgetClass", sourceRecommended: "WLib_TabViewHorizontal" },
    table: { label: "Frame + scroll/list scaffold", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_Gallery", bindingHint: "player.list.connected" },
    toolbar: { label: "Horizontal toolbar layout", layoutType: "HorizontalLayout", runtimeClass: "HorizontalLayoutWidgetClass" },
    progress: { label: "Progress bar widget", layoutType: "ProgressBar", runtimeClass: "ProgressBarWidgetClass", sourceRecommended: "WLib_ProgressBar" },
    input: { label: "Edit box widget", layoutType: "EditBoxWidgetClass", runtimeClass: "EditBoxWidgetClass", sourceRecommended: "WLib_EditBox" },
    toggle: { label: "Check box widget", layoutType: "CheckBoxWidgetClass", runtimeClass: "CheckBoxWidgetClass", sourceRecommended: "WLib_Checkbox" },
    assetcard: { label: "Frame asset card", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_GalleryItem" },
    squadtile: { label: "Frame squad tile", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_ListButtonEntry" },
    inventory: { label: "Frame slot grid", layoutType: "Frame", runtimeClass: "FrameWidgetClass", sourceRecommended: "WLib_Gallery" },
    categorybar: { label: "Horizontal category layout", layoutType: "HorizontalLayout", runtimeClass: "HorizontalLayoutWidgetClass" },
    reforger: { label: "Source-backed Reforger layout", layoutType: "Frame", runtimeClass: "LayoutResource", sourceMode: "layout-prefab" }
  };

  window.BUSHWAR_REFORGER_WIDGET_PROFILES = {
    schema: 1,
    checked: "2026-08-12",
    disclaimer: "Native classes are handoff metadata. Workbench Layout Editor remains authoritative for prefab source, widget GUIDs, and final serialization.",
    entries: profiles,
    forType(type) { return profiles[type] || profiles.panel; }
  };
})();
