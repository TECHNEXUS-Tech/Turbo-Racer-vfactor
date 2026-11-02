/* V-FACTOR STUDIOS // @_the_v_factor_ // BUILT BY VINAY — ELECTRON WINDOWS DESKTOP LAUNCHER */
"use strict";

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createTurboRacerWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 960,
    minHeight: 540,
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: "#04050a",
    title: "TURBO RACER — V-FACTOR STUDIOS",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(function() {
  createTurboRacerWindow();

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) {
      createTurboRacerWindow();
    }
  });
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});