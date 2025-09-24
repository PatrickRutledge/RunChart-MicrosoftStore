# Run Chart Visualization - Microsoft Store Edition

[![Microsoft Store](https://img.shields.io/badge/Microsoft%20Store-Available-blue?logo=microsoft)](https://apps.microsoft.com/store/search/run%20chart%20visualization)
[![Version](https://img.shields.io/badge/Version-1.0.3-green)](https://github.com/PatrickRutledge/RunChart-MicrosoftStore)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%2F11-0078D4?logo=windows)](https://www.microsoft.com/windows)

**Professional statistical process control charts for Windows** - A robust desktop application for manufacturing quality control, Six Sigma analysis, and business process improvement.

> **📦 Microsoft Store Certified** - This repository contains the production Microsoft Store version built with Vue.js and packaged as MSIX with advanced error handling and ARM64 compatibility.

## 🎯 Product Information

- **Product Name**: Run Chart Visualization
- **Product ID**: 9PPS6JPTH1FN
- **Publisher**: Aether Forge
- **Current Version**: 1.0.3.0 (Microsoft Store Certified)
- **Architecture Support**: x64, x86, ARM64 (Surface Go 4 compatible)
- **Certification Status**: ✅ Passed rigorous Microsoft Store testing

## 🚀 Features

### Core Functionality
- **Professional Run Charts** - Statistical process control charts with customizable goal limits
- **Real-time Data Visualization** - Interactive charts with Chart.js integration
- **Statistical Analysis** - Automatic mean calculation, range analysis, and trend detection
- **Goal & Limit Lines** - Upper/lower specification limits with visual indicators
- **Data Validation** - Input validation with warning messages for invalid data

### Data Management
- **Flexible Input Methods** - Comma-separated data entry with real-time parsing
- **Export Capabilities** - PDF generation and high-resolution image export
- **Chart Customization** - Configurable titles, units of measure, and time scales
- **Data Persistence** - Local storage of chart configurations and data

### Enterprise Ready
- **Offline Functionality** - Works completely offline without internet connection
- **Professional Interface** - Clean, intuitive design for business environments
- **Error Recovery** - Advanced error handling with graceful degradation
- **Multi-Architecture Support** - Runs on Intel, AMD, and ARM64 processors (Surface devices)
- **Emergency Fallback** - Basic functionality even if main app components fail

## 🛠️ Technology Stack

### Frontend Framework
- **Vue.js 3.5.13** - Modern reactive framework with Composition API
- **Chart.js 4.3.3** - Professional charting library
- **Vue-ChartJS 5.2.0** - Vue.js wrapper for Chart.js integration

### Development Tools
- **Vite 6.2.4** - Fast build tool with HMR support
- **Node.js 18+** - JavaScript runtime environment
- **npm** - Package management

### Microsoft Store Integration
- **MSIX Packaging** - Modern Windows app packaging format
- **UWP WebView2** - Edge-based web runtime for Windows apps
- **Windows App Certification Kit** - Microsoft Store compliance testing
- **Capacitor Integration** - Native device feature access

### Additional Libraries
- **HTML2Canvas 1.4.1** - Screenshot generation for exports
- **jsPDF 3.0.1** - PDF generation capabilities
- **PWA Plugin** - Progressive Web App features

## 📦 Microsoft Store Details

### Certification Journey
**Status**: ✅ **CERTIFIED** - Passed Microsoft Store validation  
**Certification Challenges**: Successfully resolved crash issues on ARM64 devices  
**Testing Devices**: Surface Laptop 5, Surface Go 4, and other Microsoft hardware  
**OS Compatibility**: Windows 10 (17763+) through Windows 11 (26100+)

### Store Information
- **App Name**: Run Chart Visualization
- **Product ID**: 9PPS6JPTH1FN
- **Publisher**: Aether Forge
- **Category**: Productivity → Business
- **Package Size**: ~465KB (optimized)
- **Installation**: InstantOn MSIX deployment

### Architecture Support
- **x64**: Intel/AMD 64-bit processors
- **x86**: 32-bit legacy processor support
- **ARM64**: Surface Go 4, Surface Pro X, and other ARM devices

[📥 Download from Microsoft Store](https://apps.microsoft.com/store/detail/9PPS6JPTH1FN)

## 🔧 Development Setup

### Prerequisites
- **Node.js 18+** - JavaScript runtime with npm package manager
- **Windows 10/11** - Required for MSIX packaging and testing
- **Windows SDK** - Contains makeappx.exe for MSIX creation
- **Git** - Version control system
- **PowerShell 5.1+** - For build scripts

### System Requirements (Development)
```powershell
# Check Windows SDK installation
Get-ChildItem "C:\Program Files (x86)\Windows Kits\" -Recurse -Name "makeappx.exe"

# Verify Node.js version
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 8.0.0 or higher
```

### Quick Start
```bash
# Clone the repository
git clone https://github.com/PatrickRutledge/RunChart-MicrosoftStore.git
cd Run_Chart_Store

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Open browser to http://localhost:5173
```

### Build Commands
```bash
# Development
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally

# Production
npm run build        # Standard web build
npm run build:store  # Optimized build for Microsoft Store (relative paths)

# Microsoft Store Packaging
.\build-store.ps1    # Complete MSIX package creation
.\create-icons.ps1   # Generate all required store icons
.\install-test.ps1   # Install MSIX locally for testing
```

### Advanced Development
```bash
# Testing and Quality
npm run lint         # ESLint code quality check
npm test            # Run test suite (if configured)

# Certificate Management
.\create-test-cert.ps1   # Generate test certificate for local MSIX
.\sign-package.ps1       # Sign MSIX with certificate
```

## 📁 Project Structure

```
Run_Chart_Store/
├── 📂 src/                          # Vue.js Application Source
│   ├── 📂 components/               # Reusable Vue Components
│   │   ├── RunChartDisplay.vue      # Main chart rendering component
│   │   ├── HelloWorld.vue           # Welcome component
│   │   └── icons/                   # SVG icon components
│   ├── 📂 composables/              # Vue Composition API Logic
│   │   └── useCapacitor.js          # Capacitor integration & device features
│   ├── 📂 assets/                   # Styles and Static Assets
│   │   ├── main.css                 # Global application styles
│   │   ├── base.css                 # CSS reset and base styles
│   │   └── logo.svg                 # Application logo
│   ├── App.vue                      # Root Vue component with error handling
│   └── main.js                      # Application entry point with initialization
│
├── 📂 public/                       # Static Public Files
│   ├── favicon.ico                  # Browser favicon
│   ├── manifest.json                # PWA manifest
│   ├── privacy.html                 # Privacy policy page
│   ├── terms.html                   # Terms of service page
│   └── 📂 icons/                    # PWA icons
│
├── 📂 store-assets/                 # Microsoft Store Submission Assets
│   ├── 📂 icons/                    # Store listing icons (various sizes)
│   ├── 📂 screenshots/              # App screenshots for store listing
│   └── README.md                    # Asset creation guidelines
│
├── 📂 store-manifest/               # MSIX Packaging Configuration
│   ├── AppxManifest.xml             # MSIX manifest template
│   └── RunChartAnalytics.pfx        # Code signing certificate
│
├── 📂 app/                          # MSIX Application Structure
│   └── 📂 Assets/                   # MSIX required assets
│       ├── StoreLogo.png            # Store logo (various sizes)
│       ├── Square44x44Logo.png      # App tile icons
│       └── Wide310x150Logo.png      # Wide tile assets
│
├── 📂 package-temp/                 # Build Output (Generated)
│   ├── AppxManifest.xml             # Final MSIX manifest
│   ├── 📂 app/                      # Built application files
│   └── 📂 Assets/                   # Packaged assets
│
├── 📂 dist/                         # Vite Build Output
│   ├── index.html                   # Built HTML with asset references
│   └── 📂 assets/                   # Optimized JS/CSS bundles
│
├── 📄 Configuration & Scripts
├── package.json                     # npm dependencies and scripts
├── vite.config.js                   # Vite build configuration
├── index.html                       # Development HTML template
├── build-store.ps1                  # Main MSIX build script
├── create-icons.ps1                 # Icon generation script
├── install-test.ps1                 # Local installation script
├── create-test-cert.ps1             # Certificate creation script
│
├── 📄 Documentation
├── README.md                        # This comprehensive guide
├── MSIX_STORE_FIX.md               # Certification fixes documentation
├── STORE_README.md                  # Store-specific documentation
├── BUILD_README.md                  # Build process documentation
├── STORE_SUBMISSION_CHECKLIST.md   # Pre-submission checklist
└── FINAL_STATUS.md                  # Final certification status
```

## 🎯 Target Users & Applications

### Primary Industries
- **Manufacturing & Production** - Quality control and process monitoring
- **Six Sigma Professionals** - Statistical process improvement and DMAIC projects
- **Quality Engineers** - Trend analysis, capability studies, and SPC implementation
- **Operations Managers** - Performance tracking and continuous improvement
- **Healthcare** - Patient outcome tracking and quality metrics
- **Supply Chain** - Vendor performance and delivery reliability analysis

### Use Cases
- **Process Control**: Monitor manufacturing processes for stability
- **Quality Assurance**: Track defect rates and quality metrics over time
- **Performance Monitoring**: Visualize KPIs and operational metrics
- **Trend Analysis**: Identify patterns and process variations
- **Capability Studies**: Assess process performance against specifications
- **Root Cause Analysis**: Support problem-solving with data visualization

## 📊 Advanced Features & Capabilities

### Statistical Process Control
- **Run Chart Generation** - Time-series visualization with statistical analysis
- **Goal Line Management** - Configurable target values with visual indicators
- **Upper/Lower Specification Limits** - Quality boundaries with breach detection
- **Trend Detection** - Automatic identification of patterns and shifts
- **Mean Calculation** - Statistical center line with real-time updates
- **Range Analysis** - Process variation assessment

### Data Input & Validation
- **Flexible Data Entry** - Comma-separated input with real-time parsing
- **Input Validation** - Automatic detection and warning for invalid data
- **Data Cleaning** - Filters non-numeric values with user notification
- **Example Data** - Pre-loaded sample data for immediate testing
- **Dynamic Updates** - Real-time chart updates as data changes

### Customization & Configuration
- **Chart Titles** - Customizable chart headings and descriptions
- **Units of Measure** - Configurable measurement units (pounds, pieces, etc.)
- **Time Scale Labels** - Flexible time period labeling (days, weeks, etc.)
- **Color Schemes** - Professional color palettes for business use
- **Chart Sizing** - Responsive design for various screen sizes

### Export & Reporting
- **PDF Generation** - Professional reports with embedded charts
- **High-Resolution Images** - PNG/JPG export for presentations
- **Print Optimization** - Formatted output for physical reports
- **Data Backup** - Export raw data for external analysis
- **Share Functionality** - Easy sharing of charts and results

## �️ Reliability & Error Handling

### Triple-Layer Protection System
The application implements a sophisticated error handling system ensuring it works on all supported devices:

#### **Level 1: Full Application**
- Complete Vue.js application with all features
- Advanced charting with Chart.js integration
- Full data export and analysis capabilities
- Professional UI with animations and interactions

#### **Level 2: Error Recovery Mode**
- Vue.js application with error boundaries
- Graceful handling of component failures
- User-friendly error messages with recovery options
- Maintained core functionality during partial failures

#### **Level 3: Emergency Fallback**
- Pure HTML/JavaScript basic functionality
- Works even if Vue.js completely fails to load
- Basic run chart calculations and data entry
- Ensures app never completely crashes

### Device Compatibility
- **ARM64 Support**: Optimized for Surface Go 4 and ARM processors
- **Performance Scaling**: Adapts to device capabilities
- **Memory Management**: Efficient resource usage on low-end devices
- **WebView2 Compatibility**: Works with various Edge runtime versions

### Microsoft Store Certification
- **Rigorous Testing**: Passed certification on multiple device types
- **Security Compliance**: Meets all Microsoft Store security requirements
- **Performance Standards**: Optimized for fast startup and smooth operation
- **Accessibility**: Supports Windows accessibility features

## 🔐 Privacy & Security

### Data Protection
- **100% Offline** - No data transmission to external servers
- **Local Storage Only** - All calculations and data remain on your device
- **No User Tracking** - Completely respects user privacy
- **No Analytics** - No usage data collection or telemetry
- **Secure by Design** - Follows Microsoft Store security best practices

### Compliance & Standards
- **GDPR Compliant** - No personal data collection
- **Enterprise Ready** - Suitable for corporate environments
- **Data Sovereignty** - Complete data control remains with user
- **Audit Trail** - Local logging for troubleshooting only

## � Version History & Certification Journey

### Version 1.0.3.0 (Current - Microsoft Store Certified)
- **✅ ARM64 Compatibility** - Full support for Surface Go 4 and ARM processors
- **✅ Emergency Fallback System** - Triple-layer error protection
- **✅ Enhanced Initialization** - Robust startup with detailed logging
- **✅ Content Security Policy** - Advanced security for UWP environment
- **✅ Performance Optimization** - Optimized for low-end hardware

### Version 1.0.2.0 (Certification Attempt 2)
- **Windows 11 Support** - Updated MaxVersionTested to support build 26100.x
- **Enhanced Error Handling** - Vue.js global error handlers
- **Component Error Boundaries** - Graceful component failure recovery
- **Improved Logging** - Better debugging capabilities

### Version 1.0.1.0 (Initial Submission)
- **Core Functionality** - Basic run chart creation and analysis
- **Vue.js Implementation** - Modern reactive frontend
- **Chart.js Integration** - Professional charting library
- **MSIX Packaging** - Microsoft Store compatible packaging

### Certification Challenges Overcome
1. **Empty Content Issue** - Resolved asset loading problems
2. **Crash on Launch (Surface Laptop 5)** - Fixed Windows 11 compatibility
3. **ARM64 Crash (Surface Go 4)** - Implemented ARM64-specific handling

## 🔧 Build & Deployment Process

### Local Development Workflow
```bash
# 1. Setup development environment
npm install
npm run dev

# 2. Test changes locally
npm run build:store
.\install-test.ps1

# 3. Create production package
.\build-store.ps1

# 4. Verify package integrity
# Check RunChartAnalytics.msix file size and contents
```

### Microsoft Store Submission Checklist
- [ ] Version number incremented in AppxManifest.xml
- [ ] All assets properly sized and formatted
- [ ] Screenshots updated in store-assets/
- [ ] Privacy policy and terms updated
- [ ] MSIX package tested on multiple devices
- [ ] Performance tested on ARM64 devices
- [ ] Error handling tested with network disconnection
- [ ] Certification history documented

## 📞 Support & Contact

### Technical Support
- **GitHub Issues**: [Create Issue](https://github.com/PatrickRutledge/RunChart-MicrosoftStore/issues)
- **Developer Website**: [https://patrickrutledge.github.io/](https://patrickrutledge.github.io/)
- **Microsoft Store Support**: Available through store listing comments

### Business Inquiries
- **Licensing**: Contact for enterprise licensing options
- **Custom Features**: Available for business-specific requirements
- **Integration**: API development for existing systems

### Documentation Resources
- **Microsoft Store Guidelines**: [App Developer Agreement](https://docs.microsoft.com/en-us/legal/windows/agreements/app-developer-agreement)
- **MSIX Documentation**: [MSIX Packaging](https://docs.microsoft.com/en-us/windows/msix/)
- **Vue.js Documentation**: [Vue.js Guide](https://vuejs.org/guide/)

## 🎉 Acknowledgments & Credits

### Technology Stack
- **Vue.js Team** - For the excellent reactive framework
- **Chart.js Contributors** - For professional charting capabilities
- **Vite Team** - For fast and efficient build tooling
- **Microsoft** - For comprehensive development tools and store platform

### Design & UX
- **Microsoft Fluent Design** - UI/UX inspiration and guidelines
- **Capacitor Team** - For seamless native integration
- **Open Source Community** - For countless tools and libraries

### Statistical Process Control
- **Six Sigma Methodology** - Statistical foundations
- **ISO 9001 Standards** - Quality management principles
- **Manufacturing Best Practices** - Industry-standard SPC techniques

## 📋 License & Legal

### Software License
**Proprietary Software** - Copyright © 2025 Aether Forge. All rights reserved.

This software is licensed for use through the Microsoft Store. Redistribution, reverse engineering, or commercial use outside of the Microsoft Store terms is prohibited.

### Third-Party Licenses
All third-party libraries and dependencies maintain their respective licenses:
- Vue.js (MIT License)
- Chart.js (MIT License)
- Vite (MIT License)
- See package.json for complete dependency list

### Privacy Policy
Complete privacy policy available within the application and on the Microsoft Store listing. No personal data is collected or transmitted.

---

## 🏆 Production Ready

**✅ Microsoft Store Certified** - Rigorously tested and approved for business use  
**✅ Enterprise Grade** - Suitable for manufacturing, quality control, and process improvement  
**✅ Multi-Platform** - Supports x64, x86, and ARM64 architectures  
**✅ Offline Capable** - Complete functionality without internet connection  
**✅ Privacy Focused** - Zero data collection, complete user privacy  

**Ready for immediate deployment in professional environments.**

---

*For the latest updates and release notes, see [FINAL_STATUS.md](./FINAL_STATUS.md)*
