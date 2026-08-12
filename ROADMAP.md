# BUSHWAR UI Composer roadmap

## 0.2 desktop foundation — complete

- Branded Electron desktop shell for Windows
- Portable x64 executable and MSI installer
- Reproducible dependency lockfile and local build commands
- Renderer sandbox, context isolation, disabled Node integration, restrictive
  content-security policy, single-instance behavior, and blocked in-app
  navigation
- Shared editor code between browser and desktop editions

## Next editor milestone

- Multi-select, alignment, distribution, grouping, and reusable components
- Proper resize handles on all edges/corners, rotation, rulers, guides, and
  configurable snapping
- Named projects, recent-project list, save-as, backups, and recovery
- Nested hierarchy and container-aware layout behavior
- Editable composite internals instead of single grouped mockup layers
- Theme/style tokens and reusable typography/color presets

## Reforger integration milestone

- Export an implementation manifest that maps visual layers to Enfusion
  widgets, anchors, offsets, styles, and named resources
- Workbench-side importer/validator that creates a draft layout without
  replacing existing GUIDs or treating generated output as production-ready
- Vanilla widget-library catalog with locally resolved resource references;
  do not redistribute packaged game textures
- Aspect-ratio and DPI test matrix matching Workbench Layout Editor Live
  Preview

## Distribution milestone

- Trusted Windows code-signing certificate
- Versioned release channel, changelog, installer upgrade testing, and
  optional signed auto-update feed
- Crash reporting and opt-in diagnostics with no project content uploaded
- Public documentation, sample projects, and plugin/component SDK
