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

console.log("source-backed.test.js: PASS");
