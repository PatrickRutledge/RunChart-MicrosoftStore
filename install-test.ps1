# Test installation script for RunChartAnalytics.msix
# This script will install the MSIX package for testing

Write-Host "Installing RunChart Analytics MSIX package for testing..."

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script needs to run as Administrator for package installation."
    Write-Host "Please run PowerShell as Administrator and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

# Enable developer mode if not already enabled
$developerMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
if ($null -eq $developerMode -or $developerMode.AllowDevelopmentWithoutDevLicense -ne 1) {
    Write-Host "Enabling Developer Mode..."
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -Value 1
}

# Check if package exists
if (-not (Test-Path "RunChartAnalytics.msix")) {
    Write-Host "Error: RunChartAnalytics.msix not found in current directory."
    Write-Host "Please run build-store.ps1 first to create the package."
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Install the package
    Write-Host "Installing MSIX package..."
    Add-AppxPackage -Path "RunChartAnalytics.msix" -ForceApplicationShutdown
    
    Write-Host "✅ Package installed successfully!"
    Write-Host "You can now find 'Run Chart Analytics' in your Start menu."
    Write-Host ""
    Write-Host "To uninstall later, use:"
    Write-Host "Remove-AppxPackage PatRutledge.RunChartAnalytics"
    
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Common issues:"
    Write-Host "1. Package might already be installed (uninstall first)"
    Write-Host "2. Code signing issues (for store submission, you'll need proper certificates)"
    Write-Host "3. Manifest validation errors"
}

Read-Host "Press Enter to exit"
