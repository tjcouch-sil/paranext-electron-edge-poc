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

window.onload = function () {
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
};
