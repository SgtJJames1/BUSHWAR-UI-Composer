"use strict";

const { app, BrowserWindow, dialog, shell } = require("electron");
const path = require("path");

const PRODUCT_NAME = "BUSHWAR UI Composer by Sgt.James";
const APP_ID = "com.bushwar.ui-composer";
let mainWindow;
let updateCheckStarted = false;

app.setName(PRODUCT_NAME);
app.setAppUserModelId(APP_ID);

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: PRODUCT_NAME,
    width: 1600,
    height: 960,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#0a1013",
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, "build", "icon.svg"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", event => event.preventDefault());
  mainWindow.on("closed", () => { mainWindow = null; });
}

function configureAutoUpdates() {
  // Auto-updates only run from the NSIS-installed, packaged application.
  // Local development and the portable build stay network-free.
  if (!app.isPackaged || updateCheckStarted) return;
  updateCheckStarted = true;

  try {
    const { autoUpdater } = require("electron-updater");
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("error", error => {
      console.error("Update check failed:", error?.message || error);
    });

    autoUpdater.on("update-downloaded", async () => {
      const { response } = await dialog.showMessageBox(mainWindow, {
        type: "info",
        title: "BUSHWAR UI Composer update ready",
        message: "An update has been downloaded.",
        detail: "Restart now to install it, or choose Later to install it when you close the app.",
        buttons: ["Restart now", "Later"],
        defaultId: 0,
        cancelId: 1
      });
      if (response === 0) autoUpdater.quitAndInstall();
    });

    // Wait until the main window is visible; update failures never block editing.
    setTimeout(() => autoUpdater.checkForUpdates().catch(error => {
      console.error("Unable to check for updates:", error?.message || error);
    }), 2500);
  } catch (error) {
    console.error("Auto-updater is unavailable:", error?.message || error);
  }
}

app.whenReady().then(() => {
  createWindow();
  configureAutoUpdates();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
