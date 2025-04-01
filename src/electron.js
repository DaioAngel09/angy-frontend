const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenu(null); // Remove a barra de menus

  // Garante que o caminho da build está correto
  const startUrl = `file://${path.join(__dirname, "..", "build", "index.html")}`;

  mainWindow.loadURL(startUrl).catch(err => console.error("Erro ao carregar HTML:", err));

  mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
