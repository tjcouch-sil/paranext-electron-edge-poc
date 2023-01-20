/**
 * Calls electron to invoke an edge method
 * @param {string} classMethod Class name and method to call in dot notation like ClassName.Method
 * @param  {any} args arguments to pass into the method
 * @returns Promise that resolves with the return from the called method
 */
async function invoke(classMethod, args) {
  return window.electronAPI.edge.invoke(classMethod, args);
}

module.exports = { invoke };
