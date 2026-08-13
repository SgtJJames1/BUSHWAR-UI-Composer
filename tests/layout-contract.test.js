const fs = require("fs");
const path = require("path");

const candidate = process.env.BUSHWAR_VALIDATION_LAYOUT || path.resolve(__dirname, "../../../Reforger-Workbench-Mods/BUSHWAR-UIComposer-Validation/UI/layouts/BWUIC_RuntimeAdminMenu.layout");
if (!fs.existsSync(candidate)) {
  console.log("layout-contract.test.js: SKIP (validation layout is not present beside this Composer checkout)");
  process.exit(0);
}
const source = fs.readFileSync(candidate, "utf8");
if (!source.includes("Anchor 0 0.15 0 0.8") || !source.includes("PositionX 24") || !source.includes("SizeX 360")) {
  throw new Error("runtime admin panel must retain the 24 px / 360 px / 15%-80% Position/Size geometry");
}
if (source.includes("OffsetRight") || source.includes("OffsetBottom")) {
  throw new Error("runtime admin panel must not use legacy Offset* geometry for fixed pixel children");
}
if (!source.includes('Name "m_wRefresh"') || !source.includes('Name "m_wRefreshText"')) {
  throw new Error("validation layout must retain the concrete refresh action control");
}
console.log("layout-contract.test.js: PASS");
