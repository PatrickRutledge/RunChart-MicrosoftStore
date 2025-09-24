import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Enhanced initialization with step-by-step logging
console.log('Starting Vue application initialization...')

// Check if we're in a UWP context or Electron
const isUWP = typeof Windows !== 'undefined'
const isElectron = typeof window.electronAPI !== 'undefined'
const isCapacitor = typeof window.Capacitor !== 'undefined'

console.log('Environment detection:')
console.log('- UWP context:', isUWP)
console.log('- Electron context:', isElectron)
console.log('- Capacitor context:', isCapacitor)

// Check system capabilities
console.log('User agent:', navigator.userAgent)
console.log('Platform:', navigator.platform)
console.log('ARM detection:', navigator.userAgent.includes('ARM') || navigator.platform.includes('ARM'))

let app
let initializationStarted = false

function initializeVueApp() {
  if (initializationStarted) {
    console.log('Vue app initialization already started')
    return
  }
  
  initializationStarted = true
  console.log('Creating Vue app instance...')
  
  try {
    // Error handling for the app
    app = createApp(App)

    // Global error handler
    app.config.errorHandler = (err, instance, info) => {
      console.error('Vue Error:', err)
      console.error('Component:', instance)
      console.error('Info:', info)
      
      // Try to keep the app running instead of crashing
      return false
    }

    // Global warning handler
    app.config.warnHandler = (msg, instance, trace) => {
      console.warn('Vue Warning:', msg)
      console.warn('Trace:', trace)
    }

    console.log('Mounting Vue app to #app...')
    app.mount('#app')
    
    console.log('Vue app mounted successfully')
    
    // Notify the HTML that Vue is ready
    if (typeof window.vueAppReady === 'function') {
      console.log('Calling vueAppReady callback...')
      window.vueAppReady()
    }
    
  } catch (error) {
    console.error('Failed to mount Vue app:', error)
    
    // Show error in the app container
    const appElement = document.getElementById('app')
    if (appElement) {
      appElement.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; background: #ffe6e6; border: 2px solid #ff6b6b; border-radius: 8px; margin: 20px;">
          <h2 style="color: #d63031; margin-top: 0;">Vue Application Error</h2>
          <p>The Vue.js application failed to start. The app will fall back to basic mode.</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Stack:</strong> ${error.stack}</p>
          <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 10px;">Reload Application</button>
        </div>
      `
    }
    
    // Don't call vueAppReady - let the timeout handle it
    throw error
  }
}

// Use different initialization strategies based on environment
if (document.readyState === 'loading') {
  console.log('DOM is loading, waiting for DOMContentLoaded...')
  document.addEventListener('DOMContentLoaded', initializeVueApp)
} else {
  console.log('DOM already loaded, initializing immediately...')
  // Small timeout to ensure everything is ready
  setTimeout(initializeVueApp, 100)
}

// Additional fallback timeout
setTimeout(() => {
  if (!initializationStarted) {
    console.warn('Vue app initialization not started after 2 seconds, forcing initialization...')
    initializeVueApp()
  }
}, 2000)
