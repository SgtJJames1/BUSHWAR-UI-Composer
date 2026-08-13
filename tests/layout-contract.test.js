const fs = require("fs");
const path = require("path");

const candidate = process.env.BUSHWAR_VALIDATION_LAYOUT || path.resolve(__dirname, "../../../Reforger-Workbench-Mods/BUSHWAR-UIComposer-Validation/UI/layouts/BWUIC_RuntimeAdminMenu.layout");
if (!fs.existsSync(candidate)) {
  console.log("layout-contract.test.js: SKIP (validation layout is not present beside this Composer checkout)");
  process.exit(0);
}
const source = fs.readFileSync(candidate, "utf8");
if (!source.includes("Anchor 0 0.15 0 0.8") || !source.includes("OffsetLeft 24") || !source.includes("OffsetRight -384")) {
  throw new Error("runtime admin panel must retain the 24 px / 360 px / 15%-80% Offset* geometry");
}
if (source.includes("OffsetRight 384") || source.includes("OffsetBottom 52\n") || source.includes("OffsetBottom 110\n")) {
  throw new Error("runtime admin panel must not use positive right/bottom offsets that collapse point-anchored widgets");
}
if (source.includes("PositionX") || source.includes("SizeX")) {
  throw new Error("runtime admin panel must not regress to PositionX/SizeX shorthand");
}
if (!source.includes('Name "m_wRefresh"') || !source.includes('Name "m_wRefreshText"')) {
  throw new Error("validation layout must retain the concrete refresh action control");
}
console.log("layout-contract.test.js: PASS");
