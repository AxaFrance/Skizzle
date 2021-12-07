const {
  app,
  contextBridge,
  ipcRenderer,
  shell
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "remote", {
    notification: (title, body) => ipcRenderer.send('notifier', { title, body }),
    authorize: (channel, provider) => ipcRenderer.send('oauth', channel, provider),
    setLaunchAtStartUp: (launchAtStartUp) => ipcRenderer.send('launch-startup', launchAtStartUp),
    restartApp: () => {
      app.relaunch();
      app.exit();
    },
    fileImport: () => ipcRenderer.invoke('file-import'),
    fileExport: (data) => ipcRenderer.invoke('file-export', data),
    copyToClipboard: (data) => ipcRenderer.invoke('copy-to-clipboard', data),
    checkForUpdateRequest: () => ipcRenderer.invoke('check-for-update-request'),
    checkForUpdateRestart: () => ipcRenderer.send('check-for-update-restart'),
    openDefaultBrowser: (url) => shell.openExternal(url),
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    setPreRelease: (preRelease) => {
      ipcRenderer.send('toggle-pre-release', preRelease)
    },
    version: () => ipcRenderer.invoke('get-version')
  }
);