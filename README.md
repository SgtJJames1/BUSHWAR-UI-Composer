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
- A Workbench handoff check that flags undersized canvases, unlocked or missing
  visual references, missing Reforger resource paths, and empty projects

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
3. Use **Validate Workbench handoff** and fix any warnings. Then copy the
   specification or use the exported PNG as a visual brief.
4. Recreate the finished UI in Workbench's **Layout Editor** using the listed
   WLib resource paths and test the actual `.layout` with **Live Preview** at
   the resolutions you support. The bundle is a reliable design reference, not
   a runtime UI package.

Vanilla game textures and layouts are not redistributed with this tool. The Reforger database is a metadata-only path catalogue: adding an item makes a visual reference card and preserves its resource path for Workbench; it does not import or embed the vanilla asset. Load screenshots or your own exported assets locally as references. The built-in components and symbols are original approximations.

The bundled GM screenshot is a user-supplied visual reference. Use **Scene →
Vanilla GM** to enable it without removing your layers, **Scene on/off** to
compare the overlay against a blank background, or **Blank canvas** to start
a clean project.
