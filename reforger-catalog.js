/*
 * Reforger resource reference catalogue. Entries are identifiers and paths only:
 * no Bohemia Interactive textures or layouts are bundled in this app.
 * Paths are checked against the locally installed Arma Reforger resource index on 2026-08-12.
 * Preview shapes are original Composer approximations; vanilla UI textures/layouts stay in the game.
 */
(() => {
  "use strict";
  const entries = [];
  const nativeClassFor = (name, kind) => {
    if (kind === "Texture atlas") return "ImageWidgetClass";
    const value = name.toLowerCase();
    if (value.includes("button") || value.includes("navigation") || value.includes("paging") || value.includes("checkbox")) return "ButtonWidgetClass";
    if (value.includes("slider") || value.includes("progress")) return "ProgressBarWidgetClass";
    if (value.includes("editbox") || value.includes("input")) return "EditBoxWidgetClass";
    if (value.includes("combo") || value.includes("spinbox")) return "ComboBoxWidgetClass";
    if (value.includes("tab") || value.includes("toolbar")) return "HorizontalLayoutWidgetClass";
    if (value.includes("label") || value.includes("text") || value.includes("heading")) return "TextWidgetClass";
    return "LayoutResource";
  };
  const entryFor = (category, kind, name, path, preview) => ({
    category, kind, name, path, preview,
    // A source-backed .layout is always imported as a LayoutResource. The
    // optional child hint is deliberately separate so a name heuristic can
    // never masquerade as the prefab's authoritative root class.
    nativeWidgetClass: kind === "Layout prefab" ? "LayoutResource" : nativeClassFor(name, kind),
    nativeChildHint: kind === "Layout prefab" ? nativeClassFor(name, kind) : undefined,
    workbenchAction: kind === "Texture atlas" ? "Use as ImageWidget source in Layout Editor" : "Drag this registered layout prefab into the target layout, then preserve its named children"
  });
  const layouts = (category, directory, names, preview = "▣") => names.forEach(name => entries.push(entryFor(category, "Layout prefab", name, `UI/layouts/${directory}/${name}.layout`, preview)));
  const refs = (category, kind, directory, names, preview) => names.forEach(name => entries.push(entryFor(category, kind, name, `${directory}/${name}`, preview)));

  layouts("Widgets · Base", "WidgetLibrary/BaseElements", [
    "WLib_Base", "WLib_Blur", "WLib_CoreMenuBase", "WLib_CoreMenuTabbed", "WLib_DynamicFooter", "WLib_IconText",
    "WLib_Label", "WLib_LabelRichText", "WLib_Label_Small", "WLib_LineHighlight", "WLib_LineHighlight_Center",
    "WLib_MenuBase", "WLib_MenuBaseSimple", "WLib_MenuBaseTabbed", "WLib_ReadabilityBackground", "WLib_SmoothBorderBlur"
  ]);
  layouts("Widgets · Buttons", "WidgetLibrary/Buttons", [
    "WLib_ButtonFilter", "WLib_ButtonImage", "WLib_ButtonMouseInteractText", "WLib_ButtonProfileImage", "WLib_ButtonText",
    "WLib_ButtonTextImage", "WLib_ButtonTextUnderlined", "WLib_InputButton", "WLib_InputButtonDisplay", "WLib_InputButtonIcon",
    "WLib_InputNavigationButton", "WLib_InputNavigationButtonSuperSmall", "WLib_ListButtonEntry", "WLib_ModularButton_Favorite",
    "WLib_ModularButton_Icon", "WLib_ModularButton_Icon_MouseOnly", "WLib_ModularButton_Icon_MouseOnly_Warning",
    "WLib_ModularButton_Text", "WLib_NavigationButton", "WLib_NavigationButtonPaging", "WLib_NavigationButtonSmall",
    "WLib_NavigationButtonSuperSmall", "WLib_PagingButton", "WLib_PagingButtonGallery", "WLib_ViewProfileButton"
  ], "▰");
  layouts("Widgets · Selectors", "WidgetLibrary/ComboBox", [
    "PlayerListComboButton", "WLib_ComboBox", "WLib_ComboBoxElementSmall", "WLib_ComboBoxIcon", "WLib_ComboBoxIcon_TextFirst", "WLib_OpenedComboRoot"
  ], "▾");
  layouts("Widgets · Selectors", "WidgetLibrary/ComboBox/Elements", ["WLib_ComboBoxElement", "WLib_ComboBoxElementIcon", "WLib_ComboBoxElementIcon_TextFirst", "WLib_ComboBoxElementWrap"], "▾");
  layouts("Widgets · Input & control", "WidgetLibrary", [
    "DownloadManagerProgressBar", "WLib_ImagePicker", "WLib_LoadingCircle", "WLib_ProgressBar", "WLib_Separator", "WLib_SeparatorLight", "WLib_Slider"
  ], "◉");
  layouts("Widgets · Input & control", "WidgetLibrary/ToolBoxes", ["WLib_Checkbox", "WLib_Toolbox", "ToolBoxMultiline"], "◉");
  layouts("Widgets · Text input", "WidgetLibrary/EditBox", ["WLib_EditBox", "WLib_EditBoxMultiline", "WLib_EditBoxSearch", "Wlib_EditHint"], "⌨");
  layouts("Widgets · Navigation", "WidgetLibrary/TabView", [
    "WLib_TabViewCoreMenus", "WLib_TabViewElement", "WLib_TabViewErrorIcon", "WLib_TabViewHorizontal", "WLib_TabViewInfoIcon", "WLib_TabViewWarningIcon"
  ], "▤");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/GalleryView", ["WLib_Gallery", "WLib_SelectionHint"], "▦");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/ImageWidgets", ["WLib_ImageGallery", "WLib_ImageGalleryItem"], "▧");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/SortHeader", ["WLib_SortHeader", "WLib_ButtonSort_Image", "WLib_ButtonSort_ImageSingleOrder", "WLib_ButtonSort_ImageText", "WLib_ButtonSort_OrderArrows", "WLib_ButtonSort_Text"], "↕");
  layouts("Widgets · Numeric", "WidgetLibrary/SpinBox", ["WLib_SpinBox", "WLib_SpinBoxPaging", "WLib_SpinBox_Tutorial"], "±");
  layouts("Widgets · Text", "WidgetLibrary/TextWidgets", ["Text_Body", "Text_BodyExtraSmall", "Text_BodySmall", "Text_Heading1", "Text_Heading2", "Text_Heading3", "Text_Heading4", "Text_Heading5", "Text_Interactive", "Text_InteractiveSmall", "Text_WarningMessage"], "T");

  refs("HUD · Game Master & editor", "HUD layout", "UI/layouts/Editor/HUD", ["HudMenuBuildLayout.layout", "HudMenuLayout.layout"], "GM");
  refs("HUD · Game Master & editor", "HUD layout", "UI/layouts/HUD/HUDLayouts", ["HUDManager_Editor.layout", "HUDManager_Root.layout"], "GM");
  refs("HUD · Game Master & editor", "HUD layout", "UI/layouts/HUD/TeleportFeedback", ["HUD_GM_TeleportingFeedback.layout"], "⌖");
  refs("HUD · Game Master & editor", "Menu layout", "UI/layouts/Editor/Toolbar/ModeMenu/GameMaster", ["ModeMenu_GameMaster.layout"], "GM");
  refs("HUD · Core", "HUD layout", "UI/layouts/HUD/CampaignMP", ["CampaignMainHUD.layout"], "HUD");
  refs("HUD · Core", "HUD layout", "UI/layouts/HUD/Chat", ["ChatHud.layout"], "☷");
  refs("HUD · Core", "HUD layout", "UI/layouts/HUD/AvailableActions", ["AvailableActionsLayout.layout", "AvailableActionsSlot.layout"], "⌘");
  refs("HUD · Core", "HUD layout", "UI/layouts/HUD", ["TaskHUDIcon.layout"], "◆");
  refs("HUD · Vehicles & map", "HUD layout", "UI/layouts/HUD/VehicleInfo", ["VehicleHUD_Air.layout", "VehicleHUD_Air_AGL+ASL.layout", "VehicleHUD_default.layout", "VehicleHUD_wheeled.layout"], "▱");
  refs("HUD · Vehicles & map", "Layout", "UI/layouts/Editor/Compass", ["Compass.layout", "CompassSlot.layout"], "N");
  refs("HUD · Vehicles & map", "Layout", "UI/layouts/Map", [
    "Map.layout", "MapCompass.layout", "MapCampaignBasesGraph.layout", "MapColorSelector.layout", "MapColorSelectorEntry.layout", "MapDrawingPalette.layout",
    "MapDrawLine.layout", "MapIconSelectorEntry.layout", "MapMarkerBase.layout", "MapMarkerDynamicBase.layout", "MapMarkerEditBox.layout"
  ], "⌖");
  refs("HUD · Gameplay", "HUD layout", "UI/layouts/HUD/Commanding", ["BasicPing.layout", "CommandPreview.layout", "IssuedCommandLayout.layout"], "⌁");
  refs("HUD · Gameplay", "HUD layout", "UI/layouts/HUD", ["CompositionInfo.layout", "Deathmatch.layout", "FiringRange.layout", "EndScreen.layout"], "HUD");
  refs("HUD · Gameplay", "HUD layout", "UI/layouts/Campaign", ["BuildingHUDIcon.layout"], "⌂");
  refs("HUD · Debug", "Debug HUD layout", "UI/layouts/Debug", ["HUD_Debug_Character.layout", "AccuracyDebugHud.layout"], "DBG");

  refs("Icons · Core", "Texture atlas", "UI/Textures/Icons", ["iconCredits.edds", "iconExit.edds", "iconSettings.edds", "icons_wrapperUI-100_atlas.edds", "icons_wrapperUI-150_atlas.edds", "icons_wrapperUI-200_atlas.edds", "icons_wrapperUI-300_atlas.edds", "icons_wrapperUI-400_atlas.edds"], "◇");
  refs("Icons · Input", "Texture atlas", "UI/Textures/Icons", ["icons_keyboard_32_atlas.edds", "icons_keyboard_48_atlas.edds", "icons_keyboard_64_atlas.edds", "icons_gamepad_32_atlas.edds", "icons_gamepad_48_atlas.edds", "icons_gamepad_64_atlas.edds", "icons_mouse_32_atlas.edds", "icons_mouse_48_atlas.edds", "icons_mouse_64_atlas.edds"], "⌨");
  refs("Icons · Map & markers", "Texture atlas", "UI/Textures/Icons", [
    "icons_mapMarkersUI_atlas.edds", "icons_mapMarkersUI-150_atlas.edds", "icons_mapMarkersUI-200_atlas.edds", "icons_mapMarkersUI-300_atlas.edds", "icons_mapMarkersUI-400_atlas.edds",
    "icons_mapMarkersUI-glow_atlas.edds", "icons_radialWeapons_atlas.edds"
  ], "⌖");

  window.BUSHWAR_REFORGER_CATALOG = {
    label: "Arma Reforger UI reference catalogue",
    checked: "2026-08-12",
    disclaimer: "References only: paths identify vanilla resources for Workbench. This composer does not copy, load, or redistribute Reforger game assets.",
    entries
  };
})();
