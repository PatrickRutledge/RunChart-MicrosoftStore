# Test script to debug MSIX app launch issues

Write-Host "Testing Run Chart Visualization MSIX Package" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if installed
$app = Get-AppxPackage -Name "*RunChartVisualization*"
if ($app) {
    Write-Host "App is installed" -ForegroundColor Green
    Write-Host "  Package: $($app.PackageFullName)"
    Write-Host "  Location: $($app.InstallLocation)"

    # Check files in install location
    Write-Host "`nChecking app files:" -ForegroundColor Yellow
    if (Test-Path $app.InstallLocation) {
        Get-ChildItem -Path "$($app.InstallLocation)\app" -Recurse | Select-Object Name, Length | Format-Table
    }

    # Try to launch
    Write-Host "`nAttempting to launch app..." -ForegroundColor Yellow
    try {
        # Method 1: Using start command
        Start-Process "explorer.exe" -ArgumentList "shell:AppsFolder\$($app.PackageFamilyName)!RunChartVisualization"
        Write-Host "Launch command sent. Check if app window opens." -ForegroundColor Cyan
    } catch {
        Write-Host "Failed to launch: $_" -ForegroundColor Red
    }

} else {
    Write-Host "App is not installed" -ForegroundColor Red
    Write-Host "Run: Add-AppxPackage -Path .\RunChartAnalytics.msix"
}