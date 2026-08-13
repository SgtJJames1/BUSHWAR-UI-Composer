const fs = require("fs");
const assert = require("assert");

const recipes = fs.readFileSync(require.resolve("../reforger-recipes.js"), "utf8");
const app = fs.readFileSync(require.resolve("../app.js"), "utf8");
const index = fs.readFileSync(require.resolve("../index.html"), "utf8");

assert(recipes.includes("gm-connected-players"), "recipe database must include the runtime GM player recipe");
assert(recipes.includes("info-panel") && recipes.includes("progress-hud"), "recipe database must include native HUD recipes");
assert(recipes.includes("requiredChildren"), "recipes must declare named Workbench children");
assert(recipes.includes("workbenchRecipe"), "recipes must retain the proven Workbench recipe identifier");
assert(index.includes("reforger-recipes.js"), "recipe database must be loaded by the Composer");
assert(index.includes("reforgerRecipes"), "Composer must expose the native recipe palette");
assert(app.includes("function recipeCatalog()"), "app must resolve the native recipe database");
assert(app.includes("function applyEngineRecipe"), "app must apply a native recipe into editable layers");
assert(app.includes("requiredChildren: clone(recipe.requiredChildren"), "native recipe contracts must travel into the handoff layers");
assert(app.includes("recipeCallbacks: clone(recipe.callbacks"), "recipe callback contracts must remain metadata until a concrete engine binding is selected");

console.log("recipe-contract.test.js: PASS");
