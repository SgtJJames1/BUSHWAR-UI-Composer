const fs = require("fs");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const index = fs.readFileSync(require.resolve("../index.html"), "utf8");
assert(source.includes("function recommendedSourceFor(layer)"), "recommended Reforger source lookup must remain available");
assert(source.includes("function sourceBackedLayer(layer)"), "source-backed layer detection must remain available");
assert(source.includes("sourceBacked: !!widget.source"), "layout nodes must carry source-backed metadata");
assert(source.includes('if (sourceBackedLayer(layer) && !["table", "player"].includes(layer.type))'), "source-backed palette visuals must render before generic mock content");
assert(index.includes("useRecommendedSourceBtn"), "inspector must expose the recommended source action");
assert(source.includes("layer.resourcePath = entry.path"), "recommended source action must preserve the registered layout path");
assert(source.includes("requiredNamedChildren: runtimeChildNames"), "runtime source contracts must carry required named children");
assert(source.includes("confirm Count/Selection/Scroll/List and row NameText names"), "source-backed connected lists must require named-child verification");
assert(source.includes("sourceChildVerificationRequired:"), "Workbench plans must summarize source-child verification requirements");
assert(source.includes("const useNativeSource = layerOverrides.useNativeSource !== false"), "new palette layers must have an explicit native-source opt-out");
assert(source.includes("layer.type !== \"table\""), "runtime connected-player tables must remain explicit scaffolds instead of silently adopting a prefab");
assert(source.includes("layer.catalogWorkbenchAction = source.workbenchAction"), "default source-backed layers must retain the Workbench action metadata");
assert(source.includes("const sourceChildVerification = source && binding ? \"manual-required\" : undefined"), "all source-backed runtime bindings must expose child verification");
assert(source.includes("confirm the bound value child name and widget type"), "source-backed scalar bindings must warn about named-child verification");
assert(source.includes("runtimeValueWidgetName"), "source-backed scalar bindings must support an explicit runtime child-name override");
assert(index.includes("runtimeValueWidgetName"), "inspector must expose the runtime value child-name override");
assert(source.includes("runtimeContract: widget.runtimeContract"), "runtime scaffolds must preserve the widget runtime contract for controller generation");
assert(source.includes("valueWidgetName: widget.runtimeContract?.valueWidgetName"), "runtime scaffolds must preserve the verified value child name");
assert(source.includes("offsetRight: left + Math.round(layer.w)"), "pixel-authored layout slots must emit Workbench Offset* bounds");
assert(!source.includes("positionX: left"), "layout handoff must not rely on PositionX/SizeX shorthand that can collapse to the origin");

console.log("source-backed.test.js: PASS");
