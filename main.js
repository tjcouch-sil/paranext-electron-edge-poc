const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

/** ELECTRON SETUP */

const versionArg = process.argv.find((argv) =>
  argv.startsWith("--dotnetversion=")
);
const version = versionArg?.replace("--dotnetversion=", "") || "";

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

/** Map of generated and wrapped edge functions to call on invoking edge functions */
const edgeFuncs = new Map();

/**
 * Creates an edge function that asynchronously calls C# and returns a promise
 * @param {string} ns namespace for edge function
 * @param {string} className class name for edge function
 * @param {string} method method name for edge function
 * @returns promise that resolves with the results of the edge function call and rejects on exceptions
 */
function createEdgeFunc(ns, className, method) {
  // Load up an edge function with the specs provided
  const edgeFunc = edge.func({
    assemblyFile: baseDll,
    typeName: `${ns}.${className}`,
    methodName: method,
  });
  // Wrap the edge function in a promise function
  return (args) => {
    return new Promise((resolve, reject) => {
      try {
        edgeFunc(args, (error, result) => {
          if (error) {
            console.error(
              "Error in callback! Under what conditions does this occur?",
              error
            );
            reject(error);
          }
          resolve(result);
        });
      } catch (e) {
        // C# exceptions are caught here
        reject(e);
      }
    });
  };
}

/**
 * Invokes an edge method
 * @param {string} classMethod Class name and method to call in dot notation like ClassName.Method
 * @param  {any} args arguments to pass into the method
 * @returns Promise that resolves with the return from the called method
 */
async function invoke(classMethod, args) {
  if (!classMethod) throw Error("No method provided");

  const addressParts = classMethod.split(".", 3);
  if (addressParts.length < 2)
    throw Error("Must provide class and method like Class.Method");

  // Namespace has a default, but the classMethod can provide one if desired
  let ns = namespace;
  let className = "";
  let method = "";
  // Namespace provided
  if (addressParts.length === 3) {
    [ns, className, method] = addressParts;
  } else {
    [className, method] = addressParts;
  }

  // fully specified namespace, class, and method
  const fullClassMethod = `${ns}.${className}.${method}`;

  // See if we can find an existing edgefunc for this Namespace.Class.Method
  let edgeFunc = edgeFuncs.get(fullClassMethod);

  if (!edgeFunc) {
    // Didn't find an edgeFunc, so create one
    edgeFunc = createEdgeFunc(ns, className, method);
    edgeFuncs.set(fullClassMethod, edgeFunc);
  }

  if (method === "LongAsyncMethod" || method === "LongBlockingMethod") {
    console.log(`${method} about to invoke`);
    const edgeFuncPromise = edgeFunc(args).then((result) => {
      console.log(`${method} finished and promise resolved`);
      return result;
    });
    console.log(`${method} invoking finished`);
    return edgeFuncPromise;
  }

  return edgeFunc(args);
}

/** IPC HANDLING SETUP */

/** Map from ipc channel to handler function */
const ipcHandlers = {
  "electronAPI.edge.invoke": (event, classMethod, args) =>
    invoke(classMethod, args),
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
