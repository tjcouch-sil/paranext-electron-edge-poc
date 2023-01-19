const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

/** ELECTRON SETUP */

const version = process.argv[1].replace("--", "");

// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1052,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    `file://${__dirname}/index.html?version=${version}&electron-version=${process.versions.electron}`
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
  app.quit();
  //}
});

/** EDGE SETUP */

const namespace =
  "QuickStart." + version.charAt(0).toUpperCase() + version.substr(1);

const baseNetAppPath = path.join(
  __dirname,
  "/src/" + namespace + "/bin/Debug/net7.0"
);

process.env.EDGE_USE_CORECLR = 1;
if (version !== "standard") process.env.EDGE_APP_ROOT = baseNetAppPath;

const edge = require("electron-edge-js");

const baseDll = path.join(baseNetAppPath, namespace + ".dll");

const localTypeName = namespace + ".LocalMethods";
const externalTypeName = namespace + ".ExternalMethods";

const getAppDomainDirectory = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: "GetAppDomainDirectory",
});

const getCurrentTime = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: "GetCurrentTime",
});

const useDynamicInput = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: "UseDynamicInput",
});

const getPerson = edge.func({
  assemblyFile: baseDll,
  typeName: externalTypeName,
  methodName: "GetPersonInfo",
});

const handleException = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: "ThrowException",
});

/**
 * Invokes an edge method
 * @param {string} classMethod Class name and method to call in dot notation like ClassName.Method
 * @param  {...any} args arguments to pass into the method
 * @returns Promise that resolves with the return from the called method
 */
async function invoke(classMethod, ...args) {
  console.log(classMethod, args);
  return "stuff";
}

/** IPC HANDLING SETUP */

/** Map from ipc channel to handler function */
const ipcHandlers = {
  "electronAPI.edge.invoke": (event, classMethod, ...args) =>
    invoke(classMethod, ...args),
  /* 'ipc-scripture:getScriptureBook': (
        event,
        shortName,
        bookNum,
    ) => handleGetScriptureBook(event, 'json', shortName, bookNum),
    'ipc-webserver:getStartTime': handleGetStartTime, */
};

//app.enableSandbox();
app
  .whenReady()
  .then(() => {
    // Set up ipc handlers
    Object.keys(ipcHandlers).forEach((ipcHandle) =>
      ipcMain.handle(ipcHandle, ipcHandlers[ipcHandle])
    );

    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
