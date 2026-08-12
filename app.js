(() => {
  "use strict";

  const storageKey = "bushwar-ui-composer-by-sgt-james";
  const legacyStorageKey = "bushwar-ui-composer";
  const templatesStorageKey = "bushwar-ui-composer-user-templates-v1";
  const updateSeenStorageKey = "bushwar-ui-composer-last-seen-release";
  const release = window.BUSHWAR_COMPOSER_RELEASE || { version: "0.5.1", published: "", title: "Latest improvements", summary: "", changes: [] };
  const APP_VERSION = release.version;
  const bundleFormat = "bushwar-ui-composer";
  const bundleSchema = 5;
  const workbenchPlanFormat = "bushwar-ui-composer-workbench-plan";
  const workbenchPlanSchema = 2;
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
      layers: []
    };
  }

  function makeLayer(type, overrides = {}) {
    return { id: uid(), type, opacity: 1, visible: true, locked: false, image: "", binding: "", bindingMode: "engine", functionId: "", ...clone(defaults[type]), ...overrides };
  }

  function normalizeState(value) {
    const clean = { ...freshState(), ...value };
    clean.canvas = { ...freshState().canvas, ...(value.canvas || {}) };
    clean.settings = { ...freshState().settings, ...(value.settings || {}) };
    clean.handoff = { ...freshState().handoff, ...(value.handoff || {}) };
    clean.layers = Array.isArray(value.layers) ? value.layers.map(layer => ({ binding: "", bindingMode: "engine", functionId: "", ...layer })) : [];
    return clean;
  }

  function bindingCatalog() {
    return window.BUSHWAR_REFORGER_BINDINGS || { entries: [], byId: () => null };
  }

  function bindingFor(layer) {
    return layer?.binding ? bindingCatalog().byId(layer.binding) : null;
  }

  function functionCatalog() {
    return window.BUSHWAR_REFORGER_FUNCTIONS || { entries: [], byId: () => null, forLayer: () => [] };
  }

  function functionFor(layer) {
    return layer?.functionId ? functionCatalog().byId(layer.functionId) : null;
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
    persist();
  }

  function renderLayerContent(layer, element) {
    const text = escapeHtml(layer.text);
    if (layer.type === "text" || layer.type === "button" || layer.type === "badge") element.textContent = layer.text;
    else if (layer.type === "icon") element.innerHTML = '<span class="icon-glyph"></span>';
    else if (layer.type === "image" || layer.type === "reference") {
      if (layer.image) element.style.backgroundImage = `url("${layer.image}")`;
      else if (layer.type === "image") element.classList.add("no-image");
    } else if (layer.type === "player") {
      const binding = bindingFor(layer);
      const callback = functionFor(layer);
      const displayText = binding?.id === "player.list.connected" ? "PLAYER NAME FROM ENGINE" : layer.text;
      const initial = (displayText || "P").trim().slice(0, 1).toUpperCase();
      const engineLabel = binding ? `<small class="binding-badge">${escapeHtml(binding.label)}</small>` : "";
      const callbackLabel = callback ? `<small class="binding-badge callback-badge">${escapeHtml(callback.label)}</small>` : "";
      element.innerHTML = `<span class="avatar">${escapeHtml(initial)}</span><span class="player-name">${escapeHtml(displayText || "PLAYER NAME FROM ENGINE")}</span>${engineLabel}${callbackLabel}<span class="row-action">BRING ME</span><span class="row-action">BRING PLAYER</span>`;
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
      const binding = bindingFor(layer);
      const callback = functionFor(layer);
      const body = binding?.id === "player.list.connected"
        ? `<tr><td colspan="4" class="engine-preview-empty">Workbench will populate valid connected players here; the browser does not invent rows.</td></tr>`
        : `<tr><td colspan="4" class="engine-preview-empty">Design preview only — assign an engine binding to make this runtime-backed.</td></tr>`;
      const callbackHint = callback ? `<div class="table-callback-hint">${escapeHtml(callback.label)}</div>` : "";
      element.innerHTML = `${callbackHint}<table class="data-table"><thead><tr><th>${text}</th><th>Role</th><th>Status</th><th>Ping</th></tr></thead><tbody>${body}</tbody></table>`;
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
    } else if (layer.type === "reforger") {
      renderReforgerReference(layer, element, text);
    }
  }

  function reforgerVisualFor(item) {
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
    const bounds = { button: [270, 58], checkbox: [260, 46], slider: [350, 56], progress: [370, 64], selector: [300, 58], input: [340, 70], tabs: [480, 58], list: [430, 220], "vehicle-hud": [420, 160], map: [390, 240], chat: [400, 160], action: [360, 78], "gm-hud": [470, 110], "icon-atlas": [240, 120], "map-marker": [220, 170], text: [360, 58], panel: [420, 110] };
    const [w, h] = bounds[visual] || bounds.panel;
    return { w, h };
  }

  function renderReforgerReference(layer, element, text) {
    const visual = layer.reforgerVisual || reforgerVisualFor(layer);
    element.classList.add(`reforger-${visual}`);
    const title = text || "Reforger reference";
    const body = {
      button: `<span class="rr-button">${title}<i>›</i></span>`, checkbox: `<span class="rr-check checked">✓</span><span class="rr-label">${title}</span>`, slider: `<span class="rr-label">${title}</span><span class="rr-slider"><i></i></span>`, progress: `<span class="rr-label">${title}</span><span class="rr-progress"><i></i></span>`, selector: `<span class="rr-select">${title}<b>⌄</b></span>`, input: `<span class="rr-input"><b>${title}</b><i>Search / enter value</i></span>`, tabs: `<span class="rr-tabs"><b>${title}</b><i>DETAILS</i><i>OPTIONS</i></span>`, list: `<span class="rr-list"><b>${title}</b><i></i><i></i><i></i></span>`, "vehicle-hud": `<span class="rr-gauge">62</span><span class="rr-vehicle"><b>${title}</b><i>GEAR 3 · 48 km/h</i><em></em></span>`, map: `<span class="rr-map"><i>⌖</i><b>${title}</b><em></em></span>`, chat: `<span class="rr-chat"><b>${title}</b><i>PLAYER: Ready on your mark.</i><i>GM: Entity placed.</i></span>`, action: `<span class="rr-action"><b>F</b><span>${title}<i>Hold to interact</i></span></span>`, "gm-hud": `<span class="rr-gm"><b>◆</b><span>${title}<i>GAME MASTER / EDITOR</i></span><em>⌘</em></span>`, "icon-atlas": `<span class="rr-atlas"><i>⌁</i><i>⚙</i><i>◇</i><i>⌖</i><i>◉</i><i>▣</i></span>`, "map-marker": `<span class="rr-marker">⌖</span><span class="rr-label">${title}</span>`, text: `<span class="rr-text">${title}</span>`, panel: `<span class="rr-panel"><b>${title}</b><i>Workbench layout reference</i></span>`
    }[visual] || `<span class="rr-panel"><b>${title}</b></span>`;
    element.innerHTML = `<div class="reforger-reference rf-${visual}" role="img" aria-label="${escapeHtml(title)} Reforger UI reference">${body}</div>`;
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
    $("#resourceControls").hidden = layer.type !== "reforger";
    if (layer.type === "reforger") $("#resourcePath").value = layer.resourcePath || "";
    const bindingControls = $("#bindingControls");
    bindingControls.hidden = !["player", "table"].includes(layer.type);
    if (!bindingControls.hidden) {
      const select = $("#bindingSelect");
      const entries = bindingCatalog().entries;
      select.innerHTML = `<option value="">No engine binding (design-only)</option>${entries.map(binding => `<option value="${escapeHtml(binding.id)}">${escapeHtml(binding.label)}</option>`).join("")}`;
      select.value = layer.binding || "";
      const binding = bindingFor(layer);
      $("#bindingContract").textContent = binding ? `${binding.sourceClass}: ${binding.sourceMethods.join(" · ")} · ${binding.authority}. ${binding.runtime}` : "Design-only preview. Export a binding before expecting Workbench runtime data.";
    }
    const functionControls = $("#functionControls");
    functionControls.hidden = !functionCatalog().forLayer(layer).length;
    if (!functionControls.hidden) {
      const select = $("#functionSelect");
      const entries = functionCatalog().forLayer(layer);
      select.innerHTML = `<option value="">No callback assigned (visual-only)</option>${entries.map(callback => `<option value="${escapeHtml(callback.id)}">${escapeHtml(callback.label)}</option>`).join("")}`;
      select.value = layer.functionId || "";
      const callback = functionFor(layer);
      $("#functionContract").textContent = callback ? `${callback.callback} · ${callback.authority}. ${callback.runtime}` : "Choose a callback contract to tell Workbench what this widget should do when used.";
    }
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
        makeLayer("table", { name: "Connected players (engine)", x: x + 14, y: y + 106, w: w - 28, h: h - 130, text: "CONNECTED PLAYERS", binding: "player.list.connected", functionId: "player.row.select", fontSize: 15 })
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

  function workbenchWidgetFor(layer, index) {
    const base = {
      panel: "FrameWidget", text: "TextWidget", button: "ButtonWidget", icon: "ImageWidget", image: "ImageWidget",
      player: "FrameWidget", divider: "FrameWidget", badge: "TextWidget", window: "FrameWidget", dialog: "FrameWidget",
      prompt: "FrameWidget", toast: "FrameWidget", context: "FrameWidget", tooltip: "FrameWidget", tabs: "FrameWidget",
      table: "FrameWidget", toolbar: "FrameWidget", progress: "FrameWidget", input: "FrameWidget", toggle: "FrameWidget",
      assetcard: "FrameWidget", squadtile: "FrameWidget", inventory: "FrameWidget", categorybar: "FrameWidget"
    };
    const source = layer.type === "reforger" && /\.layout$/i.test(layer.resourcePath || "") ? layer.resourcePath : "";
    const widgetType = source ? "Layout prefab" : (base[layer.type] || "FrameWidget");
    return {
      id: layer.id,
      name: `m_w${safeName(layer.name || `Widget${index + 1}`).replace(/-([a-z])/g, (_, character) => character.toUpperCase()) || `Widget${index + 1}`}`,
      widgetType,
      source: source || undefined,
      importMode: source ? "Drag this WLib/vanilla layout into the root, then apply the bounds below." : "Create this native widget under the root FrameWidget.",
      binding: layer.binding || "",
      bindingContract: bindingFor(layer) || undefined,
      functionId: layer.functionId || "",
      functionContract: functionFor(layer) || undefined,
      boundsPx: { left: Math.round(layer.x), top: Math.round(layer.y), width: Math.round(layer.w), height: Math.round(layer.h), right: Math.round(layer.x + layer.w), bottom: Math.round(layer.y + layer.h) },
      anchors: [layer.x / state.canvas.width, layer.y / state.canvas.height, (layer.x + layer.w) / state.canvas.width, (layer.y + layer.h) / state.canvas.height].map(value => Number(value.toFixed(4))),
      geometry: { mode: "pixel-fixed", rootWidth: state.canvas.width, rootHeight: state.canvas.height },
      properties: { text: layer.text, fill: layer.fill, color: layer.color, borderColor: layer.borderColor, accent: layer.accent, opacity: layer.opacity, fontSize: layer.fontSize, visible: layer.visible },
      reforgerProfile: layer.type === "reforger" ? (layer.reforgerVisual || reforgerVisualFor(layer)) : undefined,
      resourceReference: layer.resourcePath || undefined
    };
  }

  function reforgerColor(hex, alpha = 1) {
    const value = String(hex || "#ffffff").replace("#", "");
    const red = parseInt(value.slice(0, 2), 16) || 0;
    const green = parseInt(value.slice(2, 4), 16) || 0;
    const blue = parseInt(value.slice(4, 6), 16) || 0;
    return [red / 255, green / 255, blue / 255, clamp(alpha, 0, 1)].map(component => Number(component.toFixed(3))).join(" ");
  }

  function layoutCreateNodeFor(layer, index) {
    const widget = workbenchWidgetFor(layer, index);
    // The Composer canvas is pixel-authored. Keep the generated Workbench
    // scaffold pixel-accurate instead of silently converting a 360 px panel
    // into a proportionally resizing anchor-only widget. The plan still
    // carries normalized anchors for responsive handoff review.
    const pixelSlot = {
      anchor: "0 0 0 0",
      positionX: Math.round(layer.x),
      positionY: Math.round(layer.y),
      sizeX: Math.round(layer.w),
      sizeY: Math.round(layer.h)
    };
    if (layer.type === "table" && widget.binding === "player.list.connected") {
      return {
        type: "Frame",
        name: widget.name,
        props: { Color: reforgerColor(layer.fill, layer.opacity) },
        slot: pixelSlot,
        children: [
          {
            type: "Text",
            name: `${widget.name}Count`,
            props: { Text: "0 CONNECTED", Color: reforgerColor(layer.accent) },
            slot: { anchor: "0 0 1 0.12" }
          },
          {
            type: "ScrollLayout",
            name: `${widget.name}Scroll`,
            slot: { anchor: "0 0.14 1 1" },
            children: [{
              type: "VerticalLayout",
              name: `${widget.name}List`,
              slot: { sizeMode: "FILL" }
            }]
          }
        ]
      };
    }
    return {
      type: "Frame",
      name: widget.name,
      props: { Color: reforgerColor(layer.fill, layer.opacity) },
      slot: pixelSlot,
      children: [{
        type: "Text",
        name: `${widget.name}Text`,
        props: { Text: layer.text || layer.name, Color: reforgerColor(layer.color) },
        slot: { anchor: "0 0 1 1" }
      }]
    };
  }

  function makeWorkbenchPlan() {
    const layoutName = safeName(state.handoff.layoutName) || "bushwar-composer-layout";
    const classStem = layoutName.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("") || "BushwarComposerLayout";
    const visibleLayers = state.layers.filter(layer => layer.type !== "reference");
    const widgets = visibleLayers.map(workbenchWidgetFor);
    const runtimeScaffolds = widgets.filter(widget => widget.binding).map(widget => ({
      binding: widget.binding,
      contract: widget.bindingContract,
      functionId: widget.functionId || undefined,
      functionContract: widget.functionContract,
      widgetName: widget.name,
      controllerClass: `BWUIC_${classStem}Controller`,
      layoutPath: `UI/layouts/${layoutName}.layout`,
      rowLayoutPath: widget.binding === "player.list.connected" ? `UI/layouts/${layoutName}-player-row.layout` : undefined,
      rowLayoutCreateRequest: widget.binding === "player.list.connected" ? {
        name: `${layoutName}-player-row`,
        description: "Native row scaffold for a connected-player callback. Keep the playerId in controller state, not in display text.",
        root: { type: "Button", name: "Row", children: [{ type: "Text", name: "NameText", props: { Text: "Player", Color: "1 1 1 1" }, slot: { sizeMode: "FILL", padding: "12 6 12 6" } }] }
      } : undefined,
      requiredWidgetNames: widget.binding === "player.list.connected" ? {
        count: `${widget.name}Count`,
        scroll: `${widget.name}Scroll`,
        list: `${widget.name}List`,
        rowRoot: "Row",
        rowName: "NameText"
      } : undefined,
      implementation: widget.binding === "player.list.connected"
        ? "Read PlayerManager.GetPlayerCount(), enumerate valid IDs with GetPlayerName(playerId), skip empty names, create one row per valid name under the generated list widget, set TextWidget.SetExactFontSize from the Composer font contract, and refresh on join/left changes. If a row callback is assigned, carry the actual playerId alongside the row."
        : "Implement the listed engine contract in the generated controller; the Composer does not invent callbacks or authority."
    }));
    return {
      format: workbenchPlanFormat,
      schema: workbenchPlanSchema,
      generatedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      target: {
        kind: state.handoff.target,
        layoutPath: `UI/layouts/${layoutName}.layout`,
        rootWidget: "m_wRoot",
        controllerClass: `BWUIC_${classStem}Controller`
      },
      root: { width: state.canvas.width, height: state.canvas.height, widgetType: "FrameWidget", name: "m_wRoot" },
      widgets,
      bindings: widgets.filter(widget => widget.binding).map(widget => ({ id: widget.binding, contract: widget.bindingContract })),
      callbacks: widgets.filter(widget => widget.functionId).map(widget => ({ id: widget.functionId, contract: widget.functionContract })),
      runtimeScaffolds,
      resources: [...new Set(visibleLayers.map(layer => layer.resourcePath).filter(Boolean))],
      layoutCreateRequest: {
        name: layoutName,
        description: "Generated UI Composer scaffold. Open and resave in Workbench Layout Editor before production use.",
        root: { type: "Frame", name: "m_wRoot", props: { Color: "0 0 0 0" }, children: visibleLayers.map(layoutCreateNodeFor) },
        note: "This is a safe native-widget scaffold for the Enfusion layout_create tool. Pixel-fixed slots preserve the Composer canvas at the exported root size; open and resave in Workbench Layout Editor before production. For any widget with a source path, replace the scaffold frame with the listed vanilla/WLib layout in Layout Editor."
      },
      safety: {
        layoutAuthoring: "Open the new layout in Workbench Layout Editor. Do not hand-edit .layout XML; Workbench owns widget GUIDs and serialization.",
        visualReferences: "Reference-board images are intentionally excluded from this import plan. Keep them in the .bwui project bundle.",
        nextSteps: [
          "Use layoutCreateRequest with the Enfusion layout_create tool to generate a native-widget scaffold in an isolated addon, or create the target GUI layout manually at the listed layoutPath.",
          "Open the scaffold in Layout Editor, set root size, and replace source-backed frames with their listed WLib/vanilla layout prefabs using the plan's names, anchors, and bounds.",
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
      ctx.fillText(layer.text, layer.type === "text" ? layer.x : layer.x + layer.w / 2, layer.y + layer.h / 2, layer.w - 16);
    } else if (layer.type === "icon") {
      ctx.save(); ctx.translate(layer.x + layer.w / 2, layer.y + layer.h / 2); ctx.rotate(Math.PI / 4); ctx.strokeStyle = layer.color; ctx.lineWidth = 5; const size = Math.min(layer.w, layer.h) * .35; ctx.strokeRect(-size / 2, -size / 2, size, size); ctx.restore();
    } else if (layer.type === "player") {
      ctx.fillStyle = layer.accent; ctx.beginPath(); ctx.arc(layer.x + 29, layer.y + layer.h / 2, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = layer.color; ctx.textAlign = "left"; ctx.fillText(layer.text, layer.x + 58, layer.y + layer.h / 2, layer.w - 230);
      ctx.font = `700 ${Math.max(10, layer.fontSize * .68)}px Bahnschrift, sans-serif`; ctx.fillText("BRING ME   |   BRING PLAYER", layer.x + layer.w - 192, layer.y + layer.h / 2, 182);
    } else if (layer.type === "reforger") {
      drawReforgerPreview(ctx, layer);
    } else if (["window", "dialog", "prompt", "toast", "context", "tooltip", "tabs", "table", "toolbar", "progress", "input", "toggle", "assetcard", "squadtile", "inventory", "categorybar"].includes(layer.type)) {
      ctx.fillStyle = layer.accent;
      ctx.fillRect(layer.x, layer.y, layer.w, Math.min(5, layer.h));
      ctx.fillStyle = layer.color;
      ctx.textAlign = "left";
      ctx.font = `700 ${layer.fontSize}px Bahnschrift, Segoe UI, sans-serif`;
      ctx.fillText(layer.text, layer.x + 14, layer.y + Math.min(layer.h / 2, 30), layer.w - 28);
    }
    ctx.restore();
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

  function renderReforgerCatalog() {
    const catalog = window.BUSHWAR_REFORGER_CATALOG || { entries: [], disclaimer: "Catalogue unavailable." };
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
      button.className = "catalog-entry";
      button.title = `Add reference for ${item.path}`;
      button.innerHTML = `<span class="catalog-preview preview-${visual}">${escapeHtml(item.preview)}</span><span class="catalog-copy"><strong>${escapeHtml(item.name.replace(/\.layout$|\.edds$/i, ""))}</strong><small>${escapeHtml(item.path)}</small></span>`;
      button.addEventListener("click", () => addLayer("reforger", {
        name: item.name.replace(/\.layout$|\.edds$/i, ""), text: item.name.replace(/\.layout$|\.edds$/i, ""), resourcePath: item.path,
        catalogCategory: item.category, catalogKind: item.kind, catalogPreview: item.preview, reforgerVisual: visual, ...reforgerBoundsFor(visual)
      }));
      root.append(button);
    });
    $("#catalogCount").textContent = `(${visible}/${catalog.entries.length})`;
    $("#catalogNote").textContent = catalog.disclaimer;
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

  function validateHandoff() {
    const warnings = [];
    const references = state.layers.filter(layer => layer.type === "reference");
    const refAssets = references.filter(layer => layer.image).length;
    const importableLayers = state.layers.filter(layer => layer.type !== "reference");
    if (state.canvas.width < 1920 || state.canvas.height < 1080) warnings.push("Canvas is below Workbench's documented 1920 × 1080 minimum root size.");
    if (references.some(layer => !layer.locked)) warnings.push("One or more visual-reference layers are unlocked and can be moved accidentally.");
    if (references.some(layer => !layer.image)) warnings.push("One or more visual-reference layers have no embedded image.");
    if (state.layers.some(layer => layer.type === "reforger" && !layer.resourcePath)) warnings.push("A Reforger reference card is missing its resource path.");
    if (state.layers.some(layer => layer.type === "player" && !layer.binding)) warnings.push("One or more player rows are design-only; assign Connected players (engine) to read actual PlayerManager values at runtime.");
    const staticPlayerLabels = state.layers.filter(layer => {
      const label = `${layer.name || ""} ${layer.text || ""}`.toLowerCase();
      return !layer.binding && /\b(player\s+(alpha|bravo|charlie)|sgt\.?\s*james)\b/.test(label);
    });
    if (staticPlayerLabels.length) warnings.push("Static player-name text was found without an engine binding; replace it with Connected players (engine) so Workbench cannot show fake or empty rows.");
    state.layers.forEach(layer => {
      if (layer.functionId && !functionFor(layer)) warnings.push(`${layer.name || "A layer"} references an unknown callback contract.`);
      if (layer.functionId && functionFor(layer) && !functionFor(layer).targetKinds.includes(layer.type)) warnings.push(`${layer.name || "A layer"} uses a callback that is not defined for its widget type.`);
      if (layer.functionId === "player.row.select" && layer.binding !== "player.list.connected") warnings.push(`${layer.name || "The player row"} needs the Connected players engine binding before its playerId callback can be wired.`);
    });
    if (!state.layers.length) warnings.push("Project has no UI layers.");
    if (!state.handoff.layoutName.trim()) warnings.push("Give the Workbench layout a name before exporting its import plan.");
    const assets = assetSummary();
    const report = $("#validationReport");
    report.className = "validation-report";
    report.innerHTML = `<div class="validation-summary"><b>${warnings.length ? "Review before handoff" : "Ready for Workbench handoff"}</b><br>${state.layers.length} layer${state.layers.length === 1 ? "" : "s"} · ${importableLayers.length} importable UI widget${importableLayers.length === 1 ? "" : "s"} · ${refAssets} embedded reference board image${refAssets === 1 ? "" : "s"} · ${(assets.bytes / 1024 / 1024).toFixed(1)} MB portable bundle estimate.</div>${warnings.length ? `<ul class="validation-warnings">${warnings.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<p class="validation-ok">Save the authoritative .bwui.json file, then export the Workbench import plan. Create the listed layout in Workbench Layout Editor, apply the plan, and run Live Preview at your target resolutions.</p>`}<p class="hint">Reference-board images stay in the .bwui bundle; the import plan contains only real UI widgets, sources, names, anchors, and pixel bounds. Composer does not write production .layout XML or replace Workbench Layout Editor.</p>`;
    $("#validationDialog").showModal();
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(autoSaveSnapshot()));
    } catch { /* Storage is optional. */ }
  }

  function loadPersisted() {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      if (saved) state = normalizeState(JSON.parse(saved));
    } catch { state = freshState(); }
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

  function showReleaseNoticeIfNew() {
    const dialog = $("#updateDialog");
    try {
      if (localStorage.getItem(updateSeenStorageKey) === release.version) return;
    } catch { /* If browser storage is unavailable, show the update for this visit. */ }
    dialog.dataset.autoNotice = "true";
    window.setTimeout(() => { if (!dialog.open) dialog.showModal(); }, 180);
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

  $("#backgroundBtn").addEventListener("click", () => $("#backgroundInput").click());
  $("#referenceBtn").addEventListener("click", () => $("#referenceInput").click());
  $("#referenceInput").addEventListener("change", event => { addReferenceFiles(event.target.files); event.target.value = ""; });
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
  renderReforgerCatalog();
  updateUndoButtons();
  if (!state.layers.length) applyTemplate("gm-admin"); else render();
  showReleaseNoticeIfNew();
})();
