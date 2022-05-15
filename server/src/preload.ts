const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    close: () => ipcRenderer.send('close'),
    openLink: (url: string) => require("electron").shell.openExternal(url),
    sysinfo: (func:any) => {
        func({
            cpu: require("os").cpus()[0].model,
            memory: (require("os").totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        });
    },
})

console.log("Method exposed");
