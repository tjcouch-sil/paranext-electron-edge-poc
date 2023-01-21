// const cSharp = require('./cSharp.js');
/**
 * Calls electron to invoke an edge method
 * @param {string} classMethod Class name and method to call in dot notation like ClassName.Method
 * @param  {any} args arguments to pass into the method
 * @returns Promise that resolves with the return from the called method
 */
async function invoke(classMethod, args) {
  return window.electronAPI.edge.invoke(classMethod, args);
}

const cSharp = { invoke };

console.log("stuff");

document.addEventListener("DOMContentLoaded", function () {
  cSharp
    .invoke("LocalMethods.GetAppDomainDirectory")
    .then((result) => {
      document.getElementById("GetAppDomainDirectory").innerHTML = result;
    })
    .catch((error) => {
      throw error;
    });

  cSharp
    .invoke("LocalMethods.GetCurrentTime")
    .then((result) => {
      document.getElementById("GetCurrentTime").innerHTML = result;
    })
    .catch((error) => {
      throw error;
    });

  cSharp
    .invoke("LocalMethods.UseDynamicInput", "Node.Js")
    .then((result) => {
      document.getElementById("UseDynamicInput").innerHTML = result;
    })
    .catch((error) => {
      throw error;
    });

  cSharp
    .invoke("LocalMethods.ThrowException")
    .then((result) => {
      throw Error(
        `HandleException did not throw an exception! result: ${result}`
      );
    })
    .catch((error) => {
      document.getElementById("HandleException").innerHTML = error.toString();
    });

  cSharp
    .invoke("ExternalMethods.GetPersonInfo")
    .then((result) => {
      document.getElementById("GetPersonInfo").innerHTML = result;
    })
    .catch((error) => {
      throw error; /* JSON.stringify(error); */
    });

  // Attach handler for ShortAsynchronousMethod
  document
    .getElementById("ShortAsynchronousMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.ShortAsynchronousMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for ShortAsynchronousElectronMethod
  document
    .getElementById("ShortAsynchronousElectronMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.ShortAsynchronousElectronMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for ShortSynchronousMethod
  document
    .getElementById("ShortSynchronousMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.ShortSynchronousMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for ShortSynchronousElectronMethod
  document
    .getElementById("ShortSynchronousElectronMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.ShortSynchronousElectronMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for LongAsyncMethod
  document
    .getElementById("LongAsyncMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongAsyncMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for LongAsyncMethod
  document
    .getElementById("LongAsyncElectronMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongAsyncElectronMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for LongBlockingMethod
  document
    .getElementById("LongBlockingMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongBlockingMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for LongBlockingElectronMethod
  document
    .getElementById("LongBlockingElectronMethod")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongBlockingElectronMethod")
        .then((result) => console.log(result))
    );

  // Attach handler for ShortAsynchronousMethodSynced
  document
    .getElementById("ShortAsynchronousMethodSynced")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.ShortAsynchronousMethodSynced")
        .then((result) => console.log(result))
    );

  // Attach handler for LongAsyncMethodSynced
  document
    .getElementById("LongAsyncMethodSynced")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongAsyncMethodSynced")
        .then((result) => console.log(result))
    );

  // Attach handler for LongBlockingMethodSynced
  document
    .getElementById("LongBlockingMethodSynced")
    .addEventListener("click", () =>
      cSharp
        .invoke("LocalMethods.LongBlockingMethodSynced")
        .then((result) => console.log(result))
    );
});
