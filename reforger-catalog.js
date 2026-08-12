/*
 * Reforger resource reference catalogue. Entries are identifiers and paths only:
 * no Bohemia Interactive textures or layouts are bundled in this app.
 * Source checked against the installed Arma Reforger resource index on 2026-08-12.
 */
(() => {
  "use strict";
  const entries = [];
  const layouts = (category, directory, names, preview = "▣") => names.forEach(name => entries.push({
    category, kind: "Layout prefab", name, path: `UI/layouts/${directory}/${name}.layout`, preview
  }));
  const refs = (category, kind, directory, names, preview) => names.forEach(name => entries.push({
    category, kind, name, path: `${directory}/${name}`, preview
  }));

  layouts("Widgets · Base", "WidgetLibrary/BaseElements", [
    "WLib_Base", "WLib_Blur", "WLib_CoreMenuBase", "WLib_CoreMenuTabbed", "WLib_DynamicFooter", "WLib_IconText",
    "WLib_Label", "WLib_LabelRichText", "WLib_Label_Small", "WLib_LineHighlight", "WLib_LineHighlight_Center",
    "WLib_MenuBase", "WLib_MenuBaseSimple", "WLib_MenuBaseTabbed", "WLib_ReadabilityBackground", "WLib_SmoothBorderBlur"
  ]);
  layouts("Widgets · Buttons", "WidgetLibrary/Buttons", [
    "WLib_ButtonFilter", "WLib_ButtonImage", "WLib_ButtonMouseInteractText", "WLib_ButtonProfileImage", "WLib_ButtonText",
    "WLib_ButtonTextImage", "WLib_ButtonTextUnderlined", "WLib_InputButton", "WLib_InputButtonDisplay", "WLib_InputButtonIcon",
    "WLib_InputNavigationButton", "WLib_InputNavigationButton_SuperSmall", "WLib_ListButtonEntry", "WLib_ModularButton_Favorite",
    "WLib_ModularButton_Icon", "WLib_ModularButton_Icon_MouseOnly", "WLib_ModularButton_Icon_MouseOnly_Warning",
    "WLib_ModularButton_Text", "WLib_NavigationButton", "WLib_NavigationButton_Paging", "WLib_NavigationButton_Small",
    "WLib_NavigationButton_SuperSmall", "WLib_PagingButton", "WLib_PagingButton_Gallery", "WLib_ViewProfileButton"
  ], "▰");
  layouts("Widgets · Selectors", "WidgetLibrary/ComboBoxes", [
    "WLib_ComboBox", "WLib_ComboBoxElement", "WLib_ComboBoxElement_Icon", "WLib_ComboBoxElement_Icon_TextFirst",
    "WLib_ComboBoxElement_Wrap", "WLib_ComboBoxElementSmall", "WLib_ComboBoxIcon", "WLib_ComboBoxIcon_TextFirst", "WLib_OpenedComboRoot"
  ], "▾");
  layouts("Widgets · Input & control", "WidgetLibrary/Controls", [
    "WLib_Checkbox", "WLib_ImagePicker", "WLib_LoadingCircle", "WLib_ProgressBar", "WLib_Separator", "WLib_SeparatorLight", "WLib_Slider", "WLib_Toolbox"
  ], "◉");
  layouts("Widgets · Text input", "WidgetLibrary/EditBoxes", ["WLib_EditBox", "WLib_EditBoxMultiline", "WLib_EditBoxSearch", "Wlib_EditHint"], "⌨");
  layouts("Widgets · Navigation", "WidgetLibrary/Tabs", [
    "WLib_TabViewCoreMenus", "WLib_TabViewElement", "WLib_TabViewErrorIcon", "WLib_TabViewHorizontal", "WLib_TabViewInfoIcon", "WLib_TabViewWarningIcon"
  ], "▤");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/Gallery", ["WLib_Gallery", "WLib_SelectionHint"], "▦");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/ImageGallery", ["WLib_ImageGallery", "WLib_ImageGalleryItem"], "▧");
  layouts("Widgets · Gallery & lists", "WidgetLibrary/Sorting", ["WLib_SortHeader", "WLib_SortHeaderAscending", "WLib_SortHeaderDescending"], "↕");
  layouts("Widgets · Numeric", "WidgetLibrary/SpinBoxes", ["WLib_SpinBox", "WLib_SpinBoxPaging", "WLib_SpinBoxTutorial"], "±");
  layouts("Widgets · Extensions", "WidgetLibrary/Extensions", [
    "WLib_AddNewButton", "WLib_FilterRibbon", "WLib_FilterRibbonButton", "WLib_FilterRibbonIcon", "WLib_PooledList", "WLib_PooledListEntry"
  ], "+");

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

  refs("Icons · Core", "Texture atlas", "UI/Textures/Icons", ["iconCredits.edds", "iconExit.edds", "iconSettings.edds", "icons_wrapperUI.edds", "icons_wrapperUI_150.edds", "icons_wrapperUI_200.edds", "icons_wrapperUI_300.edds", "icons_wrapperUI_400.edds"], "◇");
  refs("Icons · Input", "Texture atlas", "UI/Textures/Icons/icons_keyboard", ["icons_keyboard.edds", "icons_keyboard_150.edds", "icons_keyboard_200.edds", "icons_keyboard_300.edds", "icons_keyboard_400.edds"], "⌨");
  refs("Icons · Input", "Texture atlas", "UI/Textures/Icons/icons_gamepad", ["icons_gamepad.edds", "icons_gamepad_150.edds", "icons_gamepad_200.edds", "icons_gamepad_300.edds", "icons_gamepad_400.edds"], "▱");
  refs("Icons · Input", "Texture atlas", "UI/Textures/Icons/icons_mouse", ["icons_mouse.edds", "icons_mouse_150.edds", "icons_mouse_200.edds", "icons_mouse_300.edds", "icons_mouse_400.edds"], "◌");
  refs("Icons · Map & markers", "Texture atlas", "UI/Textures/Icons", [
    "icons_mapMarkersUI_atlas.edds", "icons_mapMarkersUI_atlas_150.edds", "icons_mapMarkersUI_atlas_200.edds", "icons_mapMarkersUI_atlas_300.edds", "icons_mapMarkersUI_atlas_400.edds",
    "icons_mapMarkersUI_glow_atlas.edds", "icons_mapMarkersUI_drawing_atlas.edds", "icons_radialWeaponsUI_atlas.edds"
  ], "⌖");

  window.BUSHWAR_REFORGER_CATALOG = {
    label: "Arma Reforger UI reference catalogue",
    checked: "2026-08-12",
    disclaimer: "References only: paths identify vanilla resources for Workbench. This composer does not copy, load, or redistribute Reforger game assets.",
    entries
  };
})();
