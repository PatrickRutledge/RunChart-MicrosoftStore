import { ref, onMounted, onUnmounted } from 'vue'

export function useElectron() {
  const isElectron = ref(false)
  const platformInfo = ref(null)
  const appVersion = ref('')

  // Menu event handlers
  const menuHandlers = new Map()

  onMounted(async () => {
    // Check if we're running in Electron
    isElectron.value = typeof window.electronAPI !== 'undefined'
    
    if (isElectron.value) {
      console.log('Electron environment detected, initializing...')
      
      try {
        // Get platform info
        platformInfo.value = await window.electronAPI.getPlatformInfo()
        console.log('Platform info:', platformInfo.value)
        
        // Get app version
        appVersion.value = await window.electronAPI.getAppVersion()
        console.log('App version:', appVersion.value)
        
        // Set up menu event listeners
        setupMenuHandlers()
        
      } catch (error) {
        console.error('Error initializing Electron features:', error)
      }
    }
  })

  onUnmounted(() => {
    if (isElectron.value) {
      // Clean up menu listeners
      cleanupMenuHandlers()
    }
  })

  function setupMenuHandlers() {
    // New chart handler
    const newChartHandler = () => {
      console.log('Menu: New Chart requested')
      // Emit event that components can listen to
      window.dispatchEvent(new CustomEvent('electron-menu-new-chart'))
    }
    
    // Export chart handler
    const exportChartHandler = () => {
      console.log('Menu: Export Chart requested')
      window.dispatchEvent(new CustomEvent('electron-menu-export-chart'))
    }

    // Store handlers for cleanup
    menuHandlers.set('new-chart', newChartHandler)
    menuHandlers.set('export-chart', exportChartHandler)

    // Set up listeners
    window.electronAPI.onMenuNewChart(newChartHandler)
    window.electronAPI.onMenuExportChart(exportChartHandler)
  }

  function cleanupMenuHandlers() {
    try {
      window.electronAPI.removeAllListeners('menu-new-chart')
      window.electronAPI.removeAllListeners('menu-export-chart')
      menuHandlers.clear()
    } catch (error) {
      console.error('Error cleaning up menu handlers:', error)
    }
  }

  // File operations
  async function saveChartData(chartData) {
    if (!isElectron.value) {
      console.warn('saveChartData called but not in Electron environment')
      return { success: false, error: 'Not in Electron environment' }
    }

    try {
      const result = await window.electronAPI.saveChartData(chartData)
      return result
    } catch (error) {
      console.error('Error saving chart data:', error)
      return { success: false, error: error.message }
    }
  }

  // Dialog operations
  async function showErrorDialog(title, content) {
    if (!isElectron.value) {
      console.warn('showErrorDialog called but not in Electron environment')
      return
    }

    try {
      await window.electronAPI.showErrorDialog(title, content)
    } catch (error) {
      console.error('Error showing error dialog:', error)
    }
  }

  async function showInfoDialog(title, message, detail = '') {
    if (!isElectron.value) {
      console.warn('showInfoDialog called but not in Electron environment')
      return
    }

    try {
      const result = await window.electronAPI.showInfoDialog(title, message, detail)
      return result
    } catch (error) {
      console.error('Error showing info dialog:', error)
    }
  }

  // Enhanced export with native file dialog
  async function exportChartWithDialog(chartData, _format = 'json') {
    if (!isElectron.value) {
      console.warn('exportChartWithDialog called but not in Electron environment')
      return { success: false, error: 'Not in Electron environment' }
    }

    try {
      const dataToSave = {
        ...chartData,
        exportDate: new Date().toISOString(),
        version: appVersion.value,
        platform: platformInfo.value
      }

      const result = await saveChartData(dataToSave)
      
      if (result.success) {
        await showInfoDialog(
          'Export Successful',
          'Chart data exported successfully!',
          `File saved to: ${result.filePath}`
        )
      }
      
      return result
    } catch (error) {
      console.error('Error exporting chart:', error)
      await showErrorDialog('Export Error', `Failed to export chart: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  // Menu event listeners for components
  function onMenuNewChart(callback) {
    window.addEventListener('electron-menu-new-chart', callback)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('electron-menu-new-chart', callback)
    }
  }

  function onMenuExportChart(callback) {
    window.addEventListener('electron-menu-export-chart', callback)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('electron-menu-export-chart', callback)
    }
  }

  return {
    // Reactive properties
    isElectron,
    platformInfo,
    appVersion,
    
    // File operations
    saveChartData,
    exportChartWithDialog,
    
    // Dialog operations
    showErrorDialog,
    showInfoDialog,
    
    // Menu event listeners
    onMenuNewChart,
    onMenuExportChart
  }
}