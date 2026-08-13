(() => {
  "use strict";

  const storageKey = "bushwar-ui-composer-by-sgt-james";
  const legacyStorageKey = "bushwar-ui-composer";
  const previousSessionStorageKey = "bushwar-ui-composer-previous-session-v1";
  const templatesStorageKey = "bushwar-ui-composer-user-templates-v1";
  const updateSeenStorageKey = "bushwar-ui-composer-last-seen-release";
  const release = window.BUSHWAR_COMPOSER_RELEASE || { version: "0.5.1", published: "", title: "Latest improvements", summary: "", changes: [] };
  const APP_VERSION = release.version;
  const bundleFormat = "bushwar-ui-composer";
  const bundleSchema = 6;
  const engineContextFormat = "bushwar-ui-composer-engine-context";
  const workbenchPlanFormat = "bushwar-ui-composer-workbench-plan";
  const workbenchPlanSchema = 3;
  const workbenchBundleFormat = "bushwar-ui-composer-workbench-bundle";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const uid = () => `layer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const clone = value => JSON.parse(JSON.stringify(value));
  const defaults = {
    panel: { name: "Panel", x: 120, y: 140, w: 420, h: 520, text: "", fill: "#11191d", color: "#ffffff", borderColor: "#38464d", accent: "#f47b36", fontSize: 24, radius: 2 },
    text: { name: "Text", x: 160, y: 170, w: 300, h: 52, text: "SECTION TITLE", fill: "#000000", color: "#ffffff", borderColor: "#000000", accent: "#f47b36", fontSize: 26, radius: 0 },
    button: { name: "Button", x: 160, y: 240, w: 190, h: 52, text: "ACTION", fill: "#303a3f", color: "#ffffff", borderColor: "#f47b36", accent: "#f47b36", fontSize: 19, radius: 2 },
    icon: { name: "Icon", x: 160, y: 320, w: 64, h: 64, text: "", fill: "#152128", color: "#eaf7fb", borderColor: "#53636a", accent: "#17bfe9", fontSize: 18, radius: 3 },
    image: { name: "Image", x: 160, y: 410, w: 260, h: 150, text: "", fill: "#1a252a", color: "#ffffff", borderColor: "#43525a", accent: "#f47b36", fontSize: 18, radius: 2 },
    player: { name: "Player row", x: 160, y: 590, w: 560, h: 60, text: "PLAYER NAME FROM ENGINE", fill: "#202a2f", color: "#ffffff", borderColor: "#39474d", accent: "#f47b36", fontSize: 19, radius: 1 },
    divider: { name: "Divider", x: 160, y: 680, w: 420, h: 3, text: "", fill: "#f47b36", color: "#ffffff", borderColor: "#f47b36", accent: "#f47b36", fontSize: 12, radius: 0 },
    badge: { name: "Badge", x: 160, y: 720, w: 130, h: 38, text: "GAME MASTER", fill: "#f47b36", color: "#131a1d", borderColor: "#f47b36", accent: "#f47b36", fontSize: 15, radius: 19 },
    window: { name: "Window", x: 620, y: 130, w: 460, h: 360, text: "ENTITY BROWSER", fill: "#11191d", color: "#ffffff", borderColor: "#435058", accent: "#f47b36", fontSize: 20, radius: 2 },
    dialog: { name: "Confirm dialog", x: 650, y: 270, w: 480, h: 250, text: "CONFIRM ACTION", fill: "#11191d", color: "#ffffff", borderColor: "#55646a", accent: "#f47b36", fontSize: 20, radius: 2 },
    prompt: { name: "Warning prompt", x: 660, y: 180, w: 430, h: 100, text: "ACTION REQUIRED", fill: "#1a2429", color: "#ffffff", borderColor: "#57666d", accent: "#e8ae43", fontSize: 18, radius: 2 },
    toast: { name: "Notification", x: 1370, y: 180, w: 420, h: 82, text: "PLAYER JOINED THE FIGHT", fill: "#1a2429", color: "#ffffff", borderColor: "#4d5d64", accent: "#18bce8", fontSize: 17, radius: 2 },
    context: { name: "Context menu", x: 720, y: 300, w: 250, h: 190, text: "PLAYER ACTIONS", fill: "#131d21", color: "#ffffff", borderColor: "#4d5d64", accent: "#f47b36", fontSize: 17, radius: 2 },
    tooltip: { name: "Tooltip", x: 780, y: 220, w: 300, h: 64, text: "Place entity in the world", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#18bce8", fontSize: 15, radius: 4 },
    tabs: { name: "Tab navigation", x: 520, y: 150, w: 540, h: 56, text: "PLAYERS", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 16, radius: 1 },
    table: { name: "Data table", x: 560, y: 260, w: 620, h: 260, text: "CONNECTED PLAYERS", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#18bce8", fontSize: 17, radius: 1 },
    toolbar: { name: "Toolbar", x: 680, y: 60, w: 420, h: 58, text: "EDITOR TOOLS", fill: "#141d21", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 18, radius: 1 },
    progress: { name: "Progress bar", x: 650, y: 590, w: 390, h: 72, text: "DEPLOYMENT BUDGET", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#18bce8", fontSize: 16, radius: 2 },
    input: { name: "Input field", x: 650, y: 690, w: 340, h: 82, text: "PLAYER NAME", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 16, radius: 2 },
    toggle: { name: "Toggle", x: 650, y: 800, w: 320, h: 62, text: "ALLOW FRIENDLY FIRE", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 16, radius: 2 },
    assetcard: { name: "Asset card", x: 520, y: 560, w: 210, h: 180, text: "RIFLE SQUAD", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 16, radius: 1 },
    squadtile: { name: "Squad tile", x: 760, y: 560, w: 310, h: 110, text: "LIGHT FIRE TEAM", fill: "#172126", color: "#ffffff", borderColor: "#46565d", accent: "#18bce8", fontSize: 16, radius: 1 },
    inventory: { name: "Slot grid", x: 1210, y: 650, w: 330, h: 210, text: "ENTITY SLOTS", fill: "#11191d", color: "#ffffff", borderColor: "#46565d", accent: "#18bce8", fontSize: 16, radius: 1 },
    categorybar: { name: "Category bar", x: 560, y: 900, w: 600, h: 62, text: "ALL", fill: "#151f23", color: "#ffffff", borderColor: "#46565d", accent: "#f47b36", fontSize: 15, radius: 1 },
    reforger: { name: "Reforger reference", x: 640, y: 360, w: 430, h: 76, text: "WLib_ButtonText", fill: "#11191d", color: "#eef5f7", borderColor: "#52707a", accent: "#18bce8", fontSize: 17, radius: 1, resourcePath: "", catalogCategory: "", catalogKind: "", catalogPreview: "REF" },
    reference: { name: "Visual reference", x: 0, y: 0, w: 1920, h: 1080, text: "", fill: "#000000", color: "#ffffff", borderColor: "#18bce8", accent: "#18bce8", fontSize: 14, radius: 0, referenceName: "" }
  };

  const baseScenes = {
    blank: { width: 1920, height: 1080, source: "" },
    "vanilla-gm": { width: 2048, height: 1152, source: "assets/vanilla-gm-reference.png" }
  };

  let state = freshState();
  let selectedId = null;
  let history = [];
  let future = [];
  let zoom = 0.5;
  let interaction = null;
  let preview = false;
  let userTemplates = [];
  let persistedSession = null;
  // Browser-only selection state for engine-backed preview rows. It is never
  // exported as runtime authority; the generated controller re-reads the
  // PlayerManager ID when the real layout is opened in Reforger.
  const previewSelections = new Map();

  const stage = $("#stage");
  const stageWrap = $("#stageWrap");
  const canvasScroll = $("#canvasScroll");
  const inspector = $("#inspector");

  function freshState() {
    return {
      version: bundleSchema,
      title: "Untitled BUSHWAR UI",
      canvas: { width: 1920, height: 1080, baseScene: "blank", baseSceneVisible: true, baseSceneOpacity: 1, background: "", backgroundName: "", backgroundOpacity: 0.45 },
      settings: { grid: true, snap: true, gridSize: 10 },
      handoff: { target: "Menu", layoutName: "BUSHWAR_ComposerLayout" },
      engineContext: { schema: 1, source: "none", capturedAt: "", engineVersion: "", editorOpen: null, players: [], note: "No Workbench context loaded; runtime data remains authoritative." },
      layers: []
    };
  }

  function makeLayer(type, overrides = {}) {
    const layerOverrides = { ...overrides };
    const useNativeSource = layerOverrides.useNativeSource !== false;
    delete layerOverrides.useNativeSource;
    const layer = { id: uid(), type, opacity: 1, visible: true, locked: false, image: "", binding: "", bindingMode: "engine", functionId: "", functionTargetWidgetName: "", ...clone(defaults[type]), ...layerOverrides };
    // The browser cannot load Bohemia's packaged assets, so a generic CSS
    // mock is only a design approximation. Prefer the registered vanilla/WLib
    // source for palette/template layers so the Workbench handoff has the same
    // visual authority as the runtime. Runtime connected-player tables stay
    // native scaffolds because their required named children must be verified
    // against the chosen prefab instead of being guessed here.
    if (useNativeSource && !layer.resourcePath && layer.type !== "table" && layer.type !== "reference" && layer.type !== "text" && layer.type !== "badge" && layer.type !== "divider" && layer.type !== "image" && layer.type !== "icon") {
      const source = recommendedSourceFor(layer);
      if (source) {
        layer.resourcePath = source.path;
        layer.catalogCategory = source.category;
        layer.catalogKind = source.kind;
        layer.catalogPreview = source.preview;
        layer.catalogNativeWidgetClass = source.nativeWidgetClass || "LayoutResource";
        layer.catalogNativeChildHint = source.nativeChildHint || "";
        layer.catalogWorkbenchAction = source.workbenchAction || "Use this source in Workbench Layout Editor";
        layer.reforgerVisual = reforgerVisualFor(source);
      }
    }
    return hydrateCoreLayer(layer);
  }

  function hydrateCoreLayer(value) {
    const layer = { ...value };
    const coreSource = layer.resourcePath && window.BUSHWAR_REFORGER_CORE_LIBRARY?.entries?.find(entry => entry.path === layer.resourcePath || entry.resourceReference === layer.resourcePath);
    if (!coreSource) return layer;
    layer.coreLibraryId = coreSource.coreLibraryId || window.BUSHWAR_REFORGER_CORE_LIBRARY.projectId;
    layer.coreLibraryEntryId = coreSource.id;
    layer.reforgerVisual = coreSource.visual || layer.reforgerVisual;
    layer.nativeTree = coreSource.nativeTree || layer.nativeTree;
    layer.rowLayoutPath = coreSource.rowLayoutPath || layer.rowLayoutPath;
    layer.requiredChildren = layer.requiredChildren || (coreSource.requiredChildren ? clone(coreSource.requiredChildren) : undefined);
    layer.runtimeContracts = layer.runtimeContracts || (coreSource.runtimeContracts ? clone(coreSource.runtimeContracts) : undefined);
    layer.functionHints = layer.functionHints || (coreSource.functionHints ? clone(coreSource.functionHints) : undefined);
    if (!layer.binding && coreSource.defaultBinding) layer.binding = coreSource.defaultBinding;
    if (!layer.functionId && coreSource.defaultFunction) layer.functionId = coreSource.defaultFunction;
    if (!layer.functionTargetWidgetName && coreSource.defaultFunctionTarget) layer.functionTargetWidgetName = coreSource.defaultFunctionTarget;
    if (!layer.runtimeValueWidgetName && coreSource.runtimeValueWidgetName) layer.runtimeValueWidgetName = coreSource.runtimeValueWidgetName;
    return layer;
  }

  function normalizeState(value) {
    const clean = { ...freshState(), ...value };
    clean.canvas = { ...freshState().canvas, ...(value.canvas || {}) };
    clean.settings = { ...freshState().settings, ...(value.settings || {}) };
    clean.handoff = { ...freshState().handoff, ...(value.handoff || {}) };
    clean.engineContext = { ...freshState().engineContext, ...(value.engineContext || {}) };
    clean.engineContext.players = normalizeEnginePlayers(clean.engineContext.players);
    clean.layers = Array.isArray(value.layers) ? value.layers.map(layer => hydrateCoreLayer({ binding: "", bindingMode: "engine", functionId: "", functionTargetWidgetName: "", ...layer })) : [];
    return clean;
  }

  function bindingCatalog() {
    return window.BUSHWAR_REFORGER_BINDINGS || { entries: [], byId: () => null };
  }

  function bindingFor(layer) {
    return layer?.binding ? bindingCatalog().byId(layer.binding) : null;
  }

  function bindingsForLayer(layer) {
    return bindingCatalog().entries.filter(binding => !binding.targetKinds || binding.targetKinds.includes(layer?.type));
  }

  function functionCatalog() {
    return window.BUSHWAR_REFORGER_FUNCTIONS || { entries: [], byId: () => null, forLayer: () => [] };
  }

  function recipeCatalog() {
    return window.BUSHWAR_REFORGER_RECIPES || { entries: [], byId: () => null };
  }

  function widgetProfileCatalog() {
    return window.BUSHWAR_REFORGER_WIDGET_PROFILES || { entries: {}, forType: () => ({ label: "Frame panel", layoutType: "Frame", runtimeClass: "FrameWidgetClass" }) };
  }

  function widgetProfileFor(layer) {
    const profile = widgetProfileCatalog().forType(layer?.type || "panel");
    if (layer?.type === "reforger" && layer.catalogNativeWidgetClass) {
      const childHint = layer.catalogNativeChildHint ? ` · child hint ${layer.catalogNativeChildHint}` : "";
      return { ...profile, runtimeClass: layer.catalogNativeWidgetClass, label: `${profile.label} (${layer.catalogNativeWidgetClass}${childHint})` };
    }
    return profile;
  }

  function reforgerCatalogEntries() {
    const coreEntries = window.BUSHWAR_REFORGER_CORE_LIBRARY?.entries || [];
    const vanillaEntries = window.BUSHWAR_REFORGER_CATALOG?.entries || [];
    return [...coreEntries, ...vanillaEntries];
  }

  function recommendedSourceFor(layer) {
    const recommendation = widgetProfileFor(layer).sourceRecommended;
    if (!recommendation) return null;
    const entries = reforgerCatalogEntries();
    return entries.find(entry => entry.name.replace(/\.layout$/i, "") === recommendation)
      || entries.find(entry => entry.name.toLowerCase().includes(recommendation.toLowerCase()))
      || null;
  }

  function sourceBackedLayer(layer) {
    return !!(layer?.resourcePath && /\.layout$/i.test(layer.resourcePath));
  }

  function functionFor(layer) {
    return layer?.functionId ? functionCatalog().byId(layer.functionId) : null;
  }

  function selectedRuntimePlayer() {
    const selectedIds = [...previewSelections.values()];
    for (const selectedId of selectedIds) {
      const player = enginePlayers().find(item => Number(item.id) === Number(selectedId));
      if (player) return player;
    }
    return enginePlayers()[0] || null;
  }

  function runtimeDisplayValue(layer) {
    const binding = bindingFor(layer);
    if (!binding) return layer.text;
    if (binding.id === "player.name") return selectedRuntimePlayer()?.name || (hasEngineContextSnapshot() ? "PLAYER UNAVAILABLE" : "NO WORKBENCH PLAYER SNAPSHOT");
    if (binding.id === "player.count") return hasEngineContextSnapshot() ? String(enginePlayers().length) : "NO WORKBENCH PLAYER SNAPSHOT";
    if (binding.id === "editor.gm.open") {
      if (typeof state.engineContext?.editorOpen !== "boolean") return "GM EDITOR STATE UNKNOWN";
      return state.engineContext.editorOpen ? "GM EDITOR OPEN" : "GM EDITOR CLOSED";
    }
    return layer.text;
  }

  function groupedCatalogOptions(entries) {
    const groups = {};
    entries.forEach(entry => {
      const category = entry.category || "Other";
      (groups[category] ||= []).push(entry);
    });
    return Object.entries(groups).map(([category, values]) => `<optgroup label="${escapeHtml(category)}">${values.map(entry => `<option value="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</option>`).join("")}</optgroup>`).join("");
  }

  function enginePlayers() {
    return normalizeEnginePlayers(state.engineContext?.players);
  }

  function hasEngineContextSnapshot() {
    return state.engineContext?.source === "workbench";
  }

  function normalizeEnginePlayers(players) {
    const seenIds = new Set();
    return (Array.isArray(players) ? players : []).map(player => ({
      id: Number(player?.id),
      name: String(player?.name || "").trim(),
      identity: String(player?.identity || ""),
      controlledEntity: String(player?.controlledEntity || "")
    })).filter(player => {
      if (!Number.isInteger(player.id) || player.id <= 0 || !player.name || seenIds.has(player.id)) return false;
      seenIds.add(player.id);
      return true;
    });
  }

  function engineContextLabel() {
    const context = state.engineContext || {};
    if (!hasEngineContextSnapshot()) return "No Workbench snapshot loaded";
    const version = context.engineVersion ? ` · WR ${context.engineVersion}` : "";
    const editor = typeof context.editorOpen === "boolean" ? ` · GM editor ${context.editorOpen ? "open" : "closed"}` : "";
    return `${enginePlayers().length} connected player${enginePlayers().length === 1 ? "" : "s"} imported${editor}${version}`;
  }

  function isConnectedPlayersBinding(layer) {
    return bindingFor(layer)?.id === "player.list.connected";
  }

  function selectedPreviewPlayer(layer) {
    const selectedId = previewSelections.get(layer.id);
    return enginePlayers().find(player => Number(player.id) === Number(selectedId)) || null;
  }

  function connectedPlayerRowsMarkup(layer) {
    const players = enginePlayers();
    const selected = selectedPreviewPlayer(layer);
    const rows = players.map(player => {
      const selectedClass = selected && Number(selected.id) === Number(player.id) ? " selected" : "";
      return `<button type="button" class="engine-scaffold-row${selectedClass}" data-player-id="${escapeHtml(player.id)}"><span class="engine-row-name">${escapeHtml(player.name)}</span></button>`;
    }).join("");
    const empty = players.length ? "" : `<div class="engine-scaffold-empty">${hasEngineContextSnapshot() ? "Workbench reports 0 valid connected players." : "No imported Workbench players. Runtime opens with zero rows until PlayerManager returns a valid connected player."}</div>`;
    return { players, selected, rows, empty };
  }

  function renderConnectedPlayerScaffold(layer, element, mode = "table") {
    const { players, selected, rows, empty } = connectedPlayerRowsMarkup(layer);
    element.classList.add("runtime-engine-layer");
    if (mode === "player") {
      const row = players[0];
      element.innerHTML = row
        ? `<button type="button" class="engine-scaffold-row${selected && Number(selected.id) === Number(row.id) ? " selected" : ""}" data-player-id="${escapeHtml(row.id)}"><span class="engine-row-name">${escapeHtml(row.name)}</span></button>`
        : `<div class="engine-scaffold-empty">${hasEngineContextSnapshot() ? "Workbench reports 0 valid connected players." : "No imported Workbench player row: engine snapshot required."}</div>`;
      return;
    }
    const countLabel = hasEngineContextSnapshot() ? `${players.length} CONNECTED` : "ENGINE SNAPSHOT REQUIRED";
    element.innerHTML = `<div class="engine-scaffold"><div class="engine-scaffold-count">${countLabel}</div><div class="engine-scaffold-selection">SELECTED: ${selected ? escapeHtml(selected.name) : "NONE"}</div><div class="engine-scaffold-scroll"><div class="engine-scaffold-list">${rows}${empty}</div></div></div>`;
  }

  function updateEngineContextStatus() {
    const status = $("#engineContextStatus");
    if (!status) return;
    status.textContent = engineContextLabel();
    status.className = `engine-context-status${hasEngineContextSnapshot() ? " loaded" : " warn"}`;
  }

  function portableSnapshot() {
    return clone(state);
  }

  function autoSaveSnapshot() {
    const snapshot = clone(state);
    if (snapshot.canvas.background && snapshot.canvas.background.length > 500000) snapshot.canvas.background = "";
    snapshot.layers.forEach(layer => { if (layer.image && layer.image.length > 500000) layer.image = ""; });
    return snapshot;
  }

  function assetSummary(design = state) {
    const assets = [design.canvas.background, ...design.layers.map(layer => layer.image)].filter(value => typeof value === "string" && value.startsWith("data:"));
    return { count: assets.length, bytes: assets.reduce((total, value) => total + value.length, 0) };
  }

  function bundleIntegrity(design) {
    const assets = assetSummary(design);
    return { layerCount: design.layers.length, assetCount: assets.count, assetBytes: assets.bytes };
  }

  function makeBundle(kind, name) {
    const design = portableSnapshot();
    const assets = assetSummary(design);
    return { format: bundleFormat, schema: bundleSchema, kind, name: name || state.title, createdAt: new Date().toISOString(), appVersion: APP_VERSION, assets, integrity: bundleIntegrity(design), design };
  }

  function readBundle(value) {
    const bundle = value?.format === bundleFormat ? value : { format: "legacy-json", schema: 1, kind: "project", name: value?.title || "Imported design", design: value };
    if (!bundle.design?.canvas || !Array.isArray(bundle.design.layers)) throw new Error("This is not a valid Composer project or template bundle");
    if (bundle.format === bundleFormat && !["project", "template"].includes(bundle.kind)) throw new Error("This bundle has an unsupported type");
    const expected = bundle.integrity || bundle.assets;
    const actual = bundleIntegrity(bundle.design);
    const expectedAssets = expected?.assetCount ?? expected?.count;
    bundle.integrityStatus = !expected || (Number(expected.layerCount ?? actual.layerCount) === actual.layerCount && Number(expectedAssets ?? actual.assetCount) === actual.assetCount && Number(expected.assetBytes ?? expected.bytes ?? actual.assetBytes) === actual.assetBytes) ? "verified" : "mismatch";
    return bundle;
  }

  function loadUserTemplates() {
    try {
      const saved = JSON.parse(localStorage.getItem(templatesStorageKey) || "[]");
      userTemplates = Array.isArray(saved) ? saved.filter(item => item && item.id && item.name && item.design) : [];
    } catch { userTemplates = []; }
  }

  function persistUserTemplates() {
    try { localStorage.setItem(templatesStorageKey, JSON.stringify(userTemplates)); return true; }
    catch { setStatus("Template is too large for local storage. Export it as a template bundle to preserve its reference images."); return false; }
  }

  function renderUserTemplates() {
    const list = $("#userTemplateList");
    list.innerHTML = "";
    if (!userTemplates.length) return;
    userTemplates.forEach(template => {
      const row = document.createElement("div");
      row.className = "user-template";
      row.innerHTML = `<button class="load-user-template" title="Load ${escapeHtml(template.name)}">${escapeHtml(template.name)}</button><button class="remove-template" title="Delete ${escapeHtml(template.name)}" aria-label="Delete ${escapeHtml(template.name)}">×</button>`;
      $(".load-user-template", row).addEventListener("click", () => loadUserTemplate(template.id));
      $(".remove-template", row).addEventListener("click", () => {
        userTemplates = userTemplates.filter(item => item.id !== template.id);
        persistUserTemplates(); renderUserTemplates(); setStatus(`Template removed: ${template.name}`);
      });
      list.append(row);
    });
  }

  function saveUserTemplate(name) {
    const cleanName = name.trim().replace(/\s+/g, " ");
    if (!cleanName) return false;
    const existing = userTemplates.find(item => item.name.toLowerCase() === cleanName.toLowerCase());
    const before = clone(userTemplates);
    const saved = { id: existing ? existing.id : `template-${uid()}`, name: cleanName, updatedAt: new Date().toISOString(), design: portableSnapshot() };
    userTemplates = existing ? userTemplates.map(item => item.id === existing.id ? saved : item) : [saved, ...userTemplates];
    if (!persistUserTemplates()) { userTemplates = before; return false; }
    renderUserTemplates(); setStatus(`${existing ? "Updated" : "Saved"} template: ${cleanName}`);
    return true;
  }

  function loadUserTemplate(id) {
    const template = userTemplates.find(item => item.id === id);
    if (!template) return;
    checkpoint();
    state = normalizeState(clone(template.design));
    state.title = template.name || state.title;
    selectedId = null;
    syncControls(); render(); setStatus(`Template loaded: ${template.name}`);
  }

  function checkpoint() {
    history.push(JSON.stringify(state));
    if (history.length > 80) history.shift();
    future = [];
    updateUndoButtons();
  }

  function restore(serialized) {
    state = normalizeState(JSON.parse(serialized));
    selectedId = state.layers.some(layer => layer.id === selectedId) ? selectedId : null;
    syncControls();
    render();
  }

  function undo() {
    if (!history.length) return;
    future.push(JSON.stringify(state));
    restore(history.pop());
    updateUndoButtons();
  }

  function redo() {
    if (!future.length) return;
    history.push(JSON.stringify(state));
    restore(future.pop());
    updateUndoButtons();
  }

  function updateUndoButtons() {
    $("#undoBtn").disabled = !history.length;
    $("#redoBtn").disabled = !future.length;
  }

  function selectedLayer() { return state.layers.find(layer => layer.id === selectedId) || null; }
  function snap(value) { return state.settings.snap ? Math.round(value / state.settings.gridSize) * state.settings.gridSize : Math.round(value); }

  function render() {
    stage.style.width = `${state.canvas.width}px`;
    stage.style.height = `${state.canvas.height}px`;
    stage.classList.toggle("grid-on", state.settings.grid && !preview);
    stage.innerHTML = "";

    const scene = baseScenes[state.canvas.baseScene] || baseScenes.blank;
    if (scene.source && state.canvas.baseSceneVisible) {
      const base = document.createElement("img");
      base.className = "reference-image base-scene-image";
      base.src = scene.source;
      base.style.opacity = state.canvas.baseSceneOpacity;
      stage.append(base);
    }

    if (state.canvas.background) {
      const reference = document.createElement("img");
      reference.className = "reference-image custom-reference-image";
      reference.src = state.canvas.background;
      reference.style.opacity = state.canvas.backgroundOpacity;
      stage.append(reference);
    }

    state.layers.forEach((layer, index) => {
      if (!layer.visible) return;
      const element = document.createElement("div");
      element.className = `layer ${layer.type}-layer${layer.id === selectedId ? " selected" : ""}${layer.locked ? " locked" : ""}`;
      element.dataset.id = layer.id;
      element.dataset.size = `${Math.round(layer.w)} × ${Math.round(layer.h)}`;
      Object.assign(element.style, {
        left: `${layer.x}px`, top: `${layer.y}px`, width: `${layer.w}px`, height: `${layer.h}px`,
        backgroundColor: ["text", "reforger"].includes(layer.type) ? "transparent" : layer.fill,
        color: layer.color, border: `${["divider", "reforger"].includes(layer.type) ? 0 : 1}px solid ${layer.borderColor}`,
        borderRadius: `${layer.radius}px`, fontSize: `${layer.fontSize}px`, opacity: layer.opacity,
        zIndex: index + 2,
        "--comp-accent": layer.accent
      });

      renderLayerContent(layer, element);
      if (layer.id === selectedId && !preview) {
        const lock = document.createElement("button");
        lock.type = "button";
        lock.className = `canvas-lock-toggle${layer.locked ? " locked" : ""}`;
        lock.title = layer.locked ? "Unlock layer" : "Lock layer";
        lock.setAttribute("aria-label", `${layer.locked ? "Unlock" : "Lock"} ${layer.name}`);
        lock.textContent = layer.locked ? "🔒" : "🔓";
        lock.style.left = `${Math.ceil(element.dataset.size.length * 7.25 + 17)}px`;
        element.append(lock);
        const handle = document.createElement("span");
        handle.className = "resize-handle";
        element.append(handle);
      }
      stage.append(element);
    });

    renderLayers();
    renderInspector();
    updateStageScale();
    $("#canvasLabel").textContent = `${state.canvas.width} × ${state.canvas.height}`;
    updateEngineContextStatus();
    persist();
  }

  function renderLayerContent(layer, element) {
    const text = escapeHtml(layer.text);
    if (layer.coreLibraryEntryId === "core.admin-panel") {
      renderReforgerReference(layer, element, text);
      return;
    }
    if (sourceBackedLayer(layer) && !["table", "player"].includes(layer.type)) {
      renderReforgerReference(layer, element, text);
      return;
    }
    if (layer.coreLibraryEntryId === "core.player-row") {
      renderReforgerReference(layer, element, text);
      return;
    }
    if (layer.type === "text" || layer.type === "button" || layer.type === "badge") element.textContent = runtimeDisplayValue(layer);
    else if (layer.type === "icon") element.innerHTML = '<span class="icon-glyph"></span>';
    else if (layer.type === "image" || layer.type === "reference") {
      if (layer.image) element.style.backgroundImage = `url("${layer.image}")`;
      else if (layer.type === "image") element.classList.add("no-image");
    } else if (layer.type === "player") {
      if (isConnectedPlayersBinding(layer)) renderConnectedPlayerScaffold(layer, element, "player");
      else element.innerHTML = `<span class="player-name">${escapeHtml(runtimeDisplayValue(layer) || "PLAYER ROW")}</span>`;
    } else if (layer.type === "window") {
      element.innerHTML = `<div class="comp-header"><span>${text}</span><span class="comp-close">×</span></div><div class="comp-body"><strong>Window content</strong>Place lists, controls, previews, and custom widgets inside this frame.</div><div class="comp-footer"><span class="comp-button">CLOSE</span><span class="comp-button primary">APPLY</span></div>`;
    } else if (layer.type === "dialog") {
      element.innerHTML = `<div class="comp-header"><span>${text}</span><span class="comp-close">×</span></div><div class="comp-body"><strong>Are you sure?</strong>This action will affect the selected entity or player.</div><div class="comp-footer"><span class="comp-button">CANCEL</span><span class="comp-button primary">CONFIRM</span></div>`;
    } else if (layer.type === "prompt") {
      element.innerHTML = `<div class="prompt-wrap"><span class="prompt-symbol">!</span><span class="prompt-copy"><b>${text}</b><small>Review the selected settings before continuing.</small></span></div>`;
    } else if (layer.type === "toast") {
      element.innerHTML = `<div class="toast-wrap"><span class="toast-dot"><span>✓</span></span><span class="toast-copy"><b>${text}</b><small>Game Master event notification</small></span><span>×</span></div>`;
    } else if (layer.type === "context") {
      element.innerHTML = `<div class="context-menu"><div class="context-item">${text}</div><div class="context-item">Bring player</div><div class="context-item">Teleport to player</div><div class="context-item">Open profile</div><div class="context-item">Remove</div></div>`;
    } else if (layer.type === "tooltip") {
      element.innerHTML = `<div class="tooltip-bubble">${text}</div>`;
    } else if (layer.type === "tabs") {
      element.innerHTML = `<div class="tabs-wrap"><span class="tab-item active">${text}</span><span class="tab-item">ENTITIES</span><span class="tab-item">SYSTEMS</span><span class="tab-item">FAVORITES</span></div>`;
    } else if (layer.type === "table") {
      if (isConnectedPlayersBinding(layer)) renderConnectedPlayerScaffold(layer, element, "table");
      else element.innerHTML = `<div class="engine-design-only">Design preview only — assign an engine binding to make this runtime-backed.</div>`;
    } else if (layer.type === "toolbar") {
      element.innerHTML = '<div class="toolbar-wrap"><span class="tool-item active">◆</span><span class="tool-item">✚</span><span class="tool-item">◉</span><span class="tool-item">▣</span><span class="tool-item">⌖</span><span class="tool-item">⚙</span><span class="tool-item">?</span></div>';
    } else if (layer.type === "progress") {
      element.innerHTML = `<div class="progress-wrap"><div class="progress-label"><span>${text}</span><span>68%</span></div><div class="progress-track"><div class="progress-fill"></div></div></div>`;
    } else if (layer.type === "input") {
      element.innerHTML = `<div class="input-wrap"><label>${text}</label><div class="fake-input">Enter value…</div></div>`;
    } else if (layer.type === "toggle") {
      element.innerHTML = `<div class="toggle-wrap"><label>${text}</label><span class="fake-toggle"></span></div>`;
    } else if (layer.type === "assetcard") {
      element.innerHTML = `<div class="asset-preview">◇</div><div class="asset-caption"><span>${text}</span><span>12</span></div>`;
    } else if (layer.type === "squadtile") {
      element.innerHTML = `<div class="squad-wrap"><span class="squad-visual">◆</span><span class="squad-copy"><b>${text}</b><small>US · 6 units · Infantry</small></span></div>`;
    } else if (layer.type === "inventory") {
      element.innerHTML = `<div class="slot-grid">${Array.from({ length: 12 }, (_, index) => `<span class="slot-cell${index === 0 ? " active" : ""}">${index === 0 ? "◆" : ""}</span>`).join("")}</div>`;
    } else if (layer.type === "categorybar") {
      element.innerHTML = `<div class="category-wrap"><span class="category-item active">${text}</span><span class="category-item">CHARACTERS</span><span class="category-item">VEHICLES</span><span class="category-item">GROUPS</span><span class="category-item">PROPS</span></div>`;
    } else if (layer.type === "reforger" || sourceBackedLayer(layer)) {
      renderReforgerReference(layer, element, text);
    }
  }

  function reforgerVisualFor(item) {
    if (item.visual) return item.visual;
    const category = item.category || item.catalogCategory || "";
    const value = `${item.name} ${category} ${item.kind || item.catalogKind || ""}`.toLowerCase();
    if (category.startsWith("Icons")) return value.includes("map") ? "map-marker" : "icon-atlas";
    if (value.includes("checkbox")) return "checkbox";
    if (value.includes("slider")) return "slider";
    if (value.includes("progress") || value.includes("loading")) return "progress";
    if (value.includes("combo") || value.includes("spinbox")) return "selector";
    if (value.includes("editbox") || value.includes("input")) return "input";
    if (value.includes("tab")) return "tabs";
    if (value.includes("gallery") || value.includes("list") || value.includes("sort")) return "list";
    if (value.includes("vehiclehud") || value.includes("gauge")) return "vehicle-hud";
    if (value.includes("map") || value.includes("compass")) return "map";
    if (value.includes("chat")) return "chat";
    if (value.includes("action") || value.includes("command") || value.includes("ping")) return "action";
    if (value.includes("gamemaster") || value.includes("editor") || value.includes("hudmenu")) return "gm-hud";
    if (value.includes("button")) return "button";
    if (value.includes("label") || value.includes("text") || value.includes("heading")) return "text";
    return "panel";
  }

  function reforgerBoundsFor(visual) {
    const bounds = { button: [270, 58], checkbox: [260, 46], slider: [350, 56], progress: [370, 64], selector: [300, 58], input: [340, 70], tabs: [480, 58], list: [430, 220], "vehicle-hud": [420, 160], map: [390, 240], chat: [400, 160], action: [360, 78], "gm-hud": [470, 110], "icon-atlas": [240, 120], "map-marker": [220, 170], "core-admin-panel": [360, Math.round(state.canvas.height * 0.65)], "core-player-row": [332, 32], text: [360, 58], panel: [420, 110] };
    const [w, h] = bounds[visual] || bounds.panel;
    return { w, h };
  }

  function reforgerPlacementFor(item, visual) {
    const bounds = reforgerBoundsFor(visual);
    if (item.id === "core.admin-panel") {
      return { ...bounds, x: 24, y: Math.round(state.canvas.height * 0.15) };
    }
    if (item.id === "core.player-row") {
      return { ...bounds, x: 36, y: Math.round(state.canvas.height * 0.15) + 158 };
    }
    return bounds;
  }

  function renderReforgerReference(layer, element, text) {
    const visual = layer.reforgerVisual || reforgerVisualFor(layer);
    element.classList.add(`reforger-${visual}`);
    const title = text || "Reforger reference";
     const corePlayerTitle = layer.coreLibraryEntryId === "core.player-row"
       ? escapeHtml(runtimeDisplayValue(layer) || (hasEngineContextSnapshot() ? "PLAYER UNAVAILABLE" : "NO WORKBENCH PLAYER SNAPSHOT"))
      : title;
    const body = {
      button: `<span class="rr-button">${title}<i>›</i></span>`, checkbox: `<span class="rr-check checked">✓</span><span class="rr-label">${title}</span>`, slider: `<span class="rr-label">${title}</span><span class="rr-slider"><i></i></span>`, progress: `<span class="rr-label">${title}</span><span class="rr-progress"><i></i></span>`, selector: `<span class="rr-select">${title}<b>⌄</b></span>`, input: `<span class="rr-input"><b>${title}</b><i>Search / enter value</i></span>`, tabs: `<span class="rr-tabs"><b>${title}</b><i>DETAILS</i><i>OPTIONS</i></span>`, list: `<span class="rr-list"><b>${title}</b><i></i><i></i><i></i></span>`, "vehicle-hud": `<span class="rr-gauge">62</span><span class="rr-vehicle"><b>${title}</b><i>GEAR 3 · 48 km/h</i><em></em></span>`, map: `<span class="rr-map"><i>⌖</i><b>${title}</b><em></em></span>`, chat: `<span class="rr-chat"><b>${title}</b><i>PLAYER: Ready on your mark.</i><i>GM: Entity placed.</i></span>`, action: `<span class="rr-action"><b>F</b><span>${title}<i>Hold to interact</i></span></span>`, "gm-hud": `<span class="rr-gm"><b>◆</b><span>${title}<i>GAME MASTER / EDITOR</i></span><em>⌘</em></span>`, "icon-atlas": `<span class="rr-atlas"><i>⌁</i><i>⚙</i><i>◇</i><i>⌖</i><i>◉</i><i>▣</i></span>`, "map-marker": `<span class="rr-marker">⌖</span><span class="rr-label">${title}</span>`, "core-admin-panel": `<span class="rr-core-admin"><span class="rr-core-head"><b>${title}</b><button type="button" class="rr-core-refresh core-action" data-core-action="refresh">REFRESH</button><button type="button" class="rr-core-close" aria-label="Close">×</button></span><span class="rr-core-label">CONNECTED PLAYERS <b class="rr-core-count">0 CONNECTED</b></span><span class="rr-core-selection">SELECTED: NONE</span><span class="rr-core-list"></span></span>`, "core-player-row": `<button type="button" class="engine-scaffold-row rr-core-player-row"><span class="engine-row-name">${corePlayerTitle}</span></button>`, text: `<span class="rr-text">${title}</span>`, panel: `<span class="rr-panel"><b>${title}</b><i>Workbench layout reference</i></span>`
    }[visual] || `<span class="rr-panel"><b>${title}</b></span>`;
    element.innerHTML = `<div class="reforger-reference rf-${visual}" role="img" aria-label="${escapeHtml(title)} Reforger UI reference">${body}</div>`;
    if (visual === "core-admin-panel") {
      const players = enginePlayers();
      const selected = selectedPreviewPlayer(layer);
      const count = element.querySelector(".rr-core-count");
      const selection = element.querySelector(".rr-core-selection");
      const list = element.querySelector(".rr-core-list");
       if (count) count.textContent = hasEngineContextSnapshot() ? `${players.length} CONNECTED` : "ENGINE SNAPSHOT REQUIRED";
      if (selection) selection.textContent = `SELECTED: ${selected ? selected.name : "NONE"}`;
       if (list) list.innerHTML = players.length ? players.map(player => `<button type="button" class="engine-scaffold-row rr-core-player-row" data-player-id="${escapeHtml(player.id)}"><span class="engine-row-name">${escapeHtml(player.name)}</span></button>`).join("") : `<span class="engine-scaffold-empty">${hasEngineContextSnapshot() ? "Workbench reports 0 valid connected players." : "No imported Workbench players. Runtime opens with zero rows until PlayerManager returns a valid connected player."}</span>`;
    }
  }

  function renderLayers() {
    const list = $("#layerList");
    list.innerHTML = "";
    [...state.layers].reverse().forEach(layer => {
      const item = document.createElement("div");
      item.className = `layer-item${layer.id === selectedId ? " selected" : ""}`;
      item.dataset.id = layer.id;
      item.innerHTML = `<button class="lock-toggle${layer.locked ? " locked" : ""}" title="${layer.locked ? "Unlock layer" : "Lock layer"}" aria-label="${layer.locked ? "Unlock" : "Lock"} ${escapeHtml(layer.name)}">${layer.locked ? "🔒" : "🔓"}</button><span class="type">${escapeHtml(layer.type.slice(0, 3))}</span><span>${escapeHtml(layer.name)}</span><button class="visibility-toggle" title="${layer.visible ? "Hide" : "Show"}" aria-label="${layer.visible ? "Hide" : "Show"} ${escapeHtml(layer.name)}">${layer.visible ? "◉" : "○"}</button>`;
      item.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (button) {
          checkpoint();
          if (button.classList.contains("lock-toggle")) {
            layer.locked = !layer.locked;
            setStatus(`${layer.name} ${layer.locked ? "locked" : "unlocked"}`);
          } else layer.visible = !layer.visible;
          render();
          return;
        }
        select(layer.id);
      });
      list.append(item);
    });
  }

  function renderInspector() {
    const layer = selectedLayer();
    $("#emptyInspector").hidden = !!layer;
    inspector.hidden = !layer;
    if (!layer) return;
    $$("[data-prop]", inspector).forEach(input => {
      const prop = input.dataset.prop;
      if (input.type === "checkbox") input.checked = !!layer[prop];
      else input.value = layer[prop] ?? "";
    });
    $("#opacityOutput").textContent = `${Math.round(layer.opacity * 100)}%`;
    $("#imageControls").hidden = !["image", "reference"].includes(layer.type);
    $("#resourceControls").hidden = !sourceBackedLayer(layer) && layer.type !== "reforger";
    if (layer.type === "reforger" || sourceBackedLayer(layer)) $("#resourcePath").value = layer.resourcePath || "";
    const profile = widgetProfileFor(layer);
    const nativeControls = $("#nativeWidgetControls");
    nativeControls.hidden = layer.type === "reference";
    if (!nativeControls.hidden) {
      $("#nativeWidgetType").value = profile.runtimeClass || "FrameWidgetClass";
      const sourceHint = sourceBackedLayer(layer)
        ? `Source-backed layout: ${layer.resourcePath}. Keep this prefab as the visual authority in Workbench.`
        : profile.sourceRecommended
          ? `${profile.label}. Recommended vanilla source: ${profile.sourceRecommended}.`
          : `${profile.label}. The Composer will scaffold this native class; Workbench owns the final serialization.`;
      $("#nativeWidgetNote").textContent = sourceHint;
    }
    const recommendedSource = recommendedSourceFor(layer);
    const useRecommendedSource = $("#useRecommendedSourceBtn");
    const clearSource = $("#clearSourceBtn");
    useRecommendedSource.hidden = !recommendedSource || sourceBackedLayer(layer);
    clearSource.hidden = !sourceBackedLayer(layer);
    if (recommendedSource) useRecommendedSource.textContent = `Use ${recommendedSource.name.replace(/\.layout$/i, "")} source`;
    const bindingControls = $("#bindingControls");
    const bindingEntries = bindingsForLayer(layer);
    bindingControls.hidden = !bindingEntries.length;
    if (!bindingControls.hidden) {
      const select = $("#bindingSelect");
      select.innerHTML = `<option value="">No engine binding (design-only)</option>${groupedCatalogOptions(bindingEntries)}`;
      select.value = layer.binding || "";
      const binding = bindingFor(layer);
      $("#bindingContract").textContent = binding ? `${binding.sourceClass}: ${binding.sourceMethods.join(" · ")} · ${binding.authority}. ${binding.runtime}` : "Design-only preview. Export a binding before expecting Workbench runtime data.";
    }
    const functionControls = $("#functionControls");
    functionControls.hidden = !functionCatalog().forLayer(layer).length;
    if (!functionControls.hidden) {
      const select = $("#functionSelect");
      const entries = functionCatalog().forLayer(layer);
      select.innerHTML = `<option value="">No callback assigned (visual-only)</option>${groupedCatalogOptions(entries)}`;
      select.value = layer.functionId || "";
      const callback = functionFor(layer);
      $("#functionContract").textContent = callback ? `${callback.callback} · ${callback.authority}. ${callback.runtime}${callback.implementation ? ` Implementation: ${callback.implementation.status} via ${callback.implementation.method}.` : ""}` : "Choose a callback contract to tell Workbench what this widget should do when used.";
    }
    const functionTargetControls = $("#functionTargetControls");
    const selectedCallback = functionFor(layer);
    functionTargetControls.hidden = !selectedCallback?.requiresTarget;
    if (!functionTargetControls.hidden) $("#functionTargetWidgetName").value = layer.functionTargetWidgetName || "";
    const runtimeValueControls = $("#runtimeValueControls");
    runtimeValueControls.hidden = !layer.binding || layer.binding === "player.list.connected";
    if (!runtimeValueControls.hidden) $("#runtimeValueWidgetName").value = layer.runtimeValueWidgetName || "";
  }

  function select(id) {
    selectedId = id;
    render();
  }

  function addLayer(type, overrides = {}) {
    checkpoint();
    const layer = makeLayer(type, overrides);
    state.layers.push(layer);
    selectedId = layer.id;
    render();
    setStatus(`${layer.name} added`);
  }

  function deleteSelected() {
    if (!selectedLayer()) return;
    checkpoint();
    state.layers = state.layers.filter(layer => layer.id !== selectedId);
    selectedId = null;
    render();
    setStatus("Layer deleted");
  }

  function duplicateSelected() {
    const layer = selectedLayer();
    if (!layer) return;
    checkpoint();
    const copy = { ...clone(layer), id: uid(), name: `${layer.name} copy`, x: layer.x + 20, y: layer.y + 20 };
    state.layers.push(copy);
    selectedId = copy.id;
    render();
  }

  function moveLayer(direction) {
    const index = state.layers.findIndex(layer => layer.id === selectedId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= state.layers.length) return;
    checkpoint();
    [state.layers[index], state.layers[target]] = [state.layers[target], state.layers[index]];
    render();
  }

  function updateStageScale() {
    if ($("#zoomSelect").value === "fit") {
      const availableW = Math.max(200, canvasScroll.clientWidth - 64);
      const availableH = Math.max(150, canvasScroll.clientHeight - 64);
      zoom = Math.min(availableW / state.canvas.width, availableH / state.canvas.height, 1);
    } else zoom = Number($("#zoomSelect").value);
    stage.style.transform = `scale(${zoom})`;
    stageWrap.style.width = `${state.canvas.width * zoom}px`;
    stageWrap.style.height = `${state.canvas.height * zoom}px`;
  }

  function syncControls() {
    $("#screenWidth").value = state.canvas.width;
    $("#screenHeight").value = state.canvas.height;
    $("#sceneSelect").value = state.canvas.baseScene;
    $("#sceneOpacity").value = state.canvas.baseSceneOpacity;
    $("#backgroundOpacity").value = state.canvas.backgroundOpacity;
    $("#gridToggle").checked = state.settings.grid;
    $("#snapToggle").checked = state.settings.snap;
    updateSceneUI();
  }

  function updateSceneUI() {
    const visible = state.canvas.baseSceneVisible;
    $("#sceneToggleBtn").textContent = visible ? "Scene on" : "Scene off";
    $("#sceneToggleBtn").classList.toggle("ghost", !visible);
    $$("[data-scene]").forEach(button => button.classList.toggle("active", button.dataset.scene === state.canvas.baseScene));
  }

  function setBaseScene(name, saveHistory = true) {
    const scene = baseScenes[name] || baseScenes.blank;
    if (saveHistory) checkpoint();
    state.canvas.baseScene = name in baseScenes ? name : "blank";
    state.canvas.baseSceneVisible = true;
    state.canvas.width = scene.width;
    state.canvas.height = scene.height;
    syncControls();
    render();
    setStatus(state.canvas.baseScene === "blank" ? "Blank scene active" : "Vanilla GM reference scene active");
  }

  function applyTemplate(name) {
    checkpoint();
    state.layers = [];
    selectedId = null;
    if (name === "blank") {
      state.canvas.background = "";
      state.canvas.backgroundName = "";
      state.canvas.baseScene = "blank";
      state.canvas.baseSceneVisible = true;
      state.canvas.width = 1920;
      state.canvas.height = 1080;
    } else if (name === "gm-admin" || name === "gm-scene") {
      const useGmScene = name === "gm-scene";
      state.canvas.baseScene = useGmScene ? "vanilla-gm" : "blank";
      state.canvas.baseSceneVisible = true;
      state.canvas.width = useGmScene ? 2048 : 1920;
      state.canvas.height = useGmScene ? 1152 : 1080;
      const x = 24, y = Math.round(state.canvas.height * .15), w = 360, h = Math.round(state.canvas.height * .65);
      state.layers.push(
        makeLayer("panel", { name: "Admin panel background", x, y, w, h, fill: "#11191d", borderColor: "#435058" }),
        makeLayer("divider", { name: "Orange header rule", x, y, w, h: 5 }),
        makeLayer("text", { name: "Admin panel title", x: x + 18, y: y + 18, w: w - 76, h: 40, text: "BUSHWAR ADMIN TOOLS", fontSize: 22 }),
        makeLayer("button", { name: "Close", x: x + w - 48, y: y + 14, w: 32, h: 32, text: "×", fontSize: 24 }),
        makeLayer("text", { name: "Connected label", x: x + 18, y: y + 70, w: w - 36, h: 28, text: "CONNECTED PLAYERS", color: "#9eabb0", fontSize: 14 }),
        makeLayer("badge", { name: "Connected count (engine)", x: x + w - 158, y: y + 70, w: 140, h: 28, text: "CONNECTED", binding: "player.count", fontSize: 13 }),
        makeLayer("table", { name: "Connected players (engine)", x: x + 14, y: y + 106, w: w - 28, h: h - 130, text: "CONNECTED PLAYERS", binding: "player.list.connected", functionId: "player.row.select", fontSize: 15 }),
        makeLayer("button", { name: "Refresh live values", x: x + 206, y: y + 14, w: 92, h: 32, text: "REFRESH", functionId: "engine.context.refresh", fontSize: 12 })
      );
      selectedId = state.layers[0].id;
    } else if (name === "hud-card") {
      state.canvas.baseScene = "blank";
      state.canvas.baseSceneVisible = true;
      state.canvas.width = 1920;
      state.canvas.height = 1080;
      state.layers.push(
        makeLayer("panel", { name: "HUD card", x: 44, y: 820, w: 420, h: 210 }),
        makeLayer("divider", { name: "HUD accent", x: 44, y: 820, w: 420, h: 5 }),
        makeLayer("text", { name: "Date", x: 70, y: 850, w: 310, h: 38, text: "20 AUGUST 1989", fontSize: 20 }),
        makeLayer("text", { name: "Time", x: 70, y: 900, w: 310, h: 45, text: "12:00  ·  CLOUDY", fontSize: 25 }),
        makeLayer("button", { name: "HUD action", x: 70, y: 966, w: 260, h: 44, text: "EDIT SCENARIO PROPERTIES", fontSize: 15 })
      );
      selectedId = state.layers[0].id;
    }
    syncControls();
    render();
    setStatus(`${name.replace("-", " ")} template loaded`);
  }

  function exportDesign() {
    const bundle = makeBundle("project");
    download(`${safeName(state.title)}.bwui.json`, JSON.stringify(bundle, null, 2), "application/json");
    const assets = assetSummary();
    setStatus(`Portable project saved · ${assets.count} embedded reference asset${assets.count === 1 ? "" : "s"}`);
  }

  function exportTemplate() {
    const bundle = makeBundle("template", state.title);
    download(`${safeName(state.title)}.bwui-template.json`, JSON.stringify(bundle, null, 2), "application/json");
    const assets = assetSummary();
    setStatus(`Template bundle exported · ${assets.count} embedded reference asset${assets.count === 1 ? "" : "s"}`);
  }

  function nativeWidgetBaseName(layer, index = 0) {
    const fallback = `Widget${index + 1}`;
    const sourceName = safeName(layer?.name || fallback);
    return `m_w${sourceName.replace(/-([a-z])/g, (_, character) => character.toUpperCase()) || fallback}`;
  }

  function normalizeRequiredChildren(children) {
    if (!children || typeof children !== "object") return children;
    const normalized = { ...children };
    const aliases = {
      count: ["playerCount"],
      selection: ["playerSelection"],
      scroll: ["playerScroll"],
      list: ["playerList"],
      rowName: ["nameText"],
      rowRoot: ["row"]
    };
    Object.entries(aliases).forEach(([canonical, legacyNames]) => {
      if (normalized[canonical]) return;
      const legacyName = legacyNames.find(name => normalized[name]);
      if (legacyName) normalized[canonical] = normalized[legacyName];
    });
    return normalized;
  }

  function workbenchWidgetFor(layer, index, allLayers = []) {
    const profile = widgetProfileFor(layer);
    const source = sourceBackedLayer(layer) ? layer.resourcePath : "";
    const widgetType = source ? "Layout prefab" : (profile.runtimeClass || "FrameWidgetClass");
    const binding = bindingFor(layer);
    const callback = functionFor(layer);
    const baseName = nativeWidgetBaseName(layer, index);
    const sameNameBefore = allLayers.slice(0, index).filter((previous, previousIndex) => nativeWidgetBaseName(previous, previousIndex) === baseName).length;
    const widgetName = sameNameBefore ? `${baseName}_${sameNameBefore + 1}` : baseName;
    const declaredChildren = normalizeRequiredChildren(layer.requiredChildren);
    const runtimeChildNames = declaredChildren || (binding?.id === "player.list.connected" && layer.type === "table"
      ? {
          count: `${widgetName}Count`,
          selection: `${widgetName}Selection`,
          scroll: `${widgetName}Scroll`,
          list: `${widgetName}List`,
          rowRoot: "Row",
          rowName: "NameText"
        }
      : undefined);
    const coreVerified = Boolean(layer.coreLibraryId && layer.coreLibraryId === window.BUSHWAR_REFORGER_CORE_LIBRARY?.projectId);
    const sourceChildVerification = source && binding ? (coreVerified ? "manifest-verified" : "manual-required") : undefined;
    return {
      id: layer.id,
      name: widgetName,
      layerType: layer.type,
      widgetType,
      nativeType: source ? "Layout prefab" : profile.layoutType,
      widgetProfile: profile.label,
      sourceRecommended: profile.sourceRecommended,
      source: source || undefined,
      importMode: source ? "Drag this WLib/vanilla layout into the root, then apply the bounds below." : "Create this native widget under the root FrameWidget.",
      binding: layer.binding || "",
      bindingContract: binding || undefined,
      coreLibraryId: layer.coreLibraryId || undefined,
      coreLibraryEntryId: layer.coreLibraryEntryId || undefined,
      runtimeContracts: layer.runtimeContracts || undefined,
      functionHints: layer.functionHints || undefined,
      functionId: layer.functionId || "",
      functionContract: callback || undefined,
      functionTargetWidgetName: layer.functionTargetWidgetName || undefined,
      availableCallbacks: layer.functionHints || undefined,
      rowLayoutPath: layer.rowLayoutPath || undefined,
      recipeCallbacks: layer.recipeCallbacks || [],
      runtimeContract: binding || callback || runtimeChildNames || layer.runtimeContracts?.length ? {
        dataSource: binding ? `${binding.sourceClass}: ${binding.sourceMethods.join(" + ")}` : "client UI event",
        authority: callback?.authority || binding?.authority || "client-local",
        refreshEvents: binding?.updateEvents || callback?.updateEvents || [],
        sourceOfTruth: binding?.sourceOfTruth || (callback ? "generated controller route" : "client UI event"),
        emptyValuePolicy: binding?.emptyValuePolicy || undefined,
        identityField: binding?.identityField || undefined,
        previewPolicy: binding?.previewPolicy || (binding ? "snapshot-only" : "not-applicable"),
        rowIdentity: binding?.id === "player.list.connected" ? "PlayerManager playerId carried beside each native row" : undefined,
        nativePreviewShape: binding?.id === "player.list.connected" ? "Frame > count Text + selection Text + ScrollLayout > VerticalLayout > Button Row > Text NameText" : undefined,
        valueWidgetName: binding ? (layer.runtimeValueWidgetName || (layer.type === "player" ? `${widgetName}Text` : widgetName)) : undefined,
        actualValuesOnly: binding ? true : undefined,
         preview: hasEngineContextSnapshot() ? "Imported Workbench snapshot" : "Runtime fetch required; browser does not invent values",
         snapshotLoaded: hasEngineContextSnapshot(),
         playerCountKnown: hasEngineContextSnapshot(),
        sourceBacked: sourceBackedLayer(layer),
        sourcePath: source || undefined,
        coreLibraryId: layer.coreLibraryId || undefined,
        declaredRuntimeContracts: layer.runtimeContracts || undefined,
        requiredNamedChildren: runtimeChildNames,
        recipeId: layer.engineRecipeId || undefined,
        workbenchRecipe: layer.workbenchRecipe || undefined,
        nativeTree: layer.nativeTree || undefined,
        rowLayoutPath: layer.rowLayoutPath || undefined,
        recipeCallbacks: layer.recipeCallbacks || undefined,
        functionTargetWidgetName: layer.functionTargetWidgetName || undefined,
        sourceChildVerification
      } : undefined,
      boundsPx: { left: Math.round(layer.x), top: Math.round(layer.y), width: Math.round(layer.w), height: Math.round(layer.h), right: Math.round(layer.x + layer.w), bottom: Math.round(layer.y + layer.h) },
      anchors: [layer.x / state.canvas.width, layer.y / state.canvas.height, (layer.x + layer.w) / state.canvas.width, (layer.y + layer.h) / state.canvas.height].map(value => Number(value.toFixed(4))),
      geometry: { mode: "pixel-fixed", rootWidth: state.canvas.width, rootHeight: state.canvas.height },
      properties: { text: layer.text, fill: layer.fill, color: layer.color, borderColor: layer.borderColor, accent: layer.accent, opacity: layer.opacity, fontSize: layer.fontSize, visible: layer.visible },
      reforgerProfile: source ? (layer.reforgerVisual || reforgerVisualFor({ ...layer, name: layer.catalogName || layer.name, catalogCategory: layer.catalogCategory || "Widgets" })) : undefined,
      resourceReference: layer.resourcePath || undefined,
      sourceChildHint: layer.catalogNativeChildHint || undefined,
      resourceWorkbenchAction: layer.catalogWorkbenchAction || undefined,
      requiredNamedChildren: runtimeChildNames,
      sourceChildVerification
    };
  }

  function connectedChildNamesFor(widget) {
    const names = widget?.requiredNamedChildren || {};
    return {
      count: names.count || `${widget.name}Count`,
      selection: names.selection || `${widget.name}Selection`,
      scroll: names.scroll || `${widget.name}Scroll`,
      list: names.list || `${widget.name}List`,
      rowRoot: names.rowRoot || "Row",
      rowName: names.rowName || "NameText"
    };
  }

  function reforgerColor(hex, alpha = 1) {
    const value = String(hex || "#ffffff").replace("#", "");
    const red = parseInt(value.slice(0, 2), 16) || 0;
    const green = parseInt(value.slice(2, 4), 16) || 0;
    const blue = parseInt(value.slice(4, 6), 16) || 0;
    return [red / 255, green / 255, blue / 255, clamp(alpha, 0, 1)].map(component => Number(component.toFixed(3))).join(" ");
  }

  function nativeLayoutPropsFor(layer, profile) {
    const color = reforgerColor(layer.color, layer.opacity);
    if (["text", "badge"].includes(layer.type)) return { Text: layer.text || layer.name, Color: color };
    // Workbench accepts EditBoxWidgetClass as a native root, but its editable
    // value is runtime state; serializing a Text property produces the
    // `Unknown keyword/data 'Text'` parse error. CheckBoxWidgetClass likewise
    // has no portable visual property in this scaffold, so let Layout Editor
    // own its final styling.
    if (["input", "toggle"].includes(layer.type)) return {};
    if (layer.type === "progress") return { Current: "0", Maximum: "100", Color: reforgerColor(layer.accent, layer.opacity) };
    if (layer.type === "divider") return { Color: reforgerColor(layer.fill, layer.opacity) };
    if (["image", "icon"].includes(layer.type)) return { Color: color };
    return { Color: reforgerColor(layer.fill, layer.opacity) };
  }

  function nativeLayoutChildrenFor(layer, widget) {
    const buttonText = (name, value) => ({
      type: "Text",
      name,
      props: { Text: value || layer.text || layer.name, Color: reforgerColor(layer.color) },
      slot: { sizeMode: "FILL", padding: "12 6 12 6" }
    });
    if (["button", "player"].includes(layer.type)) return [buttonText(`${widget.name}Text`, layer.text)];
    if (["tabs", "toolbar", "categorybar"].includes(layer.type)) {
      const labels = layer.type === "tabs" ? [layer.text || "PLAYERS", "ENTITIES", "SYSTEMS"] : layer.type === "categorybar" ? [layer.text || "ALL", "CHARACTERS", "VEHICLES"] : ["TOOLS", "SPAWN", "DELETE"];
      return labels.map((label, index) => ({ type: "Button", name: `${widget.name}Item${index + 1}`, children: [buttonText(`${widget.name}Item${index + 1}Text`, label)], slot: { sizeMode: "FILL", fillWeight: 1 } }));
    }
    if (["text", "badge", "image", "icon", "progress", "input", "toggle", "divider"].includes(layer.type)) return [];
    return [{ type: "Text", name: `${widget.name}Text`, props: { Text: layer.text || layer.name, Color: reforgerColor(layer.color) }, slot: { anchor: "0 0 1 1" } }];
  }

  function layoutCreateNodeFor(layer, index, allLayers) {
    const widget = workbenchWidgetFor(layer, index, allLayers);
    const profile = widgetProfileFor(layer);
    // The Composer canvas is pixel-authored. Keep the generated Workbench
    // scaffold pixel-accurate instead of silently converting a 360 px panel
    // into a proportionally resizing anchor-only widget. The plan still
    // carries normalized anchors for responsive handoff review. Workbench's
    // FrameWidgetSlot serializer expresses a point-anchored pixel rectangle
    // with Offset* fields; PositionX/SizeX shorthand can parse yet collapse
    // to the origin when the layout is opened in a fresh resource database.
    // Enfusion's right/bottom offsets are measured from the anchored edge,
    // so a point-anchored rectangle uses negative right/bottom values.
    const left = Math.round(layer.x);
    const top = Math.round(layer.y);
    const pixelSlot = {
      anchor: "0 0 0 0",
      offsetLeft: left,
      offsetTop: top,
      offsetRight: -(left + Math.round(layer.w)),
      offsetBottom: -(top + Math.round(layer.h))
    };
    if (widget.binding === "player.list.connected") {
      const names = connectedChildNamesFor(widget);
      const inset = 14;
      const countHeight = Math.max(24, Math.round(layer.h * 0.1));
      const selectionHeight = Math.max(24, Math.round(layer.h * 0.1));
      const listTop = inset + countHeight + selectionHeight + 8;
      const listWidth = Math.max(1, Math.round(layer.w) - inset * 2);
      const listHeight = Math.max(1, Math.round(layer.h) - listTop - inset);
      const childPixelSlot = (left, top, width, height) => ({
        anchor: "0 0 0 0",
        offsetLeft: left,
        offsetTop: top,
        offsetRight: -(left + width),
        offsetBottom: -(top + height)
      });
      return {
        type: "Frame",
        name: widget.name,
        source: widget.source || undefined,
        sourceBacked: !!widget.source,
        props: { Color: reforgerColor(layer.fill, layer.opacity) },
        slot: pixelSlot,
        children: [
          {
            type: "Text",
            name: names.count,
            props: { Text: "PLAYER DATA UNAVAILABLE", Color: reforgerColor(layer.accent) },
            slot: childPixelSlot(inset, inset, listWidth, countHeight)
          },
          {
            type: "Text",
            name: names.selection,
            props: { Text: "SELECTED: NONE", Color: reforgerColor(layer.color) },
            slot: childPixelSlot(inset, inset + countHeight, listWidth, selectionHeight)
          },
          {
            type: "ScrollLayout",
            name: names.scroll,
            slot: childPixelSlot(inset, listTop, listWidth, listHeight),
            children: [{
              type: "VerticalLayout",
              name: names.list,
              slot: { sizeMode: "FILL" }
            }]
          }
        ]
      };
    }
    return {
      type: profile.layoutType || "Frame",
      name: widget.name,
      source: widget.source || undefined,
      sourceBacked: !!widget.source,
      props: nativeLayoutPropsFor(layer, profile),
      slot: pixelSlot,
      children: nativeLayoutChildrenFor(layer, widget)
    };
  }

  function controllerSourceFor(classStem, layoutName, widgets) {
    const className = `BWUIC_${classStem}Controller`;
    const connected = widgets.find(widget => widget.binding === "player.list.connected");
    const connectedNames = connected ? (() => {
      const names = connected.requiredWidgetNames || connected.requiredNamedChildren || {};
      return {
        count: names.count || `${connected.name}Count`,
        selection: names.selection || `${connected.name}Selection`,
        scroll: names.scroll || `${connected.name}Scroll`,
        list: names.list || `${connected.name}List`,
        rowRoot: names.rowRoot || "Row",
        rowName: names.rowName || "NameText"
      };
    })() : null;
    const connectedRowFontSize = Math.max(10, Math.round(Number(connected?.properties?.fontSize) || 17));
    const scalarBindings = widgets.filter(widget => ["player.name", "player.count", "editor.gm.open"].includes(widget.binding));
    const callbackIds = [...new Set(widgets.map(widget => widget.functionId).filter(Boolean))];
    const needsContextExport = callbackIds.includes("engine.context.export");
    const fontTargets = new Map();
    const addFontTarget = (name, size) => {
      if (!name || fontTargets.has(name)) return;
      fontTargets.set(name, Math.max(10, Math.round(Number(size) || 16)));
    };
    widgets.forEach(widget => {
      const size = widget.properties?.fontSize || 16;
      if (widget.binding === "player.list.connected") {
        addFontTarget(connectedNames.count, Math.max(12, size * 0.85));
        addFontTarget(connectedNames.selection, Math.max(12, size * 0.85));
        addFontTarget(connectedNames.rowName, size);
      } else if (["button", "player"].includes(widget.layerType)) {
        addFontTarget(`${widget.name}Text`, size);
      } else if (["text", "badge"].includes(widget.layerType)) {
        addFontTarget(widget.name, size);
      } else if (["tabs", "toolbar", "categorybar"].includes(widget.layerType)) {
        [1, 2, 3].forEach(index => addFontTarget(`${widget.name}Item${index}Text`, size));
      }
    });
    const fontLines = [...fontTargets.entries()].map(([name, size]) => `\t\tSetReadableFont(m_wRoot, "${name}", ${size});`);
    const callbackRoutes = [];
    let needsWidgetClickHook = false;
    let needsReviewHook = false;
    widgets.filter(widget => widget.functionId && widget.functionId !== "player.row.select").forEach(widget => {
      const callbackTarget = widget.functionTargetWidgetName?.trim() || widget.name;
      callbackRoutes.push(`\t\tif (IsWidgetNamedOrChild(w, "${callbackTarget}"))`);
      callbackRoutes.push("\t\t{");
      let directReturn = false;
      if (widget.functionId === "ui.layout.close") callbackRoutes.push("\t\t\tClose();");
      else if (widget.functionId === "ui.layout.open") callbackRoutes.push("\t\t\tOpen();");
      else if (widget.functionId === "player.list.refresh" && connected) callbackRoutes.push("\t\t\tRefreshConnectedPlayers();");
      else if (widget.functionId === "engine.context.refresh") {
        if (connected) callbackRoutes.push("\t\t\tRefreshConnectedPlayers();");
        if (scalarBindings.length) callbackRoutes.push("\t\t\tRefreshRuntimeBindings();");
      }
      else if (widget.functionId === "engine.context.export") callbackRoutes.push("\t\t\tExportRuntimeContext();");
      else if (widget.functionId === "ui.widget.toggle-visibility") {
        const targetName = widget.functionTargetWidgetName?.trim() || widget.name;
        callbackRoutes.push(`\t\t\tToggleWidgetVisibility(${JSON.stringify(targetName)}, w);`);
      }
      else if (widget.functionId === "ui.widget.set-text") {
        const targetName = widget.functionTargetWidgetName?.trim() || `${widget.name}Text`;
        callbackRoutes.push(`\t\t\tSetWidgetText(${JSON.stringify(targetName)}, ${JSON.stringify(widget.properties?.text || "")});`);
      }
      else if (widget.functionId === "player.list.refresh") { callbackRoutes.push("\t\t\treturn OnReviewRequiredCallback(\"player.list.refresh\", w);"); needsReviewHook = true; directReturn = true; }
      else if (widget.functionId === "player.row.teleport") callbackRoutes.push("\t\t\tRequestTeleportSelectedPlayer();");
      else if (widget.functionId === "ui.widget.click") { callbackRoutes.push("\t\t\treturn OnWidgetClickContract(w, x, y, button);"); needsWidgetClickHook = true; directReturn = true; }
      else { callbackRoutes.push(`\t\t\treturn OnReviewRequiredCallback("${widget.functionId}", w);`); needsReviewHook = true; directReturn = true; }
      if (!directReturn) callbackRoutes.push("\t\t\treturn true;");
      callbackRoutes.push("\t\t}");
    });
    const contextClasses = needsContextExport ? [
      `class BWUIC_${classStem}RuntimePlayerSnapshot : JsonApiStruct`,
      "{",
      "\tint id;",
      "\tstring name;",
      "",
      `\tvoid BWUIC_${classStem}RuntimePlayerSnapshot()`,
      "\t{",
      "\t\tRegV(\"id\");",
      "\t\tRegV(\"name\");",
      "\t}",
      "}",
      "",
      `class BWUIC_${classStem}RuntimeContextSnapshot : JsonApiStruct`,
      "{",
      "\tstring format;",
      "\tint schema;",
      "\tstring capturedAt;",
      "\tstring engineVersion;",
      "\tbool editorOpen;",
      `\tref array<ref BWUIC_${classStem}RuntimePlayerSnapshot> players = {};`,
      "\tstring note;",
      "",
      `\tvoid BWUIC_${classStem}RuntimeContextSnapshot()`,
      "\t{",
      "\t\tRegV(\"format\");",
      "\t\tRegV(\"schema\");",
      "\t\tRegV(\"capturedAt\");",
      "\t\tRegV(\"engineVersion\");",
      "\t\tRegV(\"editorOpen\");",
      "\t\tRegV(\"players\");",
      "\t\tRegV(\"note\");",
      "\t}",
      "}",
      ""
    ] : [];
    const lines = [
      ...contextClasses,
      "// Generated by BUSHWAR UI Composer.",
      "//",
      "// This is a reviewable EnforceScript starting point, not a compiled mod.",
      "// Keep the .layout resource and this controller in the same addon, open",
      "// the layout in Workbench, and replace the placeholder ResourceName with",
      "// the GUID Workbench assigns after registration if your project requires it.",
      "// The browser never executes game code or grants server authority.",
      "",
      `class ${className} : ScriptedWidgetEventHandler`,
      "{",
      `\tprotected static const ResourceName LAYOUT = \"UI/layouts/${layoutName}.layout\";`,
      "\tprotected ref Widget m_wRoot;",
      "\tprotected int m_iSelectedPlayerId = -1;",
      scalarBindings.length ? "\tprotected int m_iRuntimeBindingUpdateCounter;" : "",
      "",
      "\tvoid Open()",
      "\t{",
      "\t\tif (m_wRoot)",
      "\t\t\treturn;",
      "",
      "\t\tm_wRoot = GetGame().GetWorkspace().CreateWidgets(LAYOUT);",
      "\t\tif (!m_wRoot)",
      "\t\t\treturn;",
      "",
      "\t\tm_wRoot.AddHandler(this);",
      ...fontLines,
      "\t\tInputManager inputManager = GetGame().GetInputManager();",
      "\t\tif (inputManager)",
      "\t\t\tinputManager.AddActionListener(\"MenuBack\", EActionTrigger.DOWN, Close);",
      "",
      connected ? "\t\tRefreshConnectedPlayers();" : "\t\t// Add named-widget initialization here after Layout Editor authoring.",
      scalarBindings.length ? "\t\tRefreshRuntimeBindings();" : "",
      "\t}",
      "",
      "\tvoid Close()",
      "\t{",
      "\t\tif (!m_wRoot)",
      "\t\t\treturn;",
      "",
      "\t\tInputManager inputManager = GetGame().GetInputManager();",
      "\t\tif (inputManager)",
      "\t\t\tinputManager.RemoveActionListener(\"MenuBack\", EActionTrigger.DOWN, Close);",
      "\t\tm_wRoot.RemoveHandler(this);",
      "\t\tdelete m_wRoot;",
      "\t\tm_wRoot = null;",
      "\t\tm_iSelectedPlayerId = -1;",
      "\t}",
      "",
      "\tprotected void SetReadableFont(Widget root, string widgetName, int size)",
      "\t{",
      "\t\tTextWidget text = TextWidget.Cast(root.FindAnyWidget(widgetName));",
      "\t\tif (text)",
      "\t\t\ttext.SetExactFontSize(size);",
      "\t}",
      "",
      "\tprotected bool IsWidgetNamedOrChild(Widget widget, string widgetName)",
      "\t{",
      "\t\tWidget current = widget;",
      "\t\twhile (current)",
      "\t\t{",
      "\t\t\tif (current.GetName() == widgetName)",
      "\t\t\t\treturn true;",
      "\t\t\tcurrent = current.GetParent();",
      "\t\t}",
      "\t\treturn false;",
      "\t}",
      "",
      "\tprotected void ToggleWidgetVisibility(string targetName, Widget fallbackWidget)",
      "\t{",
      "\t\tWidget target = m_wRoot.FindAnyWidget(targetName);",
      "\t\tif (!target)",
      "\t\t\ttarget = fallbackWidget;",
      "\t\tif (target)",
      "\t\t\ttarget.SetVisible(!target.IsVisible());",
      "\t}",
      "",
      "\tprotected void SetWidgetText(string targetName, string value)",
      "\t{",
      "\t\tTextWidget target = TextWidget.Cast(m_wRoot.FindAnyWidget(targetName));",
      "\t\tif (target)",
      "\t\t\ttarget.SetText(value);",
      "\t}",
      ""
    ];
    if (needsContextExport) {
      lines.push(
        "\tprotected void ExportRuntimeContext()",
        "\t{",
        "\t\tFileIO.MakeDirectory(\"$profile:BUSHWAR-UIComposer\");",
        `\t\tBWUIC_${classStem}RuntimeContextSnapshot snapshot = new BWUIC_${classStem}RuntimeContextSnapshot();`,
        "\t\tsnapshot.format = \"bushwar-ui-composer-engine-context\";",
        "\t\tsnapshot.schema = 1;",
        "\t\tsnapshot.capturedAt = \"runtime\";",
        "\t\tsnapshot.engineVersion = string.Empty;",
        "\t\tsnapshot.editorOpen = SCR_EditorManagerEntity.IsOpenedInstance(true);",
        "\t\tsnapshot.note = \"Captured by the generated Reforger controller; live PlayerManager remains authoritative.\";",
        "\t\tPlayerManager playerManager = GetGame().GetPlayerManager();",
        "\t\tif (playerManager)",
        "\t\t{",
        "\t\t\tarray<int> playerIds = {};",
        "\t\t\tarray<int> capturedPlayerIds = {};",
        "\t\t\tplayerManager.GetPlayers(playerIds);",
        "\t\t\tfor (int playerIndex = 0; playerIndex < playerIds.Count(); playerIndex++)",
        "\t\t\t{",
        "\t\t\t\tint playerId = playerIds[playerIndex];",
        "\t\t\t\tif (playerId <= 0)",
        "\t\t\t\t\tcontinue;",
        "\t\t\t\tif (capturedPlayerIds.Find(playerId) >= 0)",
        "\t\t\t\t\tcontinue;",
        "\t\t\t\tstring playerName = playerManager.GetPlayerName(playerId);",
        "\t\t\t\tif (playerName.IsEmpty())",
        "\t\t\t\t\tcontinue;",
        "\t\t\t\tcapturedPlayerIds.Insert(playerId);",
        `\t\t\t\tBWUIC_${classStem}RuntimePlayerSnapshot player = new BWUIC_${classStem}RuntimePlayerSnapshot();`,
        "\t\t\t\tplayer.id = playerId;",
        "\t\t\t\tplayer.name = playerName;",
        "\t\t\t\tsnapshot.players.Insert(player);",
        "\t\t\t}",
        "\t\t}",
        "\t\tif (!snapshot.PackToFile(\"$profile:BUSHWAR-UIComposer/runtime-context.json\"))",
        "\t\t\tPrint(\"BUSHWAR UI Composer: failed to write runtime context snapshot\");",
        "\t}",
        ""
      );
    }
    if (connected) {
      const names = connected.requiredWidgetNames || {
        count: `${connected.name}Count`,
        selection: `${connected.name}Selection`,
        list: `${connected.name}List`,
        rowName: "NameText"
      };
      const rowLayout = connected.rowLayoutPath || `UI/layouts/${layoutName}-player-row.layout`;
      lines.push(
        `\tprotected static const ResourceName CONNECTED_ROW_LAYOUT = \"${rowLayout}\";`,
        `\tprotected ref Widget m_w${classStem}ConnectedList;`,
        "\tprotected ref array<Widget> m_aPlayerRows = {};",
        "\tprotected ref array<int> m_aPlayerRowIds = {};",
        "\tprotected int m_iConnectedPlayerUpdateCounter;",
        "\tprotected string m_sConnectedPlayerSignature;",
        "",
        "\tprotected void RefreshConnectedPlayers()",
        "\t{",
        "\t\tif (!m_wRoot)",
        "\t\t\treturn;",
        "",
        `\t\tm_w${classStem}ConnectedList = m_wRoot.FindAnyWidget(\"${names.list}\");`,
        `\t\tWidget countWidget = m_wRoot.FindAnyWidget(\"${names.count}\");`,
        `\t\tif (!m_w${classStem}ConnectedList)`,
        "\t\t\treturn;",
        "",
        "\t\tint previousSelectedPlayerId = m_iSelectedPlayerId;",
        `\t\tWidget child = m_w${classStem}ConnectedList.GetChildren();`,
        "\t\twhile (child)",
        "\t\t{",
        "\t\t\tWidget next = child.GetSibling();",
        `\t\t\tm_w${classStem}ConnectedList.RemoveChild(child);`,
        "\t\t\tchild = next;",
        "\t\t}",
        "\t\tm_aPlayerRows.Clear();",
        "\t\tm_aPlayerRowIds.Clear();",
        "\t\tm_iSelectedPlayerId = -1;",
        "",
        "\t\tPlayerManager playerManager = GetGame().GetPlayerManager();",
        "\t\tif (!playerManager)",
        "\t\t{",
        `\t\t\tTextWidget unavailableCount = TextWidget.Cast(m_wRoot.FindAnyWidget("${names.count}"));`,
        "\t\t\tif (unavailableCount) unavailableCount.SetText(\"PLAYER DATA UNAVAILABLE\");",
        `\t\t\tTextWidget unavailableSelection = TextWidget.Cast(m_wRoot.FindAnyWidget("${names.selection}"));`,
        "\t\t\tif (unavailableSelection) unavailableSelection.SetText(\"SELECTED: NONE\");",
        "\t\t\treturn;",
        "\t\t}",
        "",
        "\t\tarray<int> playerIds = {};",
        "\t\tplayerManager.GetPlayers(playerIds);",
        "\t\tint renderedPlayers;",
        "\t\tfor (int playerIndex = 0; playerIndex < playerIds.Count(); playerIndex++)",
        "\t\t{",
        "\t\t\tint playerId = playerIds[playerIndex];",
        "\t\t\tif (playerId <= 0)",
        "\t\t\t\tcontinue;",
        "\t\t\tif (m_aPlayerRowIds.Find(playerId) >= 0)",
        "\t\t\t\tcontinue;",
        "\t\t\tstring playerName = playerManager.GetPlayerName(playerId);",
        "\t\t\tif (playerName.IsEmpty())",
        "\t\t\t\tcontinue;",
        "",
        `\t\t\tWidget row = GetGame().GetWorkspace().CreateWidgets(CONNECTED_ROW_LAYOUT, m_w${classStem}ConnectedList);`,
        "\t\t\tif (!row)",
        "\t\t\t\tcontinue;",
        `\t\t\tTextWidget nameText = TextWidget.Cast(row.FindAnyWidget(\"${names.rowName}\"));`,
        "\t\t\tif (!nameText)",
        "\t\t\t{",
        `\t\t\t\tm_w${classStem}ConnectedList.RemoveChild(row);`,
        "\t\t\t\tcontinue;",
        "\t\t\t}",
        "\t\t\tif (nameText)",
        "\t\t\t{",
        "\t\t\t\tnameText.SetText(playerName);",
        `\t\t\t\tnameText.SetExactFontSize(${connectedRowFontSize});`,
        "\t\t\t}",
        "\t\t\trow.AddHandler(this);",
        "\t\t\tm_aPlayerRows.Insert(row);",
        "\t\t\tm_aPlayerRowIds.Insert(playerId);",
        "\t\t\tif (nameText)",
        "\t\t\t\tnameText.AddHandler(this);",
        "\t\t\tif (playerId == previousSelectedPlayerId)",
        "\t\t\t\tm_iSelectedPlayerId = playerId;",
        "\t\t\trenderedPlayers++;",
        "\t\t}",
        "",
        "\t\tTextWidget countText = TextWidget.Cast(countWidget);",
        "\t\tif (countText)",
        "\t\t\tcountText.SetText(renderedPlayers.ToString() + \" CONNECTED\");",
        `\t\tTextWidget selectionText = TextWidget.Cast(m_wRoot.FindAnyWidget("${names.selection || `${connected.name}Selection`}"));`,
        "\t\tif (selectionText)",
        "\t\t{",
        `\t\t\tif (m_iSelectedPlayerId >= 0) selectionText.SetText("SELECTED: " + playerManager.GetPlayerName(m_iSelectedPlayerId));`,
        "\t\t\telse selectionText.SetText(\"SELECTED: NONE\");",
        "\t\t}",
        "\t\tm_sConnectedPlayerSignature = BuildConnectedPlayerSignature();",
        "\t}",
        "",
        "\tprotected string BuildConnectedPlayerSignature()",
        "\t{",
        "\t\tstring signature;",
        "\t\tPlayerManager playerManager = GetGame().GetPlayerManager();",
        "\t\tif (!playerManager)",
        "\t\t\treturn signature;",
        "",
        "\t\tarray<int> playerIds = {};",
        "\t\tarray<int> signaturePlayerIds = {};",
        "\t\tplayerManager.GetPlayers(playerIds);",
        "\t\tfor (int playerIndex = 0; playerIndex < playerIds.Count(); playerIndex++)",
        "\t\t{",
        "\t\t\tint playerId = playerIds[playerIndex];",
        "\t\t\tif (playerId <= 0)",
        "\t\t\t\tcontinue;",
        "\t\t\tif (signaturePlayerIds.Find(playerId) >= 0)",
        "\t\t\t\tcontinue;",
        "\t\t\tstring playerName = playerManager.GetPlayerName(playerId);",
        "\t\t\tif (!playerName.IsEmpty())",
        "\t\t\t{",
        "\t\t\t\tsignaturePlayerIds.Insert(playerId);",
        "\t\t\t\tsignature += playerId.ToString() + \":\" + playerName + \";\";",
        "\t\t\t}",
        "\t\t}",
        "\t\treturn signature;",
        "\t}",
        "",
        "\toverride bool OnUpdate(Widget w)",
        "\t{",
        "\t\tif (w != m_wRoot)",
        "\t\t\treturn false;",
        "",
        "\t\tm_iConnectedPlayerUpdateCounter++;",
        "\t\tif (m_iConnectedPlayerUpdateCounter >= 30)",
        "\t\t{",
        "\t\t\tm_iConnectedPlayerUpdateCounter = 0;",
        "\t\t\tstring signature = BuildConnectedPlayerSignature();",
        "\t\t\tif (signature != m_sConnectedPlayerSignature)",
        "\t\t\t{",
        "\t\t\t\tm_sConnectedPlayerSignature = signature;",
        "\t\t\t\tRefreshConnectedPlayers();",
        "\t\t\t}",
        "\t\t}",
        scalarBindings.length ? "\t\tm_iRuntimeBindingUpdateCounter++;" : "",
        scalarBindings.length ? "\t\tif (m_iRuntimeBindingUpdateCounter >= 30)" : "",
        scalarBindings.length ? "\t\t{" : "",
        scalarBindings.length ? "\t\t\tm_iRuntimeBindingUpdateCounter = 0;" : "",
        scalarBindings.length ? "\t\t\tRefreshRuntimeBindings();" : "",
        scalarBindings.length ? "\t\t}" : "",
        "\t\treturn false;",
        "\t}",
        "",
        "\tprotected void OnPlayerRowClicked(int playerId)",
        "\t{",
        "\t\tPlayerManager playerManager = GetGame().GetPlayerManager();",
        "\t\tif (!playerManager)",
        "\t\t\treturn;",
        "",
        "\t\tstring playerName = playerManager.GetPlayerName(playerId);",
        "\t\tif (playerName.IsEmpty())",
        "\t\t\treturn;",
        "\t\tm_iSelectedPlayerId = playerId;",
        `\t\tTextWidget selectionText = TextWidget.Cast(m_wRoot.FindAnyWidget(\"${names.selection}\"));`,
        "\t\tif (selectionText)",
        "\t\t{",
        "\t\t\tselectionText.SetText(\"SELECTED: \" + playerName);",
        "\t\t\tselectionText.SetExactFontSize(14);",
        "\t\t}",
        "\t\t// Bind the selected-player label or action target here using the",
        "\t\t// actual ID. Never infer identity from row order or display text.",
        "\t}",
        ""
      );

    }
    if (scalarBindings.length) {
      const needsPlayerName = scalarBindings.some(widget => widget.binding === "player.name");
      const needsPlayerCount = scalarBindings.some(widget => widget.binding === "player.count");
      lines.push(
        "\tprotected void RefreshRuntimeBindings()",
        "\t{",
        "\t\tif (!m_wRoot)",
        "\t\t\treturn;",
        "",
        needsPlayerName ? "\t\tstring runtimePlayerName;" : "",
        needsPlayerCount ? "\t\tint runtimePlayerCount;" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\tbool runtimePlayerDataAvailable;" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\tPlayerManager playerManager = GetGame().GetPlayerManager();" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\tif (playerManager)" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t{" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\truntimePlayerDataAvailable = true;" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\tarray<int> runtimePlayerIds = {};" : "",
        needsPlayerCount ? "\t\t\tarray<int> countedPlayerIds = {};" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\tplayerManager.GetPlayers(runtimePlayerIds);" : "",
        needsPlayerName ? "\t\t\tif (m_iSelectedPlayerId >= 0)" : "",
        needsPlayerName ? "\t\t\t\truntimePlayerName = playerManager.GetPlayerName(m_iSelectedPlayerId);" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\tfor (int runtimeIndex = 0; runtimeIndex < runtimePlayerIds.Count(); runtimeIndex++)" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\t{" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\t\tif (runtimePlayerIds[runtimeIndex] <= 0) continue;" : "",
        needsPlayerCount ? "\t\t\t\tif (countedPlayerIds.Find(runtimePlayerIds[runtimeIndex]) >= 0) continue;" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\t\tstring currentPlayerName = playerManager.GetPlayerName(runtimePlayerIds[runtimeIndex]);" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\t\tif (currentPlayerName.IsEmpty()) continue;" : "",
        needsPlayerCount ? "\t\t\t\tcountedPlayerIds.Insert(runtimePlayerIds[runtimeIndex]);" : "",
        needsPlayerName ? "\t\t\t\tif (m_iSelectedPlayerId < 0 && runtimePlayerName.IsEmpty()) runtimePlayerName = currentPlayerName;" : "",
        needsPlayerCount ? "\t\t\t\truntimePlayerCount++;" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t\t}" : "",
        (needsPlayerName || needsPlayerCount) ? "\t\t}" : "",
        ...scalarBindings.map(widget => {
          const valueWidgetName = widget.runtimeContract?.valueWidgetName || (widget.layerType === "player" ? `${widget.name}Text` : widget.name);
          if (widget.binding === "player.name") return `\t\tTextWidget ${widget.name}Text = TextWidget.Cast(m_wRoot.FindAnyWidget("${valueWidgetName}"));\n\t\tif (${widget.name}Text) ${widget.name}Text.SetText(!runtimePlayerDataAvailable || runtimePlayerName.IsEmpty() ? "PLAYER UNAVAILABLE" : runtimePlayerName);`;
          if (widget.binding === "player.count") return `\t\tTextWidget ${widget.name}Text = TextWidget.Cast(m_wRoot.FindAnyWidget("${valueWidgetName}"));\n\t\tif (${widget.name}Text) ${widget.name}Text.SetText(runtimePlayerDataAvailable ? runtimePlayerCount.ToString() : "PLAYER DATA UNAVAILABLE");`;
          return `\t\tTextWidget ${widget.name}Text = TextWidget.Cast(m_wRoot.FindAnyWidget("${valueWidgetName}"));\n\t\tif (${widget.name}Text) ${widget.name}Text.SetText(SCR_EditorManagerEntity.IsOpenedInstance(true) ? "GM EDITOR OPEN" : "GM EDITOR CLOSED");`;
        }),
        "\t}",
        ""
      );
      if (!connected) {
        lines.push(
          "\toverride bool OnUpdate(Widget w)",
          "\t{",
          "\t\tif (w != m_wRoot)",
          "\t\t\treturn false;",
          "\t\tm_iRuntimeBindingUpdateCounter++;",
          "\t\tif (m_iRuntimeBindingUpdateCounter >= 30)",
          "\t\t{",
          "\t\t\tm_iRuntimeBindingUpdateCounter = 0;",
          "\t\t\tRefreshRuntimeBindings();",
          "\t\t}",
          "\t\treturn false;",
          "\t}",
          ""
        );
      }
    }
    if (needsWidgetClickHook) {
      lines.push(
        "\tprotected bool OnWidgetClickContract(Widget w, int x, int y, int button)",
        "\t{",
        "\t\t// Generated engine-event seam. Add the target addon's real action here;",
        "\t\t// return true only after the action is actually consumed.",
        "\t\treturn false;",
        "\t}",
        ""
      );
    }
    if (needsReviewHook) {
      lines.push(
        "\tprotected bool OnReviewRequiredCallback(string callbackId, Widget w)",
        "\t{",
        "\t\t// This callback is intentionally not guessed by the Composer. Add the",
        "\t\t// reviewed Workbench/WR implementation in the target addon first.",
        "\t\treturn false;",
        "\t}",
        ""
      );
    }
    if (callbackIds.includes("player.row.teleport")) {
      lines.push(
        "\tprotected void RequestTeleportSelectedPlayer()",
        "\t{",
        "\t\tif (m_iSelectedPlayerId < 0)",
        "\t\t\treturn;",
        "",
        "\t\t// REVIEW REQUIRED: replace this hook with a server-authoritative RplRpc.",
        "\t\t// Validate the local GM permission and the target playerId on the server",
        "\t\t// before changing any entity transform. The Composer never grants authority.",
        "\t}",
        ""
      );
    }
    if (connected) {
      lines.push(
        "\tprotected int FindPlayerRowIndex(Widget widget)",
        "\t{",
        "\t\tWidget current = widget;",
        "\t\twhile (current)",
        "\t\t{",
        "\t\t\tint rowIndex = m_aPlayerRows.Find(current);",
        "\t\t\tif (rowIndex >= 0)",
        "\t\t\t\treturn rowIndex;",
        "\t\t\tcurrent = current.GetParent();",
        "\t\t}",
        "\t\treturn -1;",
        "\t}",
        ""
      );
    }
    lines.push(
      "\toverride bool OnClick(Widget w, int x, int y, int button)",
      "\t{",
      connected ? "\t\tint rowIndex = FindPlayerRowIndex(w);" : "\t\t// Route named buttons and callbacks here.",
      connected ? "\t\tif (rowIndex >= 0)" : "",
      connected ? "\t\t{" : "",
      connected ? "\t\t\tOnPlayerRowClicked(m_aPlayerRowIds[rowIndex]);" : "",
      connected ? "\t\t\treturn true;" : "",
      connected ? "\t\t}" : "",
      ...callbackRoutes,
      "\t\treturn false;",
      "\t}",
      "}",
      ""
    );
    return lines.filter(line => line !== "").join("\n");
  }

  function makeWorkbenchPlan() {
    const layoutName = safeName(state.handoff.layoutName) || "bushwar-composer-layout";
    const classStem = layoutName.split(/[-_]+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("") || "BushwarComposerLayout";
    const visibleLayers = state.layers.filter(layer => layer.type !== "reference");
    const widgets = visibleLayers.map((layer, index, layers) => workbenchWidgetFor(layer, index, layers));
    // Keep callback-only controls in the generated controller as well as
    // data-bound widgets. A button that only performs an engine action still
    // needs a named route in EnforceScript; filtering on binding alone made
    // those functions disappear from the Workbench handoff.
    const runtimeScaffolds = widgets.filter(widget => widget.binding || widget.functionId).map(widget => ({
      binding: widget.binding,
      layerType: widget.layerType,
      properties: widget.properties,
      runtimeContract: widget.runtimeContract,
      recipeCallbacks: widget.recipeCallbacks,
      recipeId: widget.runtimeContract?.recipeId,
      workbenchRecipe: widget.runtimeContract?.workbenchRecipe,
      nativeTree: widget.runtimeContract?.nativeTree,
      contract: widget.bindingContract,
      functionId: widget.functionId || undefined,
      functionContract: widget.functionContract,
      functionTargetWidgetName: widget.functionTargetWidgetName,
      availableCallbacks: widget.availableCallbacks,
      coreLibraryId: widget.coreLibraryId,
      coreLibraryEntryId: widget.coreLibraryEntryId,
      sourceBacked: !!widget.source,
      sourcePath: widget.source,
      sourceChildVerification: widget.sourceChildVerification,
      widgetName: widget.name,
      controllerClass: `BWUIC_${classStem}Controller`,
      layoutPath: `UI/layouts/${layoutName}.layout`,
      rowLayoutPath: widget.binding === "player.list.connected" ? (widget.rowLayoutPath || `UI/layouts/${layoutName}-player-row.layout`) : undefined,
      rowLayoutCreateRequest: widget.binding === "player.list.connected" ? {
        name: `${layoutName}-player-row`,
        description: "Native row scaffold for a connected-player callback. Keep the playerId in controller state, not in display text.",
        sourcePath: widget.rowLayoutPath || undefined,
        root: { type: "Button", name: "Row", children: [{ type: "Text", name: "NameText", props: { Text: "", Color: "1 1 1 1" }, slot: { sizeMode: "FILL", padding: "12 6 12 6" } }] }
      } : undefined,
      requiredWidgetNames: widget.requiredNamedChildren,
      valueWidgetName: widget.runtimeContract?.valueWidgetName,
      implementation: widget.binding === "player.list.connected"
        ? "Read PlayerManager.GetPlayers(playerIds) (the API marks this parameter out), resolve GetPlayerName(playerId), skip empty names, create one row per valid name under the generated list widget, set TextWidget.SetExactFontSize from the Composer font contract, and refresh when the roster signature changes. If a row callback is assigned, carry the actual playerId alongside the row."
        : "Implement the listed engine contract in the generated controller; the Composer does not invent callbacks or authority."
    }));
    const controllerClass = `BWUIC_${classStem}Controller`;
    const controllerPath = `Scripts/Game/UI/${controllerClass}.c`;
    const controllerSource = controllerSourceFor(classStem, layoutName, runtimeScaffolds);
    return {
      format: workbenchPlanFormat,
      schema: workbenchPlanSchema,
      generatedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      target: {
        kind: state.handoff.target,
        layoutPath: `UI/layouts/${layoutName}.layout`,
        rootWidget: "m_wRoot",
        controllerClass,
        controllerPath
      },
      controllerClass,
      controllerPath,
      controllerSource,
      root: { width: state.canvas.width, height: state.canvas.height, widgetType: "FrameWidget", name: "m_wRoot" },
      widgets,
      nativeProfileSchema: 1,
      nativeWidgetClasses: [...new Set(widgets.map(widget => widget.widgetType))].join(","),
      sourceBackedWidgets: widgets.filter(widget => widget.source).length,
      sourceChildVerificationRequired: widgets.filter(widget => widget.sourceChildVerification === "manual-required").length,
      engineContext: {
        format: engineContextFormat,
        schema: 1,
        source: state.engineContext?.source || "none",
        capturedAt: state.engineContext?.capturedAt || "",
         engineVersion: state.engineContext?.engineVersion || "",
         snapshotLoaded: hasEngineContextSnapshot(),
         playerCountKnown: hasEngineContextSnapshot(),
         playerCount: enginePlayers().length,
        previewPlayers: enginePlayers().map(player => ({ id: player.id, name: player.name })),
        runtimeAuthoritative: true,
        previewPolicy: "snapshot-only",
        runtimeSource: "PlayerManager / SCR_EditorManagerEntity queried by generated controller",
        note: "Preview values are optional evidence only. The generated controller must re-query PlayerManager in Reforger at runtime; no browser value is copied into a live row."
      },
      bindings: widgets.filter(widget => widget.binding).map(widget => ({ id: widget.binding, contract: widget.bindingContract })),
      callbacks: widgets.filter(widget => widget.functionId).map(widget => ({ id: widget.functionId, contract: widget.functionContract })),
      runtimeScaffolds,
      resources: [...new Set(visibleLayers.map(layer => layer.resourcePath).filter(Boolean))],
      layoutCreateRequest: {
        name: layoutName,
        description: "Generated UI Composer scaffold. Open and resave in Workbench Layout Editor before production use.",
        rootSize: { width: state.canvas.width, height: state.canvas.height, source: "Composer canvas; set the same root size in Layout Editor before judging pixel bounds." },
        root: { type: "Frame", name: "m_wRoot", props: { Color: "0 0 0 0" }, children: visibleLayers.map(layoutCreateNodeFor) },
        note: "This is a safe native-widget scaffold for the Enfusion layout_create tool. Each palette element carries its mapped Enfusion widget class (ButtonWidgetClass, TextWidgetClass, ImageWidgetClass, ProgressBarWidgetClass, EditBoxWidgetClass, CheckBoxWidgetClass, or layout container). Pixel-authored widgets use point anchors with OffsetLeft/OffsetTop and negative OffsetRight/OffsetBottom bounds, matching the shipped BUSHWAR GM layouts and preserving the Composer canvas at the exported root size. Source-backed widgets also carry source/sourceBacked metadata; drag that registered WLib/vanilla layout into the target in Layout Editor and preserve its named children. Open and resave in Workbench Layout Editor before production."
      },
      safety: {
        layoutAuthoring: "Open the new layout in Workbench Layout Editor. Do not hand-edit .layout XML; Workbench owns widget GUIDs and serialization.",
        visualReferences: "Reference-board images are intentionally excluded from this import plan. Keep them in the .bwui project bundle.",
        nextSteps: [
          "Use layoutCreateRequest with the Enfusion layout_create tool to generate a native-widget scaffold in an isolated addon, or create the target GUI layout manually at the listed layoutPath.",
          `Open the scaffold in Layout Editor, set root size to ${state.canvas.width} × ${state.canvas.height}, and confirm each mapped native widget class before replacing source-backed scaffolds with their listed WLib/vanilla layout prefabs using the plan's names, anchors, and bounds.`,
          "Use Workbench's Generate Class from Layout after naming script-bound widgets with m_w prefixes.",
          "Run Layout Editor Live Preview at supported resolutions, then wire gameplay behaviour in the generated controller using runtimeScaffolds.requiredWidgetNames."
        ]
      }
    };
  }

  function exportWorkbenchPlan() {
    const plan = makeWorkbenchPlan();
    download(`${safeName(state.title)}-workbench-import-plan.json`, JSON.stringify(plan, null, 2), "application/json");
    setStatus(`Workbench import plan exported · ${plan.widgets.length} UI widget${plan.widgets.length === 1 ? "" : "s"}`);
  }

  function exportWorkbenchBundle() {
    const plan = makeWorkbenchPlan();
    const bundle = {
      format: workbenchBundleFormat,
      schema: 1,
      createdAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      design: makeBundle("project"),
      plan,
      controller: { path: plan.controllerPath, source: plan.controllerSource },
      engineContext: plan.engineContext,
      instructions: [
        "Validate plan.format/schema in the disposable Workbench addon before production use.",
        "Use plan.layoutCreateRequest with layout_create or author the final layout in Workbench Layout Editor.",
        "Copy controller.source to controller.path, compile, and keep PlayerManager runtime reads authoritative.",
        "Reference images stay in design; no vanilla Reforger assets are redistributed."
      ]
    };
    download(`${safeName(state.title)}-workbench-handoff.json`, JSON.stringify(bundle, null, 2), "application/json");
    setStatus(`Complete Workbench handoff exported · ${plan.widgets.length} widget${plan.widgets.length === 1 ? "" : "s"} + controller + context contract`);
  }

  function exportControllerScaffold() {
    const plan = makeWorkbenchPlan();
    download(plan.controllerPath.split("/").pop(), plan.controllerSource, "text/plain");
    setStatus(`Controller scaffold exported · ${plan.controllerClass}`);
  }

  async function copyLayoutCreateRequest() {
    const request = makeWorkbenchPlan().layoutCreateRequest;
    try {
      await navigator.clipboard.writeText(JSON.stringify(request, null, 2));
      setStatus("Layout scaffold request copied · use it in an isolated Workbench addon first");
    } catch {
      download(`${safeName(state.title)}-layout-scaffold-request.json`, JSON.stringify(request, null, 2), "application/json");
      setStatus("Clipboard unavailable; layout scaffold request downloaded");
    }
  }

  async function copySpec() {
    const spec = {
      format: "BUSHWAR UI Composer Workbench handoff",
      appVersion: APP_VERSION,
      canvas: `${state.canvas.width}x${state.canvas.height}`,
      baseScene: { name: state.canvas.baseScene, visible: state.canvas.baseSceneVisible, opacity: state.canvas.baseSceneOpacity },
      references: { embeddedAssets: assetSummary().count, note: "Reference images are preserved in .bwui project/template bundles; do not distribute vanilla game assets." },
      engineContext: {
        source: state.engineContext?.source || "none",
        capturedAt: state.engineContext?.capturedAt || "",
        engineVersion: state.engineContext?.engineVersion || "",
        playerCount: enginePlayers().length,
        previewPlayers: enginePlayers().map(player => ({ id: player.id, name: player.name })),
        runtimeAuthoritative: true
      },
      bindings: state.layers.filter(layer => layer.binding).map(layer => ({ id: layer.binding, contract: bindingFor(layer) })),
      callbacks: state.layers.filter(layer => layer.functionId).map(layer => ({ id: layer.functionId, contract: functionFor(layer) })),
      bundleIntegrity: bundleIntegrity(state),
      note: "Anchors are normalized left/top/right/bottom. Pixel bounds remain the visual authority. Build the final .layout in Workbench Layout Editor and validate Live Preview at target resolutions.",
      layers: state.layers.map(layer => ({
        name: layer.name, type: layer.type,
        boundsPx: { left: Math.round(layer.x), top: Math.round(layer.y), width: Math.round(layer.w), height: Math.round(layer.h), right: Math.round(layer.x + layer.w), bottom: Math.round(layer.y + layer.h) },
        anchors: [layer.x / state.canvas.width, layer.y / state.canvas.height, (layer.x + layer.w) / state.canvas.width, (layer.y + layer.h) / state.canvas.height].map(value => Number(value.toFixed(4))),
        style: { fill: layer.fill, color: layer.color, border: layer.borderColor, opacity: layer.opacity, fontSize: layer.fontSize, locked: layer.locked }, text: layer.text,
        reforgerResource: layer.resourcePath || undefined, binding: layer.binding || undefined, bindingContract: bindingFor(layer) || undefined, functionId: layer.functionId || undefined, functionContract: functionFor(layer) || undefined, referenceName: layer.referenceName || undefined
      }))
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
      setStatus("Design specification copied");
    } catch {
      download(`${safeName(state.title)}-spec.json`, JSON.stringify(spec, null, 2), "application/json");
      setStatus("Clipboard unavailable; specification downloaded");
    }
  }

  async function exportPng() {
    const canvas = document.createElement("canvas");
    canvas.width = state.canvas.width;
    canvas.height = state.canvas.height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#53636a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const scene = baseScenes[state.canvas.baseScene] || baseScenes.blank;
    if (scene.source && state.canvas.baseSceneVisible) {
      const sceneImage = await loadImage(scene.source);
      context.globalAlpha = state.canvas.baseSceneOpacity;
      context.drawImage(sceneImage, 0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
    }
    if (state.canvas.background) {
      const image = await loadImage(state.canvas.background);
      context.globalAlpha = state.canvas.backgroundOpacity;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
    }
    for (const layer of state.layers) if (layer.visible) await drawLayer(context, layer);
    canvas.toBlob(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${safeName(state.title)}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 5000);
    }, "image/png");
    setStatus("PNG preview exported");
  }

  async function drawLayer(ctx, layer) {
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    const displayText = runtimeDisplayValue(layer);
    if ((layer.type === "table" || layer.type === "player") && isConnectedPlayersBinding(layer)) {
      drawConnectedPlayerScaffold(ctx, layer, layer.type === "player" ? "player" : "table");
      ctx.restore();
      return;
    }
    if ((layer.type === "image" || layer.type === "reference") && layer.image) {
      const image = await loadImage(layer.image);
      ctx.drawImage(image, layer.x, layer.y, layer.w, layer.h);
    } else if (!["text", "reforger"].includes(layer.type)) {
      roundedRect(ctx, layer.x, layer.y, layer.w, layer.h, layer.radius);
      ctx.fillStyle = layer.fill;
      ctx.fill();
      if (layer.type !== "divider") { ctx.strokeStyle = layer.borderColor; ctx.lineWidth = 1; ctx.stroke(); }
    }
    ctx.fillStyle = layer.color;
    ctx.font = `${layer.type === "button" || layer.type === "badge" ? "700" : "500"} ${layer.fontSize}px Bahnschrift, Segoe UI, sans-serif`;
    ctx.textBaseline = "middle";
    if (["text", "button", "badge"].includes(layer.type)) {
      ctx.textAlign = layer.type === "text" ? "left" : "center";
      ctx.fillText(displayText, layer.type === "text" ? layer.x : layer.x + layer.w / 2, layer.y + layer.h / 2, layer.w - 16);
    } else if (layer.type === "icon") {
      ctx.save(); ctx.translate(layer.x + layer.w / 2, layer.y + layer.h / 2); ctx.rotate(Math.PI / 4); ctx.strokeStyle = layer.color; ctx.lineWidth = 5; const size = Math.min(layer.w, layer.h) * .35; ctx.strokeRect(-size / 2, -size / 2, size, size); ctx.restore();
    } else if (layer.type === "player") {
      ctx.fillStyle = layer.accent; ctx.beginPath(); ctx.arc(layer.x + 29, layer.y + layer.h / 2, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = layer.color; ctx.textAlign = "left"; ctx.fillText(displayText, layer.x + 58, layer.y + layer.h / 2, layer.w - 230);
      ctx.font = `700 ${Math.max(10, layer.fontSize * .68)}px Bahnschrift, sans-serif`; ctx.fillText("BRING ME   |   BRING PLAYER", layer.x + layer.w - 192, layer.y + layer.h / 2, 182);
    } else if (layer.type === "reforger") {
      drawReforgerPreview(ctx, layer);
    } else if (["window", "dialog", "prompt", "toast", "context", "tooltip", "tabs", "table", "toolbar", "progress", "input", "toggle", "assetcard", "squadtile", "inventory", "categorybar"].includes(layer.type)) {
      ctx.fillStyle = layer.accent;
      ctx.fillRect(layer.x, layer.y, layer.w, Math.min(5, layer.h));
      ctx.fillStyle = layer.color;
      ctx.textAlign = "left";
      ctx.font = `700 ${layer.fontSize}px Bahnschrift, Segoe UI, sans-serif`;
      ctx.fillText(displayText, layer.x + 14, layer.y + Math.min(layer.h / 2, 30), layer.w - 28);
    }
    ctx.restore();
  }

  function drawConnectedPlayerScaffold(ctx, layer, mode = "table") {
    const x = layer.x, y = layer.y, w = layer.w, h = layer.h;
    const players = enginePlayers();
    const selected = selectedPreviewPlayer(layer);
    ctx.fillStyle = layer.fill || "#172126";
    roundedRect(ctx, x, y, w, h, layer.radius || 0);
    ctx.fill();
    ctx.strokeStyle = layer.borderColor || "#46565d";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    if (mode === "player") {
      const player = players[0];
      if (player) {
        ctx.fillStyle = "#202a2f";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = layer.color || "#ffffff";
        ctx.font = `600 ${Math.max(12, layer.fontSize)}px Bahnschrift, Segoe UI, sans-serif`;
        ctx.fillText(player.name, x + 12, y + h / 2, w - 24);
      } else {
        ctx.fillStyle = "#8fa0a7";
        ctx.font = `italic ${Math.max(10, layer.fontSize * .72)}px Bahnschrift, Segoe UI, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(hasEngineContextSnapshot() ? "WORKBENCH REPORTS 0 PLAYERS" : "NO WORKBENCH PLAYER SNAPSHOT", x + w / 2, y + h / 2, w - 20);
      }
      return;
    }
    const countHeight = Math.max(22, Math.round(h * .12));
    const selectionHeight = Math.max(22, Math.round(h * .12));
    ctx.fillStyle = layer.accent || "#18bce8";
    ctx.font = `700 ${Math.max(10, layer.fontSize * .72)}px Bahnschrift, Segoe UI, sans-serif`;
    ctx.fillText(hasEngineContextSnapshot() ? `${players.length} CONNECTED` : "ENGINE SNAPSHOT REQUIRED", x + 14, y + countHeight / 2, w - 28);
    ctx.fillStyle = layer.color || "#9eabb0";
    ctx.fillText(`SELECTED: ${selected ? selected.name : "NONE"}`, x + 14, y + countHeight + selectionHeight / 2, w - 28);
    ctx.strokeStyle = "#344249";
    ctx.beginPath();
    ctx.moveTo(x, y + countHeight + selectionHeight);
    ctx.lineTo(x + w, y + countHeight + selectionHeight);
    ctx.stroke();
    const rowTop = y + countHeight + selectionHeight + 10;
    const rowHeight = Math.max(34, Math.min(54, Math.round(layer.fontSize * 2.4)));
    players.forEach((player, index) => {
      const rowY = rowTop + index * (rowHeight + 6);
      if (rowY + rowHeight > y + h) return;
      const active = selected && Number(selected.id) === Number(player.id);
      ctx.fillStyle = active ? "#2b3c43" : "#202a2f";
      ctx.fillRect(x + 12, rowY, w - 24, rowHeight);
      ctx.strokeStyle = active ? (layer.accent || "#f47b36") : "#39474d";
      ctx.strokeRect(x + 12, rowY, w - 24, rowHeight);
      ctx.fillStyle = layer.color || "#ffffff";
      ctx.font = `600 ${Math.max(11, layer.fontSize)}px Bahnschrift, Segoe UI, sans-serif`;
      ctx.fillText(player.name, x + 24, rowY + rowHeight / 2, w - 48);
    });
    if (!players.length) {
      ctx.fillStyle = "#8fa0a7";
      ctx.font = `italic ${Math.max(10, layer.fontSize * .72)}px Bahnschrift, Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("NO WORKBENCH PLAYER SNAPSHOT", x + w / 2, rowTop + 22, w - 24);
    }
  }

  function drawReforgerPreview(ctx, layer) {
    const visual = layer.reforgerVisual || reforgerVisualFor(layer);
    const x = layer.x, y = layer.y, w = layer.w, h = layer.h, accent = layer.accent || "#18bce8";
    ctx.fillStyle = "#17242a";
    ctx.fillRect(x, y, w, h);
    if (visual === "button") {
      ctx.fillStyle = "#303d43"; ctx.fillRect(x, y, w, h - 4); ctx.fillStyle = accent; ctx.fillRect(x, y + h - 4, w, 4);
      ctx.fillStyle = "#f2f7f8"; ctx.textAlign = "center"; ctx.font = `700 ${Math.max(13, layer.fontSize)}px Bahnschrift, sans-serif`; ctx.fillText(layer.text, x + w / 2, y + h / 2, w - 24);
      return;
    }
    if (visual === "map") {
      ctx.fillStyle = "#25473e"; ctx.fillRect(x, y, w, h); ctx.strokeStyle = "#538272"; ctx.lineWidth = 2;
      for (let offset = -h; offset < w; offset += 26) { ctx.beginPath(); ctx.moveTo(x + offset, y); ctx.lineTo(x + offset + h, y + h); ctx.stroke(); }
      ctx.fillStyle = accent; ctx.font = `700 ${Math.max(22, h * .18)}px Bahnschrift, sans-serif`; ctx.textAlign = "center"; ctx.fillText("⌖", x + w / 2, y + h / 2, w - 12);
      return;
    }
    if (visual === "icon-atlas") {
      const cellW = (w - 16) / 3, cellH = (h - 16) / 2; ctx.fillStyle = "#0f191d"; ctx.fillRect(x, y, w, h);
      for (let row = 0; row < 2; row++) for (let column = 0; column < 3; column++) { ctx.strokeStyle = "#607982"; ctx.strokeRect(x + 6 + column * (cellW + 2), y + 6 + row * (cellH + 2), cellW, cellH); }
      return;
    }
    if (visual === "tabs") {
      const labels = [layer.text, "DETAILS", "OPTIONS"]; ctx.fillStyle = "#151f23"; ctx.fillRect(x, y, w, h);
      labels.forEach((label, index) => { const left = x + index * w / labels.length; ctx.strokeStyle = "#46575e"; ctx.strokeRect(left, y, w / labels.length, h); if (!index) { ctx.fillStyle = accent; ctx.fillRect(left, y + h - 4, w / labels.length, 4); } ctx.fillStyle = index ? "#9cadb3" : "#f5f8f8"; ctx.font = `700 ${Math.max(10, layer.fontSize * .7)}px Bahnschrift, sans-serif`; ctx.textAlign = "center"; ctx.fillText(label, left + w / labels.length / 2, y + h / 2, w / labels.length - 8); });
      return;
    }
    ctx.fillStyle = accent; ctx.fillRect(x, y, 4, h);
    ctx.fillStyle = "#eef5f7"; ctx.textAlign = "left"; ctx.font = `700 ${Math.max(12, layer.fontSize)}px Bahnschrift, sans-serif`; ctx.fillText(layer.text, x + 14, y + Math.min(h / 2, 30), w - 28);
  }

  function roundedRect(ctx, x, y, w, h, radius) {
    const r = Math.min(radius, w / 2, h / 2);
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  }

  function loadImage(source) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source; }); }
  function download(name, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
  function safeName(value) { return (value || "reforger-ui").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase(); }
  function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
  function setStatus(message) { $("#statusText").textContent = message; }

  function normalizeEngineContext(value) {
    if (!value || value.format !== engineContextFormat || Number(value.schema) !== 1) throw new Error("Unsupported Workbench context format");
    const players = normalizeEnginePlayers(value.players);
    return {
      schema: 1,
      source: "workbench",
      capturedAt: String(value.capturedAt || new Date().toISOString()),
      engineVersion: String(value.engineVersion || ""),
      editorOpen: typeof value.editorOpen === "boolean" ? value.editorOpen : null,
      players,
      note: String(value.note || "Imported from a trusted Workbench runtime snapshot.")
    };
  }

  function importEngineContext(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        checkpoint();
        state.engineContext = normalizeEngineContext(JSON.parse(reader.result));
        render();
        setStatus(`Workbench context imported · ${engineContextLabel()}`);
      } catch (error) {
        alert(`Could not import Workbench context: ${error.message}`);
      }
    };
    reader.readAsText(file);
  }

  function renderReforgerCatalog() {
    const vanillaCatalog = window.BUSHWAR_REFORGER_CATALOG || { entries: [], disclaimer: "Catalogue unavailable." };
    const coreCatalog = window.BUSHWAR_REFORGER_CORE_LIBRARY || { entries: [], disclaimer: "" };
    const catalog = {
      entries: [...coreCatalog.entries, ...vanillaCatalog.entries],
      disclaimer: `${coreCatalog.disclaimer} ${vanillaCatalog.disclaimer}`.trim()
    };
    const root = $("#reforgerCatalog");
    const query = $("#componentSearch").value.trim().toLowerCase();
    const family = $("#catalogCategoryFilter").value;
    root.innerHTML = "";
    let visible = 0;
    catalog.entries.forEach(item => {
      const haystack = `${item.name} ${item.path} ${item.category} ${item.kind}`.toLowerCase();
      const matchesFamily = family === "all" || item.category.startsWith(family);
      if (!matchesFamily || (query && !haystack.includes(query))) return;
       visible += 1;
       const button = document.createElement("button");
       const visual = reforgerVisualFor(item);
       const nativeLabel = [item.nativeWidgetClass || "LayoutResource", item.nativeChildHint ? `child hint: ${item.nativeChildHint}` : ""].filter(Boolean).join(" · ");
       const callbackHints = (item.functionHints || []).join(" · ");
       button.className = "catalog-entry";
       button.title = `Add ${nativeLabel} reference for ${item.path}`;
       button.innerHTML = `<span class="catalog-preview preview-${visual}">${escapeHtml(item.preview)}</span><span class="catalog-copy"><strong>${escapeHtml(item.name.replace(/\.layout$|\.edds$/i, ""))}</strong><small>${escapeHtml(nativeLabel)}</small><small>${escapeHtml(item.path)}</small>${callbackHints ? `<small class="catalog-actions">Actions: ${escapeHtml(callbackHints)}</small>` : ""}</span>`;
       button.addEventListener("click", () => addLayer(item.id === "core.admin-panel" ? "table" : item.id === "core.player-row" ? "player" : "reforger", {
         name: item.name.replace(/\.layout$|\.edds$/i, ""), text: item.name.replace(/\.layout$|\.edds$/i, ""), resourcePath: item.resourceReference || item.path,
         catalogCategory: item.category, catalogKind: item.kind, catalogPreview: item.preview,
         catalogNativeWidgetClass: item.nativeWidgetClass || "LayoutResource", catalogNativeChildHint: item.nativeChildHint || "",
         catalogWorkbenchAction: item.workbenchAction || "Use this source in Workbench Layout Editor", reforgerVisual: visual,
         coreLibraryId: item.coreLibraryId || undefined,
         coreLibraryEntryId: item.id || undefined,
         rowLayoutPath: item.rowLayoutPath || undefined,
         nativeTree: item.nativeTree || undefined,
         binding: item.defaultBinding || undefined,
         functionId: item.defaultFunction || undefined,
         functionTargetWidgetName: item.defaultFunctionTarget || undefined,
         runtimeValueWidgetName: item.runtimeValueWidgetName || undefined,
         functionHints: item.functionHints ? clone(item.functionHints) : undefined,
         requiredChildren: item.requiredChildren ? clone(item.requiredChildren) : undefined,
         runtimeContracts: item.runtimeContracts ? clone(item.runtimeContracts) : undefined,
         ...reforgerPlacementFor(item, visual)
       }));
      root.append(button);
    });
    $("#catalogCount").textContent = `(${visible}/${catalog.entries.length})`;
    $("#catalogNote").textContent = catalog.disclaimer;
  }

  function renderEngineRecipes() {
    const catalog = recipeCatalog();
    const root = $("#reforgerRecipes");
    if (!root) return;
    root.innerHTML = "";
    catalog.entries.forEach(recipe => {
      const button = document.createElement("button");
      button.className = "recipe-entry";
      button.title = `${recipe.description} Native tree: ${recipe.nativeTree}`;
      const callbacks = (recipe.callbacks || []).join(" · ") || "no callback selected";
      button.innerHTML = `<span class="recipe-icon">⌘</span><span class="catalog-copy"><strong>${escapeHtml(recipe.label)}</strong><small>${escapeHtml(recipe.category)} · ${escapeHtml(recipe.workbenchRecipe || "custom")}</small><small>${escapeHtml(recipe.nativeTree)}</small><small>Callbacks: ${escapeHtml(callbacks)}</small></span>`;
      button.addEventListener("click", () => applyEngineRecipe(recipe.id));
      root.append(button);
    });
    $("#recipeCount").textContent = `(${catalog.entries.length})`;
    $("#recipeNote").textContent = catalog.disclaimer;
  }

  function applyEngineRecipe(id) {
    const recipe = recipeCatalog().byId(id);
    if (!recipe) return;
    if (recipe.template) {
      applyTemplate(recipe.template);
      state.layers.forEach(layer => Object.assign(layer, {
        engineRecipeId: recipe.id,
        workbenchRecipe: recipe.workbenchRecipe,
        nativeTree: recipe.nativeTree,
        recipeCallbacks: clone(recipe.callbacks || [])
      }));
      const runtimeLayer = state.layers.find(layer => layer.binding === "player.list.connected");
      if (runtimeLayer && recipe.requiredChildren) runtimeLayer.requiredChildren = clone(recipe.requiredChildren);
      render();
      setStatus(`${recipe.label} loaded · runtime PlayerManager contract attached`);
      return;
    }
    checkpoint();
    state.layers = [];
    selectedId = null;
    state.canvas.baseScene = "blank";
    state.canvas.baseSceneVisible = true;
    state.canvas.width = 1920;
    state.canvas.height = 1080;
    (recipe.layers || []).forEach((definition, index) => {
      const layer = makeLayer(definition.type, {
        ...definition,
        engineRecipeId: recipe.id,
        workbenchRecipe: recipe.workbenchRecipe,
        nativeTree: recipe.nativeTree,
        ...(index === 0 && recipe.requiredChildren ? { requiredChildren: clone(recipe.requiredChildren) } : {}),
        recipeCallbacks: clone(recipe.callbacks || []),
        functionId: definition.functionId || ""
      });
      state.layers.push(layer);
    });
    selectedId = state.layers[0]?.id || null;
    syncControls();
    render();
    setStatus(`${recipe.label} loaded · named Workbench children and callback contract attached`);
  }

  function addReferenceFiles(files) {
    const list = [...files].filter(file => file?.type.startsWith("image/"));
    if (!list.length) return;
    Promise.all(list.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve({ data: reader.result, name: file.name }); reader.onerror = reject; reader.readAsDataURL(file);
    }))).then(images => {
      checkpoint();
      const references = images.map(({ data, name }) => makeLayer("reference", {
        name: `REF · ${name}`, referenceName: name, image: data, x: 0, y: 0, w: state.canvas.width, h: state.canvas.height, opacity: 0.48, locked: true
      }));
      state.layers.unshift(...references);
      selectedId = references.at(-1)?.id || null;
      render(); setStatus(`${references.length} locked visual reference${references.length === 1 ? "" : "s"} added to the board`);
    }).catch(() => setStatus("One or more visual references could not be read"));
  }

  function runtimeContractAuditRows() {
    const plan = makeWorkbenchPlan();
    const widgetsById = new Map(plan.widgets.map(widget => [widget.id, widget]));
    return state.layers.filter(layer => layer.binding || layer.functionId).map(layer => {
      const binding = bindingFor(layer);
      const callback = functionFor(layer);
      const widget = widgetsById.get(layer.id);
      const issues = [];
      if (!widget) issues.push("hidden layer is not exported");
      if (layer.binding && !binding) issues.push("unknown engine binding");
      if (binding?.targetKinds && !binding.targetKinds.includes(layer.type)) issues.push("binding target mismatch");
      if (layer.functionId && !callback) issues.push("unknown callback contract");
      if (callback && !callback.targetKinds.includes(layer.type)) issues.push("callback target mismatch");
      if (callback?.requiresBinding?.some(bindingId => layer.binding !== bindingId)) issues.push("required binding missing");
      const status = issues.length ? "error" : callback?.implementation?.status === "review-required" ? "review" : "ready";
      return {
        layer: layer.name || layer.id,
        target: widget?.runtimeContract?.valueWidgetName || widget?.name || "not exported",
        source: binding ? `${binding.sourceClass}: ${binding.sourceMethods.join(" + ")} · ${binding.sourceOfTruth || "live engine"} · empty=${binding.emptyValuePolicy || "engine-defined"}` : "Client UI event",
        callback: callback?.label || "No callback assigned",
        authority: callback?.authority || binding?.authority || "client-local",
        status,
        detail: issues.length ? issues.join(", ") : callback?.implementation?.status === "review-required" ? "Generated hook only; implement and review authority in the target addon." : "Generated route present"
      };
    });
  }

  function runtimeContractAuditMarkup() {
    const rows = runtimeContractAuditRows();
    if (!rows.length) return `<div class="contract-audit empty"><b>Runtime contract audit</b><span>No engine binding or callback assigned; this design remains visual-only.</span></div>`;
    const body = rows.map(row => `<div class="contract-row"><span class="contract-status ${row.status}">${row.status.toUpperCase()}</span><span><b>${escapeHtml(row.layer)}</b><small>target: ${escapeHtml(row.target)}</small></span><span><b>Data</b><small>${escapeHtml(row.source)}</small></span><span><b>Action</b><small>${escapeHtml(row.callback)}</small></span><span><b>Authority</b><small>${escapeHtml(row.authority)} · ${escapeHtml(row.detail)}</small></span></div>`).join("");
    return `<div class="contract-audit"><b>Runtime contract audit</b><span class="hint">This is the exact route the schema-3 handoff describes. READY means the Composer generated a route; REVIEW means the target addon still owns the implementation or authority decision.</span><div class="contract-rows">${body}</div></div>`;
  }

  function validateHandoff() {
    const warnings = [];
    const references = state.layers.filter(layer => layer.type === "reference");
    const refAssets = references.filter(layer => layer.image).length;
    const importableLayers = state.layers.filter(layer => layer.type !== "reference");
    if (state.canvas.width < 1920 || state.canvas.height < 1080) warnings.push("Canvas is below Workbench's documented 1920 × 1080 minimum root size.");
    if (references.some(layer => !layer.locked)) warnings.push("One or more visual-reference layers are unlocked and can be moved accidentally.");
    if (references.some(layer => !layer.image)) warnings.push("One or more visual-reference layers have no embedded image.");
    if (state.layers.some(layer => layer.type === "reforger" && !layer.resourcePath)) warnings.push("A Reforger reference card is missing its resource path.");
    if (state.layers.some(layer => layer.resourcePath && !sourceBackedLayer(layer))) warnings.push("A source reference is not a .layout resource; choose a registered Workbench layout prefab or keep the layer as a design reference.");
    if (state.layers.some(layer => layer.type === "player" && !layer.binding)) warnings.push("One or more player rows are design-only; assign Connected players (engine) to read actual PlayerManager values at runtime.");
    const widgetNameCounts = new Map();
    importableLayers.forEach((layer, index) => {
      const baseName = nativeWidgetBaseName(layer, index);
      widgetNameCounts.set(baseName, (widgetNameCounts.get(baseName) || 0) + 1);
    });
    const duplicateWidgetNames = [...widgetNameCounts.entries()].filter(([, count]) => count > 1).map(([name]) => name);
    if (duplicateWidgetNames.length) warnings.push(`Duplicate native widget names will be suffixed in the export (${duplicateWidgetNames.join(", ")}); rename layers if you need stable hand-authored FindAnyWidget names.`);
    const staticPlayerLabels = state.layers.filter(layer => {
      const label = `${layer.name || ""} ${layer.text || ""}`.toLowerCase();
      return !layer.binding && /\b(player\s+(alpha|bravo|charlie)|sgt\.?\s*james)\b/.test(label);
    });
    if (staticPlayerLabels.length) warnings.push("Static player-name text was found without an engine binding; replace it with Connected players (engine) so Workbench cannot show fake or empty rows.");
    state.layers.forEach(layer => {
      if (layer.binding && !bindingFor(layer)) warnings.push(`${layer.name || "A layer"} references an unknown engine binding.`);
      const binding = bindingFor(layer);
      if (layer.binding && binding && binding.targetKinds && !binding.targetKinds.includes(layer.type)) warnings.push(`${layer.name || "A layer"} uses ${binding.label} on a ${layer.type} widget; choose a compatible widget type before handoff.`);
      if (sourceBackedLayer(layer) && layer.binding === "player.list.connected" && layer.coreLibraryId !== window.BUSHWAR_REFORGER_CORE_LIBRARY?.projectId) warnings.push(`${layer.name || "A connected-player table"} uses a source-backed layout; confirm Count/Selection/Scroll/List and row NameText names in Workbench before compiling the generated controller.`);
      else if (sourceBackedLayer(layer) && layer.binding && layer.coreLibraryId !== window.BUSHWAR_REFORGER_CORE_LIBRARY?.projectId) warnings.push(`${layer.name || "A runtime layer"} uses a source-backed layout; confirm the bound value child name and widget type in Workbench${layer.runtimeValueWidgetName ? ` (plan override: ${layer.runtimeValueWidgetName})` : " or enter it in the Runtime value child name field"} before compiling the generated controller.`);
      if (layer.functionId && !functionFor(layer)) warnings.push(`${layer.name || "A layer"} references an unknown callback contract.`);
      const callback = functionFor(layer);
      if (layer.functionId && callback && !callback.targetKinds.includes(layer.type)) warnings.push(`${layer.name || "A layer"} uses a callback that is not defined for its widget type.`);
      if (callback?.requiresBinding?.some(bindingId => layer.binding !== bindingId)) warnings.push(`${layer.name || "A layer"} uses ${callback.label} without its required ${callback.requiresBinding.join(" / ")} engine binding.`);
      if (callback?.implementation?.status === "review-required") warnings.push(`${layer.name || "A layer"} uses ${callback.label}; the export includes a review hook, not server/admin authority.`);
      if ((layer.binding || layer.functionId) && !layer.visible) warnings.push(`${layer.name || "A runtime layer"} is hidden and will not be exported into the Workbench layout.`);
      if (layer.functionId === "player.row.select" && layer.binding !== "player.list.connected") warnings.push(`${layer.name || "The player row"} needs the Connected players engine binding before its playerId callback can be wired.`);
      if (layer.binding === "player.list.connected" && !layer.functionId) warnings.push(`${layer.name || "Connected players"} reads real PlayerManager rows but has no row callback; add Connected-player row selected if clicking a player should carry its ID.`);
    });
    const runtimeBoundLayers = state.layers.filter(layer => layer.binding || layer.functionId);
    if (runtimeBoundLayers.length) {
      const generatedSource = makeWorkbenchPlan().controllerSource;
      if (state.layers.some(layer => layer.binding === "player.list.connected") && (!generatedSource.includes("playerManager.GetPlayers(playerIds);") || generatedSource.includes("GetPlayers(out"))) {
        warnings.push("Generated controller failed the compile-safe PlayerManager.GetPlayers contract; re-export before opening this plan in Workbench.");
      }
      if (state.layers.some(layer => layer.binding === "player.count") && !generatedSource.includes("runtimePlayerCount++")) {
        warnings.push("Connected player count is bound, but the generated controller does not contain its runtime count path.");
      }
      if (state.layers.some(layer => layer.functionId === "engine.context.refresh") && !generatedSource.includes("RefreshRuntimeBindings();")) {
        warnings.push("Live engine refresh is assigned, but the generated controller does not contain its refresh route.");
      }
      if (state.layers.some(layer => layer.functionId === "engine.context.export") && !generatedSource.includes("PackToFile(\"$profile:BUSHWAR-UIComposer/runtime-context.json\")")) {
        warnings.push("Engine context export is assigned, but the generated controller does not contain its local snapshot writer.");
      }
    }
    if (!state.layers.length) warnings.push("Project has no UI layers.");
    if (!state.handoff.layoutName.trim()) warnings.push("Give the Workbench layout a name before exporting its import plan.");
    const assets = assetSummary();
    const contextSummary = enginePlayers().length
      ? `Engine context: ${engineContextLabel()}.`
      : "Engine context: no snapshot loaded; runtime-backed widgets will query Reforger when opened.";
    const report = $("#validationReport");
    report.className = "validation-report";
    report.innerHTML = `<div class="validation-summary"><b>${warnings.length ? "Review before handoff" : "Ready for Workbench handoff"}</b><br>${state.layers.length} layer${state.layers.length === 1 ? "" : "s"} · ${importableLayers.length} importable UI widget${importableLayers.length === 1 ? "" : "s"} · ${refAssets} embedded reference board image${refAssets === 1 ? "" : "s"} · ${(assets.bytes / 1024 / 1024).toFixed(1)} MB portable bundle estimate.<br><span class="hint">${escapeHtml(contextSummary)}</span></div>${runtimeContractAuditMarkup()}${warnings.length ? `<ul class="validation-warnings">${warnings.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="validation-ok">Save the authoritative .bwui.json file, then export the Workbench import plan. Create the listed layout in Workbench Layout Editor, apply the plan, and run Live Preview at your target resolutions.</p>`}<p class="hint">Reference-board images stay in the .bwui bundle; the import plan contains only real UI widgets, sources, names, anchors, and pixel bounds. Composer does not write production .layout XML or replace Workbench Layout Editor.</p>`;
    $("#validationDialog").showModal();
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(autoSaveSnapshot()));
    } catch { /* Storage is optional. */ }
  }

  function loadPersisted() {
    persistedSession = null;
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      const previous = localStorage.getItem(previousSessionStorageKey);
      const savedState = saved ? normalizeState(JSON.parse(saved)) : null;
      // Keep the last meaningful session available for an explicit restore,
      // while normal boot remains a clean blank canvas. This avoids destroying
      // a user's work merely because the landing page is blank.
      if (savedState && hasMeaningfulDesign(savedState)) {
        localStorage.setItem(previousSessionStorageKey, JSON.stringify(savedState));
        persistedSession = savedState;
      } else if (previous) {
        const previousState = normalizeState(JSON.parse(previous));
        if (hasMeaningfulDesign(previousState)) persistedSession = previousState;
      }
    } catch {
      persistedSession = null;
    }
    state = freshState();
  }

  function hasMeaningfulDesign(design) {
    if (!design) return false;
    return Boolean(
      (Array.isArray(design.layers) && design.layers.length) ||
      design.canvas?.background ||
      (design.canvas?.baseScene && design.canvas.baseScene !== "blank") ||
      design.canvas?.backgroundName ||
      (design.title && design.title !== "Untitled BUSHWAR UI")
    );
  }

  function showLandingPage() {
    const dialog = $("#landingDialog");
    if (!dialog) return;
    const restore = $("#landingRestoreBtn");
    if (restore) restore.hidden = !persistedSession;
    if (!dialog.open) dialog.showModal();
  }

  function renderReleaseNotice() {
    $("#updateTitle").textContent = release.title || "What's new";
    $("#updateVersion").textContent = `v${release.version}`;
    $("#updatePublished").textContent = release.published || "";
    $("#updateSummary").textContent = release.summary || "";
    const list = $("#updateChanges");
    list.innerHTML = "";
    (Array.isArray(release.changes) ? release.changes : []).forEach(change => {
      const item = document.createElement("li");
      item.textContent = change;
      list.append(item);
    });
  }

  function previewCallback(layer) {
    const callback = functionFor(layer);
    if (!callback) return false;
    const prefix = `Browser preview only · ${callback.label}`;
    if (callback.implementation?.status === "review-required") {
      setStatus(`${prefix} requires reviewed ${callback.authority} implementation in Workbench; no game state was changed`);
      return true;
    }
    if (["engine.context.refresh", "player.list.refresh"].includes(layer.functionId)) {
      render();
      setStatus(`${prefix} · imported context re-rendered; PlayerManager remains authoritative in WR`);
      return true;
    }
    if (layer.functionId === "engine.context.export") {
      setStatus(`${prefix} · browser cannot capture WR state; use the generated controller to write $profile:BUSHWAR-UIComposer/runtime-context.json, then import that file here`);
      return true;
    }
    if (layer.functionId === "ui.layout.open" || layer.functionId === "ui.layout.close") {
      setStatus(`${prefix} · the exported controller will create/delete the registered layout in WR`);
      return true;
    }
    if (layer.functionId === "ui.widget.toggle-visibility") {
      const targetName = layer.functionTargetWidgetName?.trim();
      const target = targetName ? state.layers.find(item => item.name === targetName) : layer;
      if (!target) {
        setStatus(`${prefix} · target widget '${targetName}' was not found in this design`);
        return true;
      }
      checkpoint();
      target.visible = !target.visible;
      render();
      setStatus(`${prefix} · browser preview toggled ${target.name}; Workbench will toggle the named widget at runtime`);
      return true;
    }
    if (layer.functionId === "ui.widget.set-text") {
      const targetName = layer.functionTargetWidgetName?.trim();
      const target = targetName ? state.layers.find(item => item.name === targetName) : layer;
      if (!target) {
        setStatus(`${prefix} · target widget '${targetName}' was not found in this design`);
        return true;
      }
      checkpoint();
      target.text = layer.text || "";
      render();
      setStatus(`${prefix} · browser preview set ${target.name}; Workbench will call TextWidget.SetText at runtime`);
      return true;
    }
    if (layer.functionId === "ui.widget.click" || layer.functionId === "gm.context-action.perform") {
      setStatus(`${prefix} · the browser recorded the contract; the generated controller owns the WR event`);
      return true;
    }
    return false;
  }

  function showReleaseNoticeIfNew() {
    const dialog = $("#updateDialog");
    try {
      if (localStorage.getItem(updateSeenStorageKey) === release.version) return;
    } catch { /* If browser storage is unavailable, show the update for this visit. */ }
    dialog.dataset.autoNotice = "true";
    window.setTimeout(() => {
      if (!dialog.open && !$("#landingDialog")?.open) dialog.showModal();
    }, 180);
  }

  function markReleaseAsSeen() {
    try { localStorage.setItem(updateSeenStorageKey, release.version); } catch { /* Storage is optional. */ }
  }

  stage.addEventListener("pointerdown", event => {
    const element = event.target.closest(".layer");
    if (!element) { selectedId = null; render(); return; }
    const layer = state.layers.find(item => item.id === element.dataset.id);
    if (!layer) return;
    if (event.target.closest(".canvas-lock-toggle")) {
      checkpoint();
      layer.locked = !layer.locked;
      render();
      setStatus(`${layer.name} ${layer.locked ? "locked" : "unlocked"}`);
      event.preventDefault();
      return;
    }
    selectedId = layer.id;
    if (layer.locked || preview) { render(); return; }
    checkpoint();
    const resizing = event.target.classList.contains("resize-handle");
    interaction = { kind: resizing ? "resize" : "move", layer, startX: event.clientX, startY: event.clientY, x: layer.x, y: layer.y, w: layer.w, h: layer.h };
    stage.setPointerCapture(event.pointerId);
    render();
    event.preventDefault();
  });

  stage.addEventListener("pointermove", event => {
    const rect = stage.getBoundingClientRect();
    $("#pointerLabel").textContent = `x ${Math.round((event.clientX - rect.left) / zoom)} · y ${Math.round((event.clientY - rect.top) / zoom)}`;
    if (!interaction) return;
    const dx = (event.clientX - interaction.startX) / zoom;
    const dy = (event.clientY - interaction.startY) / zoom;
    if (interaction.kind === "move") {
      interaction.layer.x = clamp(snap(interaction.x + dx), 0, state.canvas.width - interaction.layer.w);
      interaction.layer.y = clamp(snap(interaction.y + dy), 0, state.canvas.height - interaction.layer.h);
    } else {
      interaction.layer.w = clamp(snap(interaction.w + dx), 10, state.canvas.width - interaction.layer.x);
      interaction.layer.h = clamp(snap(interaction.h + dy), 3, state.canvas.height - interaction.layer.y);
    }
    render();
  });

  // Let the browser preview exercise the same identity contract as the
  // generated controller: a row click carries the imported numeric playerId,
  // never a display-name lookup or row index. This is a local preview only.
  stage.addEventListener("click", event => {
    const row = event.target.closest(".engine-scaffold-row");
    if (!row) return;
    const element = row.closest(".layer");
    const layer = element ? state.layers.find(item => item.id === element.dataset.id) : null;
    const playerId = Number(row.dataset.playerId);
    const player = enginePlayers().find(item => Number(item.id) === playerId);
    if (!layer || !Number.isFinite(playerId) || !player) return;
    event.preventDefault();
    event.stopPropagation();
    previewSelections.set(layer.id, playerId);
    selectedId = layer.id;
    render();
    setStatus(`Preview selected ${player.name} · PlayerManager ID ${playerId}; generated OnPlayerRowClicked will receive this ID`);
  });
  stage.addEventListener("click", event => {
    if (!preview) return;
    if (event.target.closest(".engine-scaffold-row")) return;
    const element = event.target.closest(".layer");
    const layer = element ? state.layers.find(item => item.id === element.dataset.id) : null;
    if (!layer || !layer.functionId) return;
    event.preventDefault();
    event.stopPropagation();
    previewCallback(layer);
  });
  window.addEventListener("pointerup", () => { interaction = null; });
  window.addEventListener("pointercancel", () => { interaction = null; });

  $$("[data-add]").forEach(button => button.addEventListener("click", () => addLayer(button.dataset.add, {
    ...(button.dataset.binding ? { binding: button.dataset.binding } : {}),
    ...(button.dataset.function ? { functionId: button.dataset.function } : {})
  })));
  $$("[data-template]").forEach(button => button.addEventListener("click", () => applyTemplate(button.dataset.template)));
  $$("[data-scene]").forEach(button => button.addEventListener("click", () => setBaseScene(button.dataset.scene)));
  $("#sceneSelect").addEventListener("change", event => setBaseScene(event.target.value));
  $("#sceneToggleBtn").addEventListener("click", () => {
    checkpoint();
    state.canvas.baseSceneVisible = !state.canvas.baseSceneVisible;
    updateSceneUI();
    render();
  });
  $("#sceneOpacity").addEventListener("input", event => {
    state.canvas.baseSceneOpacity = Number(event.target.value);
    render();
  });
  $("#componentSearch").addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();
    $$("[data-add]", $("#componentLibrary")).forEach(button => {
      button.hidden = !!query && !button.textContent.toLowerCase().includes(query) && !button.dataset.add.includes(query);
    });
    renderReforgerCatalog();
  });
  $("#catalogCategoryFilter").addEventListener("change", renderReforgerCatalog);
  $$("[data-size]").forEach(button => button.addEventListener("click", () => {
    const [width, height] = button.dataset.size.split(",").map(Number); checkpoint(); state.canvas.width = width; state.canvas.height = height; syncControls(); render();
  }));

  $$("[data-prop]", inspector).forEach(input => {
    const commit = () => {
      const layer = selectedLayer(); if (!layer) return;
      checkpoint();
      const prop = input.dataset.prop;
      layer[prop] = input.type === "checkbox" ? input.checked : input.type === "number" || input.type === "range" ? Number(input.value) : input.value;
      if (["x", "y", "w", "h"].includes(prop)) {
        layer.w = clamp(layer.w, 1, state.canvas.width); layer.h = clamp(layer.h, 1, state.canvas.height);
        layer.x = clamp(layer.x, 0, state.canvas.width - layer.w); layer.y = clamp(layer.y, 0, state.canvas.height - layer.h);
      }
      render();
    };
    input.addEventListener(input.type === "range" || input.type === "color" ? "input" : "change", commit);
  });

  $("#bindingSelect").addEventListener("change", event => {
    const layer = selectedLayer();
    if (!layer) return;
    checkpoint();
    layer.binding = event.target.value;
    render();
    const binding = bindingFor(layer);
    setStatus(binding ? "Engine binding assigned: " + binding.label : "Engine binding removed; layer is design-only");
  });

  $("#functionSelect").addEventListener("change", event => {
    const layer = selectedLayer();
    if (!layer) return;
    checkpoint();
    layer.functionId = event.target.value;
    render();
    const callback = functionFor(layer);
    setStatus(callback ? "Engine callback assigned: " + callback.label : "Engine callback removed; layer is visual-only");
  });
  $("#functionTargetWidgetName").addEventListener("change", event => {
    const layer = selectedLayer();
    if (!layer) return;
    checkpoint();
    layer.functionTargetWidgetName = event.target.value.trim();
    render();
    setStatus(layer.functionTargetWidgetName ? `Action target set to ${layer.functionTargetWidgetName}` : "Action target cleared; clicked widget will be used");
  });
  $("#runtimeValueWidgetName").addEventListener("change", event => {
    const layer = selectedLayer();
    if (!layer) return;
    checkpoint();
    layer.runtimeValueWidgetName = event.target.value.trim();
    render();
    setStatus(layer.runtimeValueWidgetName ? `Runtime value child set to ${layer.runtimeValueWidgetName}` : "Runtime value child cleared; generated widget name will be used");
  });

  $("#backgroundBtn").addEventListener("click", () => $("#backgroundInput").click());
  $("#referenceBtn").addEventListener("click", () => $("#referenceInput").click());
  $("#referenceInput").addEventListener("change", event => { addReferenceFiles(event.target.files); event.target.value = ""; });
  $("#engineContextBtn").addEventListener("click", () => $("#engineContextInput").click());
  $("#engineContextInput").addEventListener("change", event => { importEngineContext(event.target.files[0]); event.target.value = ""; });
  $("#clearEngineContextBtn").addEventListener("click", () => {
    if (!hasEngineContextSnapshot()) return;
    checkpoint();
    state.engineContext = { ...freshState().engineContext };
    render();
    setStatus("Workbench context cleared; runtime values remain authoritative");
  });
  $("#backgroundInput").addEventListener("change", event => readImageFile(event.target.files[0], (data, name) => { checkpoint(); state.canvas.background = data; state.canvas.backgroundName = name; render(); setStatus(`Reference loaded: ${name}`); }));
  $("#clearBackgroundBtn").addEventListener("click", () => { checkpoint(); state.canvas.background = ""; state.canvas.backgroundName = ""; render(); });
  $("#backgroundOpacity").addEventListener("input", event => { state.canvas.backgroundOpacity = Number(event.target.value); render(); });
  $("#layerImageBtn").addEventListener("click", () => $("#layerImageInput").click());
  $("#layerImageInput").addEventListener("change", event => readImageFile(event.target.files[0], data => { const layer = selectedLayer(); if (!layer) return; checkpoint(); layer.image = data; render(); }));
  $("#copyResourceBtn").addEventListener("click", async () => {
    const layer = selectedLayer(); if (!layer || !layer.resourcePath) return;
    try { await navigator.clipboard.writeText(layer.resourcePath); setStatus("Reforger resource path copied"); }
    catch { setStatus("Clipboard unavailable; select and copy the resource path manually"); }
  });
  $("#useRecommendedSourceBtn").addEventListener("click", () => {
    const layer = selectedLayer();
    const entry = layer && recommendedSourceFor(layer);
    if (!layer || !entry) return;
    checkpoint();
    layer.resourcePath = entry.resourceReference || entry.path;
    layer.catalogName = entry.name;
    layer.catalogCategory = entry.category;
    layer.catalogKind = entry.kind;
    layer.catalogPreview = entry.preview;
    layer.catalogNativeWidgetClass = entry.nativeWidgetClass || "LayoutResource";
    layer.catalogNativeChildHint = entry.nativeChildHint || "";
    layer.catalogWorkbenchAction = entry.workbenchAction || "Drag this registered layout prefab into the target layout";
    layer.reforgerVisual = reforgerVisualFor({ ...layer, name: entry.name, catalogCategory: entry.category, catalogKind: entry.kind });
    layer.coreLibraryId = entry.coreLibraryId || undefined;
    layer.coreLibraryEntryId = entry.id || undefined;
    layer.rowLayoutPath = entry.rowLayoutPath || undefined;
    layer.nativeTree = entry.nativeTree || undefined;
    if (!layer.binding && entry.defaultBinding) layer.binding = entry.defaultBinding;
    if (!layer.functionId && entry.defaultFunction) layer.functionId = entry.defaultFunction;
    if (!layer.functionTargetWidgetName && entry.defaultFunctionTarget) layer.functionTargetWidgetName = entry.defaultFunctionTarget;
    if (!layer.runtimeValueWidgetName && entry.runtimeValueWidgetName) layer.runtimeValueWidgetName = entry.runtimeValueWidgetName;
    layer.functionHints = entry.functionHints ? clone(entry.functionHints) : undefined;
    if (entry.requiredChildren) layer.requiredChildren = clone(entry.requiredChildren);
    if (entry.runtimeContracts) layer.runtimeContracts = clone(entry.runtimeContracts);
    render();
    setStatus(`Source-backed layer: ${entry.name}. Workbench remains the final visual authority.`);
  });
  $("#clearSourceBtn").addEventListener("click", () => {
    const layer = selectedLayer();
    if (!layer || !sourceBackedLayer(layer)) return;
    checkpoint();
    delete layer.resourcePath;
    delete layer.catalogName;
    delete layer.catalogCategory;
    delete layer.catalogKind;
    delete layer.catalogPreview;
    delete layer.catalogNativeWidgetClass;
    delete layer.catalogNativeChildHint;
    delete layer.catalogWorkbenchAction;
    delete layer.reforgerVisual;
    render();
    setStatus("Generated native scaffold restored; no WLib source is attached.");
  });

  function readImageFile(file, callback) { if (!file) return; const reader = new FileReader(); reader.onload = () => callback(reader.result, file.name); reader.readAsDataURL(file); }

  $("#screenWidth").addEventListener("change", event => { checkpoint(); state.canvas.width = clamp(Number(event.target.value), 320, 7680); render(); });
  $("#screenHeight").addEventListener("change", event => { checkpoint(); state.canvas.height = clamp(Number(event.target.value), 240, 4320); render(); });
  $("#gridToggle").addEventListener("change", event => { state.settings.grid = event.target.checked; render(); });
  $("#snapToggle").addEventListener("change", event => { state.settings.snap = event.target.checked; render(); });
  $("#zoomSelect").addEventListener("change", updateStageScale);
  $("#undoBtn").addEventListener("click", undo);
  $("#redoBtn").addEventListener("click", redo);
  $("#duplicateBtn").addEventListener("click", duplicateSelected);
  $("#deleteBtn").addEventListener("click", deleteSelected);
  $("#layerUpBtn").addEventListener("click", () => moveLayer(1));
  $("#layerDownBtn").addEventListener("click", () => moveLayer(-1));
  $("#saveBtn").addEventListener("click", exportDesign);
  $("#openBtn").addEventListener("click", () => $("#designInput").click());
  $("#designInput").addEventListener("change", event => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => { try { checkpoint(); const bundle = readBundle(JSON.parse(reader.result)); state = normalizeState(bundle.design); state.title = bundle.name || state.title; selectedId = null; syncControls(); render(); const count = assetSummary().count; setStatus(`Project opened: ${file.name} · ${count} embedded asset${count === 1 ? "" : "s"} · ${bundle.integrityStatus === "mismatch" ? "manifest mismatch — review references" : "bundle verified"}`); } catch (error) { alert(`Could not open project: ${error.message}`); } }; reader.readAsText(file);
  });
  $("#newBtn").addEventListener("click", () => { if (!confirm("Start a new design? Export the current design first if you want to keep it.")) return; checkpoint(); state = freshState(); selectedId = null; syncControls(); render(); });
  $("#pngBtn").addEventListener("click", exportPng);
  $("#exportWorkbenchPlanBtn").addEventListener("click", exportWorkbenchPlan);
  $("#exportWorkbenchBundleBtn").addEventListener("click", exportWorkbenchBundle);
  $("#exportControllerBtn").addEventListener("click", exportControllerScaffold);
  $("#copyLayoutCreateBtn").addEventListener("click", copyLayoutCreateRequest);
  $("#workbenchTarget").addEventListener("change", event => { state.handoff.target = event.target.value; persist(); });
  $("#workbenchLayoutName").addEventListener("change", event => { state.handoff.layoutName = event.target.value; persist(); });
  $("#whatsNewBtn").addEventListener("click", () => {
    const dialog = $("#updateDialog");
    dialog.dataset.autoNotice = "";
    if (!dialog.open) dialog.showModal();
  });
  $("#copySpecBtn").addEventListener("click", copySpec);
  $("#validateBtn").addEventListener("click", validateHandoff);
  $("#exportTemplateBtn").addEventListener("click", exportTemplate);
  $("#importTemplateBtn").addEventListener("click", () => $("#templateInput").click());
  $("#templateInput").addEventListener("change", event => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => { try { const bundle = readBundle(JSON.parse(reader.result)); if (bundle.kind !== "template" && bundle.format === bundleFormat) throw new Error("This is a project bundle; use Open project instead"); checkpoint(); state = normalizeState(bundle.design); state.title = bundle.name || state.title; selectedId = null; syncControls(); render(); const saved = saveUserTemplate(bundle.name || file.name.replace(/\.json$/i, "")); setStatus(saved ? `Template imported and saved locally: ${bundle.name || file.name}` : `Template opened: ${bundle.name || file.name} · export a bundle to keep its embedded references`); } catch (error) { alert(`Could not import template: ${error.message}`); } }; reader.readAsText(file);
  });
  $("#previewBtn").addEventListener("click", () => { preview = !preview; document.body.classList.toggle("preview-mode", preview); $("#previewBtn").textContent = preview ? "Exit preview" : "Preview"; render(); });
  $("#saveTemplateBtn").addEventListener("click", () => {
    const dialog = $("#templateDialog");
    $("#templateName").value = state.title === "Untitled BUSHWAR UI" ? "" : state.title;
    dialog.showModal();
    setTimeout(() => $("#templateName").focus(), 0);
  });
  $("#templateDialog").addEventListener("close", () => {
    if ($("#templateDialog").returnValue === "save") saveUserTemplate($("#templateName").value);
  });
  $("#updateDialog").addEventListener("close", () => {
    if ($("#updateDialog").dataset.autoNotice === "true") markReleaseAsSeen();
    $("#updateDialog").dataset.autoNotice = "";
  });
  $("#landingDialog").addEventListener("close", () => {
    const choice = $("#landingDialog").returnValue;
    if (choice === "restore" && persistedSession) {
      checkpoint();
      state = normalizeState(clone(persistedSession));
      selectedId = null;
      syncControls();
      render();
      setStatus("Previous session restored");
    } else {
      // Blank is the default and also the safe fallback if the dialog is
      // dismissed with Escape or if a stored session is unavailable.
      state = freshState();
      selectedId = null;
      syncControls();
      render();
      if (choice === "templates") {
        $("#templatesSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setStatus("Blank workspace ready · choose a template or base scene");
      } else {
        setStatus("Blank workspace ready");
      }
    }
    window.setTimeout(showReleaseNoticeIfNew, 80);
  });

  window.addEventListener("keydown", event => {
    const editing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
    if (event.key === "Escape" && preview) {
      preview = false;
      document.body.classList.remove("preview-mode");
      $("#previewBtn").textContent = "Preview";
      render();
      return;
    }
    if (editing) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelected(); return; }
    if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); deleteSelected(); return; }
    const layer = selectedLayer();
    if (!layer || layer.locked || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    checkpoint(); const amount = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowLeft") layer.x = Math.max(0, layer.x - amount);
    if (event.key === "ArrowRight") layer.x = Math.min(state.canvas.width - layer.w, layer.x + amount);
    if (event.key === "ArrowUp") layer.y = Math.max(0, layer.y - amount);
    if (event.key === "ArrowDown") layer.y = Math.min(state.canvas.height - layer.h, layer.y + amount);
    event.preventDefault(); render();
  });

  window.addEventListener("resize", updateStageScale);
  loadUserTemplates();
  loadPersisted();
  renderReleaseNotice();
  syncControls();
  $("#workbenchTarget").value = state.handoff.target;
  $("#workbenchLayoutName").value = state.handoff.layoutName;
  renderUserTemplates();
  renderEngineRecipes();
  renderReforgerCatalog();
  updateUndoButtons();
  render();
  showLandingPage();
  showReleaseNoticeIfNew();
})();
