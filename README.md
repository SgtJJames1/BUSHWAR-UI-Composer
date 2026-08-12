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

Run `npm test` from the Composer folder before publishing. The dependency-free
generator smoke test checks that connected-player rows, the real `player.count`
binding, and the live refresh callback remain present and that the API
metadata's `out` label is not accidentally emitted into EnforceScript source.

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
- A searchable, categorized Reforger UI reference database: Widget Library (`WLib`) layout prefabs, HUD/Game Master layouts, and vanilla icon-atlas families, each carrying its exact resource path, native widget-class hint, and Workbench action for the handoff
- An optional Workbench engine-context import (`bushwar-ui-composer-engine-context`, schema 1) for previewing a captured connected-player roster. Imported names/IDs are evidence for the browser preview only; generated controllers always re-query `PlayerManager` in Reforger.
- The same context contract can carry the local GM editor state (`editorOpen`); scalar bindings display that captured value or an explicit unknown-state label instead of guessing.
- Connected player count is available as a PlayerManager-backed scalar binding,
  and the callback catalogue includes **Refresh live engine values** for a
  designed refresh control. That route re-queries the game session in memory;
  it does not make the browser snapshot authoritative or write player data to a
  file.
- Connected-player previews are runtime-shaped rather than mock tables: they show only imported non-empty players, expose the count and selected-name fields used by the native scaffold, and carry the clicked row's real `playerId` through the preview contract. With no context loaded, the preview intentionally renders zero player rows.
- A GM admin-panel template using the approved left 24 px / top 15% / width 360 px / bottom 80% bounds
- The GM admin-panel template starts with a real connected-player table,
  PlayerManager-backed count badge, row-selection callback, and Refresh live
  values button so new projects demonstrate the runtime workflow immediately.
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
  in the Enfusion `layout_create` tool. Its scaffold slots use
  `PositionX`/`PositionY`/`SizeX`/`SizeY` with point anchors, matching the
  shipped BUSHWAR GM layouts so fixed bounds such as 24 px / 360 px do not
  collapse to the origin when Workbench reserializes a point anchor. Palette
  elements map to native Button/Text/Image/ProgressBar/
  EditBox/CheckBox/layout-container classes instead of every element collapsing
  to a generic Frame. Open and resave that scaffold in
  Workbench Layout Editor, then replace source-backed scaffold frames with the
  listed WLib/vanilla layouts; set the Layout Editor root to the exported
  Composer canvas size before judging pixel bounds, and never treat generated
  text serialization as a finished production layout.
- A **complete Workbench handoff** export that packages the `.bwui` design,
  schema-3 import plan, controller source, engine-context provenance, and the
  exact next-step instructions into one transferable JSON file.
- A schema 3 **EnforceScript controller scaffold** in every Workbench plan, plus
  a separate **Export EnforceScript controller scaffold** download. When a
  connected-player binding is present, the source reads `PlayerManager`, skips
  empty IDs, creates one native row per real player, carries the actual
  `playerId`, and updates a named `SELECTED:` label on row selection. It is
  intentionally reviewable source, not an automatically trusted or privileged
  mod.
- Schema 3 also records `nativeProfileSchema` and the native widget classes used
  by the scaffold. The disposable validation plug-in rejects a plan that omits
  this mapping, preventing an apparently valid visual handoff from silently
  becoming a generic Frame-only layout.
- Runtime-backed widgets also carry `runtimeContract` metadata: engine source
  methods, authority, refresh events, row identity, and callback implementation
  status. Server-authoritative actions export reviewable hooks; the browser never
  pretends to execute a server RPC.
- A one-click **Copy layout scaffold request** helper for handing that native
  scaffold request to a Workbench/Codex import task; always target a disposable
  addon first, then inspect and resave the result in Layout Editor.
- A Workbench handoff check that flags undersized canvases, unlocked or missing
  visual references, missing Reforger resource paths, and empty projects
- The handoff check includes a per-layer runtime contract audit: it shows the
  exported native widget/child target, engine source methods, callback,
  authority boundary, and whether the generated route is READY, REVIEW, or
  ERROR. Hidden runtime-bound layers are called out because they are omitted
  from the Workbench export.
- Preview mode exercises safe assigned callbacks locally (for example refresh
  and layout open/close) and labels server/editor actions as review-only; it
  never claims that a browser click changed Reforger state.
- Engine binding contracts for runtime-backed compositions. The first live
  contract is Connected players (engine): it maps to
  PlayerManager.GetPlayers(playerIds) + GetPlayerName(playerId), filters
  empty names, and exports the contract in the project and Workbench-plan JSON.
  The API metadata labels `playerIds` as an out parameter; the EnforceScript
  call itself must omit the `out` keyword.
- Scalar bindings are target-filtered: Player display name is valid on text,
  badge, or player widgets, connected player count is valid on text or badge,
  and GM editor state is valid on text or badge widgets. The generated
  controller re-queries the engine when the layout opens; the browser snapshot
  is never runtime authority. On a Player-row Button, the generated binding
  targets that row's named `Text` child rather than casting the Button root.
- A bound connected-player table also exports a runtime scaffold request with
  named count/scroll/list widgets and a row-layout path, so the generated
  Enfusion controller has concrete widget targets instead of a visual-only
  guess. The generated controller reads the engine's authoritative ID array,
  carries each real playerId beside its row, and uses a throttled OnUpdate
  signature check for join/leave/name changes. The plan also includes a native
  Button/Text row scaffold with valid parent-inferred slots.
- An explicit callback catalogue lets each supported widget declare the
  Enfusion event/API or controller contract it needs. Connected-player tables
  default to a row-selection contract that carries the real `playerId`; the
  plan exports callbacks separately from data bindings so visual design and
  runtime behavior cannot be confused. Unknown or server-authoritative actions
  export a review hook and are called out by validation; they are never treated
  as already implemented. Generated callback routes walk parent widgets so
  nested WLib controls still reach the assigned route.

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
4. If you have a captured Workbench context JSON, use **Import Workbench
   context** to preview the actual roster from that session. Treat it as a
   timestamped preview only; the generated controller must query the engine
   again when the layout opens.
5. Assign an **Engine callback / action** in the inspector when the widget must
   do something. For a connected-player table, keep `player.list.connected`
   paired with `player.row.select`; the exported controller must carry the
   engine player ID alongside each row instead of inferring identity from row
   order or display text.
6. Use **Validate Workbench handoff** and fix any warnings. Then copy the
   specification or use the exported PNG as a visual brief.
7. If your addon includes the optional BUSHWAR validation plug-in, run
   **BUSHWAR UI Composer → Review import plan**. It accepts schema 3 plans,
   checks that the controller path/source is present, and confirms the
   binding/callback contract before authoring. Copy the controller source into
   the exported `controllerPath`, then compile it in the disposable addon
   before wiring it to a production menu.
 8. Recreate the finished UI in Workbench's **Layout Editor** using the listed
   WLib resource paths and test the actual `.layout` with **Live Preview** at
   the resolutions you support. The bundle is a reliable design reference, not
   a runtime UI package.

Vanilla game textures and layouts are not redistributed with this tool. The Reforger database is a metadata-only path catalogue: adding an item makes a visual reference card and preserves its resource path for Workbench; it does not import or embed the vanilla asset. Load screenshots or your own exported assets locally as references. The built-in components and symbols are original approximations.

The bundled GM screenshot is a user-supplied visual reference. Use **Scene →
Vanilla GM** to enable it without removing your layers, **Scene on/off** to
compare the overlay against a blank background, or **Blank canvas** to start
a clean project.
