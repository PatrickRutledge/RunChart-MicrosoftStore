# Enable developer mode (requires admin)
$developerMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
if ($null -eq $developerMode -or $developerMode.AllowDevelopmentWithoutDevLicense -ne 1) {
    Write-Host "Enabling Developer Mode..."
    Start-Process powershell -Verb RunAs -ArgumentList '-Command "Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock -Name AllowDevelopmentWithoutDevLicense -Value 1"'
}

# Clean previous builds
Remove-Item -Path "dist-electron" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-temp" -Recurse -Force -ErrorAction SilentlyContinue

# Build the app
Write-Host "Building application..."
npm run build:store

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

# Create package directory structure
Write-Host "Creating package structure..."
New-Item -ItemType Directory -Path "package-temp" -Force | Out-Null
New-Item -ItemType Directory -Path "package-temp\app" -Force | Out-Null

# Copy built app to package directory
Copy-Item -Path "dist\*" -Destination "package-temp\app" -Recurse -Force

# Copy manifest (rename to AppxManifest.xml as required by makeappx)
Copy-Item -Path "store-manifest\AppxManifest.xml" -Destination "package-temp\AppxManifest.xml" -Force

# Copy assets - use our proper PNG files
New-Item -ItemType Directory -Path "package-temp\Assets" -Force | Out-Null

# Copy our properly created PNG files
if (Test-Path "app\Assets\StoreLogo.png") {
    Copy-Item -Path "app\Assets\StoreLogo.png" -Destination "package-temp\Assets\StoreLogo.png" -Force
    Copy-Item -Path "app\Assets\Square150x150Logo.png" -Destination "package-temp\Assets\Square150x150Logo.png" -Force
    Copy-Item -Path "app\Assets\Square44x44Logo.png" -Destination "package-temp\Assets\Square44x44Logo.png" -Force
    Copy-Item -Path "app\Assets\Wide310x150Logo.png" -Destination "package-temp\Assets\Wide310x150Logo.png" -Force
    Copy-Item -Path "app\Assets\Square310x310Logo.png" -Destination "package-temp\Assets\Square310x310Logo.png" -Force
    Copy-Item -Path "app\Assets\Square71x71Logo.png" -Destination "package-temp\Assets\Square71x71Logo.png" -Force
    Write-Host "Copied PNG assets from app\Assets\"
} else {
    Write-Host "Warning: PNG assets not found in app\Assets\"
}

# Find makeappx.exe
$makeappxPath = Get-ChildItem "C:\Program Files (x86)\Windows Kits\" -Recurse -Name "makeappx.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($makeappxPath) {
    $makeappxFullPath = "C:\Program Files (x86)\Windows Kits\$makeappxPath"
    Write-Host "Found makeappx at: $makeappxFullPath"
    
    # Create MSIX package
    Write-Host "Creating MSIX package..."
    & "$makeappxFullPath" pack /d "package-temp" /p "RunChartAnalytics.msix" /l /o
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MSIX package created successfully: RunChartAnalytics.msix"
    } else {
        Write-Error "Failed to create MSIX package"
    }
} else {
    Write-Error "makeappx.exe not found. Please install Windows SDK."
}

Write-Host "Build complete. Check for RunChartAnalytics.msix file."
