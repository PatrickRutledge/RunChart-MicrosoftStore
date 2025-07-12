# Run Chart Analytics - Microsoft Store Build

This is a clean, streamlined version for Microsoft Store packaging.

## Directory Structure

```
Run_Chart_Store/
├── src/                     # Vue.js source code
├── public/                  # Static assets
├── store-manifest/          # Microsoft Store packaging files
│   ├── AppxManifest.xml    # Store app manifest
│   └── RunChartAnalytics.pfx # Code signing certificate
├── build-store.ps1          # Automated build script
├── install-test.ps1         # Local testing script
├── package.json             # Dependencies (minimal set)
├── vite.config.js           # Build configuration
├── index.html               # App entry point
└── RunChartAnalytics.msix   # Generated store package
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for Microsoft Store:**
   ```powershell
   .\build-store.ps1
   ```

3. **Test locally** (as Administrator):
   ```powershell
   .\install-test.ps1
   ```

## Dependencies (Minimal Set)

**Runtime:**
- Vue 3 + Chart.js for the app
- html2canvas + jsPDF for export functionality
- PWA support for offline capability

**Build:**
- Vite for fast building
- Vue plugin for Vite

## Microsoft Store Submission

The generated `RunChartAnalytics.msix` file is ready for Microsoft Store submission.

For store submission you'll need:
- Microsoft Store Developer account
- Proper code signing certificate (replace the current self-signed one)
- Store listing details (description, screenshots, etc.)

## Build Modes

- `npm run dev` - Development server
- `npm run build:store` - Production build for Microsoft Store
- `.\build-store.ps1` - Complete packaging with MSIX creation
