# BUSHWAR UI Composer roadmap

## Distribution — web-only

- The hosted browser app is the only public distribution channel.
- Share one URL; visitors always load the current deployment with no install
  or Smart App Control prompt.
- Exported project/template bundles are the portable file format.

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

- Deploy previews and a concise web-app changelog
- Crash reporting and opt-in diagnostics with no project content uploaded
- Public documentation, sample projects, and plugin/component SDK
