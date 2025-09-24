const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveChartData: (data) => ipcRenderer.invoke('save-chart-data', data),
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  
  // Print operations
  printChart: (imageData) => ipcRenderer.invoke('print-chart', imageData),
  
  // Dialog operations
  showErrorDialog: (title, content) => ipcRenderer.invoke('show-error-dialog', title, content),
  showInfoDialog: (title, message, detail) => ipcRenderer.invoke('show-info-dialog', title, message, detail),
  
  // System information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),
  
  // Menu event listeners
  onMenuNewChart: (callback) => ipcRenderer.on('menu-new-chart', callback),
  onMenuExportChart: (callback) => ipcRenderer.on('menu-export-chart', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform detection
  platform: process.platform,
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
})

// Expose a limited set of Node.js APIs
contextBridge.exposeInMainWorld('nodeAPI', {
  // Path utilities (safe to expose)
  path: {
    join: (...paths) => require('path').join(...paths),
    basename: (path) => require('path').basename(path),
    dirname: (path) => require('path').dirname(path),
    extname: (path) => require('path').extname(path)
  }
})

// Log that preload script has loaded
console.log('Electron preload script loaded successfully')