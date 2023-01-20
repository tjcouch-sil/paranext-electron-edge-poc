# paranext-electron-edge-poc
Proof of concept to run C# from Electron for Paranext

To run:
1. Install Node dependencies with `npm install`
2. [First time running] Run `npm start` (or launch 'Build sln and Debug' in VS Code) to build the QuickStart.sln and run the Electron app
3. [After the first run] Run `npm run start:core` (or launch 'Debug Electron App' in VS Code) to run the Electron app without building the QuickStart.sln

From Quick start for `electron-edge-js`  https://github.com/agracio/electron-edge-js
================

# electron-edge-js-quick-start

1. Install dependencies `npm install`
2. Build `src\QuickStart.sln` using Visual Studio 2017 or JetBrains Rider or run `dotnet build src/QuickStart.sln`
3. To run the app using .NET Core use `npm start` or `npm run start:core`
4. ~~To run the app using .NET Standard use `npm run start:standard`~~