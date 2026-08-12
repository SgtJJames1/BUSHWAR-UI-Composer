# BUSHWAR UI Composer by Sgt.James

A dependency-free visual prototyping tool for planning BUSHWAR/Arma Reforger interfaces before implementing them in Workbench's Layout Editor.

## Web app

Open the Composer directly in a browser:

**https://sgtjjames1.github.io/BUSHWAR-UI-Composer/**

Share that link in Discord, on a website, or in a workshop description. There
is no installer, download, account, or Smart App Control prompt. Each visit
loads the currently deployed version automatically.

The browser app runs entirely on the user's device. Browser autosave and named
templates stay in that user's browser profile, while exported `.bwui.json` and
`.bwui-template.json` bundles are the shareable/portable files.

## Development and deployment

This is a dependency-free static web app. Open `index.html` locally for a
quick preview, or serve the folder with any static web server. The Pages
workflow publishes the browser runtime files on each push to `main`.

No Windows installer, Electron runtime, update feed, or GitHub Release is a
supported public distribution channel.

### Publishing an update notice

Before publishing a meaningful app update, edit `release-notes.js`: bump its
`version`, set the short title/date/summary, and write the visible change
list. The next time a user opens a newer version, the Composer shows that
release note once, then remembers that they have seen it in their browser.
The **What's new** toolbar button remains available to reopen it.

## Included

- 1920x1080, 1440p, and 4K canvases with fit/percentage zoom
- A multi-image visual-reference board: imported screenshots are locked by
  default, can be toggled or positioned like any layer, and travel inside the
  exported project/template bundle
- Built-in 2048x1152 Vanilla Game Master reference scene from the supplied
  screenshot, independently selectable, hideable, and opacity-adjustable
- Panels, text, buttons, icons, images, player rows, dividers, and badges
- Reusable windows, confirmation dialogs, prompts, notifications, context
  menus, tooltips, tabs, data tables, toolbars, progress bars, input fields,
  toggles, asset cards, squad tiles, slot grids, and category bars
- Drag, resize, grid snapping, keyboard nudging, visibility, locking, ordering, duplicate, delete, undo, and redo
- Named local templates: save the current canvas as a reusable template, reload it later, update it by saving with the same name, or remove it from the template list
- A clear lock toggle in every layer row plus a lock badge beside the selected layer's pixel-bounds label; locked layers cannot be dragged, resized, or nudged
- A searchable, categorized Reforger UI reference database: Widget Library (`WLib`) layout prefabs, HUD/Game Master layouts, and vanilla icon-atlas families, each carrying its exact resource path for Workbench handoff
- A GM admin-panel template using the approved left 24 px / top 15% / width 360 px / bottom 80% bounds
- Portable `.bwui.json` project and `.bwui-template.json` template bundles:
  they embed imported reference images and record a layer/asset manifest so a
  recipient can verify that an import did not lose a reference
- Browser autosave as a convenience cache only; it intentionally does not
  retain very large images, so export a project or template bundle before
  sharing, clearing browser data, or moving to another computer
- PNG preview export
- A copied implementation specification containing both pixel bounds and normalized anchors
- A structured **Workbench import plan** export with target kind, layout path,
  root/widget instructions, resource sources, anchors, and reusable widget
  names. It also carries a `layoutCreateRequest` for a native-widget scaffold
  in the Enfusion `layout_create` tool. Its scaffold slots are pixel-fixed to
  the exported root size, so fixed bounds such as 24 px / 360 px remain
  faithful. Open and resave that scaffold in
  Workbench Layout Editor, then replace source-backed scaffold frames with the
  listed WLib/vanilla layouts; never treat generated text serialization as a
  finished production layout.
- A one-click **Copy layout scaffold request** helper for handing that native
  scaffold request to a Workbench/Codex import task; always target a disposable
  addon first, then inspect and resave the result in Layout Editor.
- A Workbench handoff check that flags undersized canvases, unlocked or missing
  visual references, missing Reforger resource paths, and empty projects
- Engine binding contracts for runtime-backed compositions. The first live
  contract is Connected players (engine): it maps to
  PlayerManager.GetPlayerCount() + GetPlayerName(playerId), filters empty
  slots, and exports the contract in the project and Workbench-plan JSON.
- A bound connected-player table also exports a runtime scaffold request with
  named count/scroll/list widgets and a row-layout path, so the generated
  Enfusion controller has concrete widget targets instead of a visual-only
  guess. The plan also includes a native Button/Text row scaffold with valid
  parent-inferred slots.
- An explicit callback catalogue lets each supported widget declare the
  Enfusion event/API or controller contract it needs. Connected-player tables
  default to a row-selection contract that carries the real `playerId`; the
  plan exports callbacks separately from data bindings so visual design and
  runtime behavior cannot be confused.

## Workbench boundary

This is a design/prototyping tool, not a replacement for the Reforger Layout Editor. The copied design specification is intended as a precise implementation handoff. Build the final `.layout` with Workbench-owned widget-library assets and verify it through Layout Editor Live Preview at the supported aspect ratios. Workbench documents a minimum 1920×1080 root size; the composer warns when a canvas is smaller.

### Reliable Reforger workflow

1. Import screenshots, notes, and mockups with **Add to reference board**.
   These are full-canvas, locked reference layers rather than a temporary
   background, so they can be safely kept alongside a design.
2. Use **Save project** for the authoritative `.bwui.json` working file, or
   **Export current** in Templates for a reusable `.bwui-template.json`.
   Both formats embed your local reference images; recipients do not need the
   original image files. On open, the composer verifies the saved layer/asset
   manifest and calls out a mismatch.
3. For data-backed widgets, assign an **Engine data / function** binding in the
   inspector. The browser preview is deliberately truthful: it shows the
   runtime contract rather than inventing fake player rows.
4. Assign an **Engine callback / action** in the inspector when the widget must
   do something. For a connected-player table, keep `player.list.connected`
   paired with `player.row.select`; the exported controller must carry the
   engine player ID alongside each row instead of inferring identity from row
   order or display text.
5. Use **Validate Workbench handoff** and fix any warnings. Then copy the
   specification or use the exported PNG as a visual brief.
6. If your addon includes the optional BUSHWAR validation plug-in, run
   **BUSHWAR UI Composer → Review import plan**. It accepts schema 2 plans and
   confirms the binding/callback contract before authoring.
7. Recreate the finished UI in Workbench's **Layout Editor** using the listed
   WLib resource paths and test the actual `.layout` with **Live Preview** at
   the resolutions you support. The bundle is a reliable design reference, not
   a runtime UI package.

Vanilla game textures and layouts are not redistributed with this tool. The Reforger database is a metadata-only path catalogue: adding an item makes a visual reference card and preserves its resource path for Workbench; it does not import or embed the vanilla asset. Load screenshots or your own exported assets locally as references. The built-in components and symbols are original approximations.

The bundled GM screenshot is a user-supplied visual reference. Use **Scene →
Vanilla GM** to enable it without removing your layers, **Scene on/off** to
compare the overlay against a blank background, or **Blank canvas** to start
a clean project.
