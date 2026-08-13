const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const source = fs.readFileSync(require.resolve("../app.js"), "utf8");
const start = source.indexOf("function handoffReadiness");
const end = source.indexOf("function renderWorkbenchWorkflow", start);
assert(start >= 0 && end > start, "workflow readiness helpers must remain present in app.js");
const sandbox = {
  normalizeLayoutGuid: value => {
    const guid = String(value || "").replace(/[{}]/g, "").trim().toUpperCase();
    return /^[0-9A-F]{16}$/.test(guid) && !/^0{16}$/.test(guid) ? guid : "";
  }
};
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}; this.handoffReadiness = handoffReadiness; this.workbenchWorkflowSteps = workbenchWorkflowSteps;`, sandbox);

const complete = { hasLayers: true, canvasWidth: 1920, canvasHeight: 1080, layoutName: "TestLayout", layoutGuid: "F487371808027463", rowResources: ["{F487371808027463}UI/layouts/BWUIC_CorePlayerRow.layout"] };

const ok = sandbox.handoffReadiness(complete);
assert.strictEqual(ok.ready, true, "complete handoff inputs must be ready");
assert.strictEqual(ok.issues.length, 0, "complete handoff must have no issues");

const noGuid = sandbox.handoffReadiness({ ...complete, layoutGuid: "", rowResources: [] });
assert.strictEqual(noGuid.ready, false, "missing layout GUID must not be ready");
assert(noGuid.issues.some(issue => /layout GUID/i.test(issue)), "missing layout GUID must be reported");

const zeroGuid = sandbox.handoffReadiness({ ...complete, layoutGuid: "0000000000000000", rowResources: [] });
assert.strictEqual(zeroGuid.ready, false, "zero GUID must not be ready");

const lowerGuid = sandbox.handoffReadiness({ ...complete, layoutGuid: "{f487371808027463}" });
assert.strictEqual(lowerGuid.ready, true, "lower-case brace-wrapped GUID must normalize and be accepted");

const smallCanvas = sandbox.handoffReadiness({ ...complete, canvasWidth: 1280, canvasHeight: 720 });
assert.strictEqual(smallCanvas.ready, false, "sub-1920 canvas must not be ready");
assert(smallCanvas.issues.some(issue => /1920 × 1080/.test(issue)), "canvas minimum must be reported");

const bareRow = sandbox.handoffReadiness({ ...complete, rowResources: ["UI/layouts/Row.layout"] });
assert.strictEqual(bareRow.ready, false, "bare row resource must not be ready");
assert(bareRow.issues.some(issue => /not GUID-qualified/i.test(issue)), "bare row resource must be reported");

const noLayers = sandbox.handoffReadiness({ ...complete, hasLayers: false });
assert.strictEqual(noLayers.ready, false, "empty project must not be ready");

const steps = sandbox.workbenchWorkflowSteps(complete);
assert.strictEqual(steps.length, 8, "workflow must contain eight steps");
assert.strictEqual(steps.filter(step => step.state === "done").length, 4, "design/export/guid/controller are done when ready");
assert.strictEqual(steps.filter(step => step.state === "manual").length, 4, "validate/create/register/smoke are Workbench-side manual steps");
assert.strictEqual(steps.filter(step => step.state === "todo").length, 0, "no todo steps when ready");

const notReadySteps = sandbox.workbenchWorkflowSteps({ ...complete, layoutGuid: "", rowResources: [] });
assert.strictEqual(notReadySteps.filter(step => step.state === "todo").length, 2, "guid and controller steps must be todo without a registered GUID");
assert.strictEqual(notReadySteps.find(step => step.id === "controller").state, "todo", "controller export must wait for the registered GUID");

// The exported schema-3 plan must embed the readiness contract.
assert(source.includes("handoff: {"), "workbench plans must embed a handoff readiness block");
assert(source.includes("handoffReadiness({"), "plan readiness must be computed by the shared helper");
assert(source.includes("renderWorkbenchWorkflow()"), "the workflow tracker must be refreshed by the app");

const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
assert(index.includes('id="workbenchWorkflow"'), "the Handoff panel must contain the workflow tracker");
assert(index.includes('id="workflowDialog"'), "the app must ship the Workbench workflow guide dialog");
assert(index.includes('id="downloadLayoutCreateBtn"'), "the app must offer downloading the layout scaffold request");
assert(index.includes("app.js?v=20260813-workflow"), "cache-busters must be bumped for this release");

console.log("workflow-steps.test.js: PASS");
