# Run Chart Visualization

**Microsoft Store Desktop Application** - Professional statistical process control charts for Windows.

> **📦 This repository contains the dedicated Microsoft Store version** built with Vue.js and packaged as MSIX. For other Run Chart implementations, see [RunChart-Goal](https://github.com/PatrickRutledge/RunChart-Goal).

A professional desktop application for creating statistical process control (SPC) charts, built with Vue.js and packaged for the Microsoft Store.

## 🚀 Features

- **Professional Run Charts** - Create statistical process control charts with goal limits
- **Data Import** - Support for Excel, CSV, and manual data entry
- **Export Options** - Generate PDF reports and high-resolution images
- **Trend Analysis** - Identify process variations and control boundaries
- **Offline Functionality** - Works without internet connection
- **Business Ready** - Clean interface designed for manufacturing and quality control

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Charting**: Chart.js with vue-chartjs
- **Build Tool**: Vite
- **Packaging**: MSIX for Microsoft Store
- **Styling**: Custom CSS

## 📦 Microsoft Store

**Status**: ✅ Published on Microsoft Store  
**App Name**: Run Chart Visualization  
**Publisher**: Aether Forge  
**Category**: Productivity > Business  

[Download from Microsoft Store](https://apps.microsoft.com/store/search/run%20chart%20visualization) *(link will be active after certification)*

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- Windows 10/11 (for MSIX packaging)
- Windows SDK (for makeappx.exe)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Run_Chart_Store

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:store  # Build optimized for Microsoft Store
npm run preview      # Preview production build
```

### MSIX Packaging
```bash
# Build and package for Microsoft Store
.\build-store.ps1
```

## 📁 Project Structure

```
Run_Chart_Store/
├── src/                     # Vue.js source code
│   ├── components/          # Vue components
│   ├── composables/         # Vue composables
│   ├── assets/             # CSS and static assets
│   └── main.js             # Application entry point
├── public/                 # Static public files
├── store-assets/           # Microsoft Store submission assets
│   ├── screenshots/        # App screenshots
│   └── icons/             # Store icons
├── store-manifest/         # MSIX manifest files
├── dist/                  # Production build output
├── app/                   # MSIX app structure
└── package.json           # Dependencies and scripts
```

## 🎯 Target Users

- **Manufacturing** - Quality control and process monitoring
- **Six Sigma Professionals** - Statistical process improvement
- **Quality Engineers** - Trend analysis and reporting
- **Operations Managers** - Performance tracking

## 📊 Key Capabilities

### Chart Creation
- Run charts with time-series data visualization
- Configurable goal limits and control boundaries
- Statistical process control calculations
- Trend identification and analysis

### Data Management
- Excel file import (.xlsx, .xls)
- CSV file import with custom delimiters
- Manual data entry with validation
- Data export for backup and sharing

### Professional Output
- PDF report generation
- High-resolution PNG/JPG export
- Print-ready formatting
- Customizable chart appearance

## 🔐 Privacy & Security

- **Offline First** - No data sent to external servers
- **Local Storage** - All data stays on your device
- **No Tracking** - Respects user privacy
- **Secure** - Meets Microsoft Store security requirements

## 📝 License

Copyright © 2025 Aether Forge. All rights reserved.

## 🤝 Contributing

This is a commercial application. For bug reports or feature requests, please contact support.

## 📞 Support

- **Email**: [Your support email]
- **Website**: https://patrickrutledge.github.io/
- **Microsoft Store**: Report through store listing

## 🎉 Acknowledgments

- Built with Vue.js and Chart.js
- Icons and UI design inspiration from Microsoft Fluent Design
- Statistical process control methodology from Six Sigma standards

---

**Ready for production use in manufacturing, quality control, and business process improvement.**

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
