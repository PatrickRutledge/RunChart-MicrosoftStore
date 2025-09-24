const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron')
const path = require('path')
const { writeFile } = require('fs/promises')

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'assets/icon.png'), // We'll need to create this
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false, // Don't show until ready
    titleBarStyle: 'default'
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    // Development mode
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // Only open DevTools if explicitly requested
    if (process.env.ELECTRON_DEVTOOLS === 'true') {
      mainWindow.webContents.openDevTools()
    }
  } else {
    // Production mode
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focus on window
    if (process.platform === 'darwin') {
      mainWindow.focus()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// App event handlers
app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    // On macOS re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    navigationEvent.preventDefault()
    shell.openExternal(navigationURL)
  })
})

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chart',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-chart')
          }
        },
        { type: 'separator' },
        {
          label: 'Export Chart',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export-chart')
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Run Chart Visualization',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Run Chart Visualization',
              message: 'Run Chart Visualization',
              detail: 'Version 1.0.3.0\nProfessional statistical process control charts\n\n© 2025 Aether Forge'
            })
          }
        },
        { type: 'separator' },
        {
          label: 'Visit Website',
          click: () => {
            shell.openExternal('https://patrickrutledge.github.io/')
          }
        }
      ]
    }
  ]

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC handlers for renderer process communication
ipcMain.handle('save-chart-data', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Chart Data',
      defaultPath: 'chart-data.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (filePath) {
      await writeFile(filePath, JSON.stringify(data, null, 2))
      return { success: true, filePath }
    }
    
    return { success: false, cancelled: true }
  } catch (error) {
    console.error('Error saving file:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('show-error-dialog', async (event, title, content) => {
  await dialog.showErrorBox(title, content)
})

ipcMain.handle('show-info-dialog', async (event, title, message, detail) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title,
    message,
    detail,
    buttons: ['OK']
  })
  return result
})

// Handle app updates and notifications
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-platform-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    electronVersion: process.versions.electron
  }
})

// Handle generic file saving with custom options
ipcMain.handle('save-file', async (event, options) => {
  try {
    const { data, defaultName, filters } = options
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save File',
      defaultPath: defaultName || 'file',
      filters: filters || [{ name: 'All Files', extensions: ['*'] }]
    })

    if (filePath) {
      // Handle base64 image data
      if (data.startsWith('data:image/')) {
        const base64Data = data.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        await writeFile(filePath, buffer)
      } else {
        // Handle regular text/JSON data
        await writeFile(filePath, data)
      }
      return { success: true, filePath }
    }
    
    return { success: false, cancelled: true }
  } catch (error) {
    console.error('Error saving file:', error)
    return { success: false, error: error.message }
  }
})

// Handle chart printing
ipcMain.handle('print-chart', async (event, imageData) => {
  try {
    // Create a new BrowserWindow for printing
    const printWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    // Create HTML content with the image
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Run Chart - Print</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            height: auto;
          }
          @media print {
            body { padding: 0; margin: 0; }
            img { max-height: 100vh; }
          }
        </style>
      </head>
      <body>
        <img src="${imageData}" alt="Run Chart" />
      </body>
      </html>
    `

    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`)
    
    // Print the window
    await printWindow.webContents.print({
      silent: false,
      printBackground: true,
      margins: {
        marginType: 'minimum'
      }
    })

    // Close the print window after a delay
    setTimeout(() => {
      printWindow.close()
    }, 1000)

    return { success: true }
  } catch (error) {
    console.error('Error printing chart:', error)
    return { success: false, error: error.message }
  }
})