# BUSHWAR UI Composer by Sgt.James

A dependency-free visual prototyping tool for planning BUSHWAR/Arma Reforger interfaces before implementing them in Workbench's Layout Editor.

## Windows desktop app

The desktop edition is now the preferred way to run the composer:

- Installer: `release/BUSHWAR-UI-Composer-Setup-0.5.0.exe`
- Portable: `release/BUSHWAR-UI-Composer-Portable-0.5.0.exe`

The NSIS setup executable creates a conventional per-user Windows
installation. From v0.4 onward, installed copies automatically check the
project's public `SgtJJames1/BUSHWAR-UI-Composer` GitHub Releases page, download a newer release, and offer a
restart to install it. The portable executable runs directly without
installation and is intentionally updated manually.

The preferred no-install route is the GitHub Pages web edition. Once Pages is
enabled for the public Composer repository, visitors open the site URL and
always use the current version—there is no Windows installer or Smart App
Control check. Local development artifacts are ignored by Git and can be
rebuilt from the checked-in source and lockfile.

The v0.3 MSI has no updater, so anyone already using it must manually install
v0.4 once (and uninstall the old MSI entry if Windows leaves it listed). Every
subsequent NSIS release can update in place without downloading an installer
by hand.

> GitHub Releases provide free hosting and automatic in-app updates, but they
> do not make an unsigned Windows EXE trusted by Smart App Control. Use the
> GitHub Pages edition when you want users to avoid that Windows prompt.

These first local artifacts are not certificate-signed, so Windows may show
an unknown-publisher warning. Production distribution should add a trusted
code-signing certificate before public release.

## Browser version

Double-click `index.html`, or serve this folder with any static web server. No installation or build step is required.

## Development

    pnpm install
    pnpm start
    pnpm run dist

`pnpm run dist` creates the x64 NSIS setup executable, its `latest.yml` update
manifest, and the portable executable in `release/`. For a production release,
increase `version` in `package.json`, build, then publish the NSIS setup EXE
and `latest.yml` to the matching GitHub Release. With a securely stored
`GH_TOKEN`, `pnpm run publish` uploads both automatically. Never put that token
in source control or the desktop app.

### Release checklist

1. Change the semantic version in `package.json` (for example `0.5.0` to
   `0.5.1`) and run `pnpm run dist`.
2. Create a **public, non-draft GitHub Release** in `SgtJJames1/BUSHWAR-UI-Composer` with
   a matching tag such as `v0.5.0`.
3. Upload `BUSHWAR-UI-Composer-Setup-<version>.exe` and `latest.yml` from
   `release/`. Upload the matching `.blockmap` too when present; it allows
   efficient downloads. The portable EXE can be attached for manual users but
   is not an automatic-update payload.
4. Publish the release. Existing installed NSIS copies will discover it at
   their next launch, download it, and ask to restart.

### GitHub Pages web edition

The repository includes a Pages workflow that publishes only the browser app
runtime files, not the Electron dependency folders or release executables.
After pushing this repository, enable **Settings → Pages → Source: GitHub
Actions**. The site will be available at:

`https://sgtjames1.github.io/BUSHWAR-UI-Composer/`

Every push to `main` republishes the web edition. Browser autosave and saved
templates remain local to each user's browser profile.

Electron is used as a security-isolated shell with Node
integration disabled, context isolation and renderer sandboxing enabled, and
developer tools disabled in packaged builds.

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
- Automatic updates for installed NSIS builds via GitHub Releases, with an
  explicit restart prompt once an update has downloaded

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
