/*
 * Proven Reforger layout recipes.
 *
 * These names and child contracts mirror the engine's Layout Recipe blueprints.
 * They are metadata only: Workbench still creates/registers the final layout,
 * while the Composer uses the same tree for a truthful browser preview and a
 * generated handoff plan.
 */
(() => {
  "use strict";

  const recipes = [
    {
      id: "gm-connected-players",
      label: "GM connected players",
      category: "Game Master",
      description: "A left-side GM panel backed by PlayerManager; empty IDs/names never become rows.",
      template: "gm-admin",
      bindings: ["player.list.connected", "player.count"],
      callbacks: ["player.row.select", "engine.context.refresh"],
      nativeTree: "Frame > Panel > Text + Text + ScrollLayout > VerticalLayout > Button Row > Text NameText",
      requiredChildren: { count: "m_wConnectedPlayersEngineCount", selection: "m_wConnectedPlayersEngineSelection", scroll: "m_wConnectedPlayersEngineScroll", list: "m_wConnectedPlayersEngineList", rowRoot: "Row", rowName: "NameText" },
      workbenchRecipe: "custom"
    },
    {
      id: "info-panel",
      label: "Info panel (native recipe)",
      category: "HUD",
      description: "Bottom-left translucent panel with a title and two live-updatable text lines.",
      workbenchRecipe: "info_panel",
      nativeTree: "Frame > Panel > Image Background + Text Title + Text Line1 + Text Line2",
      requiredChildren: { panel: "Panel", background: "Background", title: "Title", line1: "Line1", line2: "Line2" },
      callbacks: ["ui.widget.update"],
      layers: [
        { type: "panel", name: "Panel", x: 20, y: 870, w: 420, h: 150, fill: "#10191d", opacity: 0.92 },
        { type: "text", name: "Title", x: 30, y: 884, w: 400, h: 28, text: "BUSHWAR", fontSize: 18 },
        { type: "text", name: "Line1", x: 30, y: 914, w: 400, h: 24, text: "CONNECTED", fontSize: 14 },
        { type: "text", name: "Line2", x: 30, y: 940, w: 400, h: 24, text: "READY", fontSize: 14 }
      ]
    },
    {
      id: "status-hud",
      label: "Status HUD (native recipe)",
      category: "HUD",
      description: "Top-center status line updated through a named StatusText TextWidget.",
      workbenchRecipe: "status_hud",
      nativeTree: "Frame > Text StatusText",
      requiredChildren: { status: "StatusText" },
      callbacks: ["ui.widget.update"],
      layers: [
        { type: "text", name: "StatusText", x: 700, y: 48, w: 520, h: 42, text: "GM READY", fontSize: 24, binding: "editor.gm.open", functionId: "engine.context.refresh" }
      ]
    },
    {
      id: "progress-hud",
      label: "Progress HUD (native recipe)",
      category: "HUD",
      description: "Bottom-center objective label plus a native ProgressBar widget.",
      workbenchRecipe: "progress_hud",
      nativeTree: "Frame > VerticalLayout ObjectiveStack > RichText ObjectiveLabel + ProgressBar Progress",
      requiredChildren: { stack: "ObjectiveStack", label: "ObjectiveLabel", progress: "Progress" },
      callbacks: ["ui.widget.update"],
      layers: [
        { type: "text", name: "ObjectiveLabel", x: 760, y: 910, w: 400, h: 28, text: "OBJECTIVE", fontSize: 22 },
        { type: "progress", name: "Progress", x: 760, y: 942, w: 400, h: 22, text: "OBJECTIVE", fontSize: 14, accent: "#f47b36" }
      ]
    },
    {
      id: "timer-hud",
      label: "Timer HUD (native recipe)",
      category: "HUD",
      description: "Centered label and countdown text with stable named children for controller updates.",
      workbenchRecipe: "timer_hud",
      nativeTree: "Frame > VerticalLayout TimerStack > Text TimerLabel + Text TimerValue",
      requiredChildren: { stack: "TimerStack", label: "TimerLabel", value: "TimerValue" },
      callbacks: ["ui.widget.update"],
      layers: [
        { type: "text", name: "TimerLabel", x: 820, y: 490, w: 280, h: 28, text: "STARTING", fontSize: 16 },
        { type: "text", name: "TimerValue", x: 780, y: 520, w: 360, h: 58, text: "00:30", fontSize: 36 }
      ]
    },
    {
      id: "icon-overlay",
      label: "Icon overlay (native recipe)",
      category: "HUD",
      description: "A screen-edge ImageWidget overlay, initially hidden and toggled by the controller.",
      workbenchRecipe: "icon_overlay",
      nativeTree: "Frame > Image Icon",
      requiredChildren: { icon: "Icon" },
      callbacks: ["ui.widget.update"],
      layers: [
        { type: "icon", name: "Icon", x: 1780, y: 480, w: 64, h: 64, text: "", opacity: 0 }
      ]
    }
  ];

  window.BUSHWAR_REFORGER_RECIPES = {
    schema: 1,
    checked: "2026-08-13",
    disclaimer: "Recipe metadata mirrors proven Reforger layout blueprints. Workbench Layout Editor remains authoritative for final widget serialization and prefab source.",
    entries: recipes,
    byId(id) { return recipes.find(recipe => recipe.id === id) || null; }
  };
})();
