const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  edge: {
    /**
     * Calls electron to invoke an edge method
     * @param {string} classMethod Class name and method to call in dot notation like ClassName.Method
     * @param  {any} args arguments to pass into the method
     * @returns Promise that resolves with the return from the called method
     */
    invoke: (classMethod, args) =>
      ipcRenderer.invoke("electronAPI.edge.invoke", classMethod, args),
  },
});
