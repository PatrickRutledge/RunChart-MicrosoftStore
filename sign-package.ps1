# Find signtool.exe
$signtoolPath = Get-ChildItem "C:\Program Files (x86)\Windows Kits\" -Recurse -Name "signtool.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($signtoolPath) {
    $signtoolFullPath = "C:\Program Files (x86)\Windows Kits\$signtoolPath"
    Write-Host "Found signtool at: $signtoolFullPath"

    # Sign the package
    Write-Host "Signing MSIX package..."
    & "$signtoolFullPath" sign /fd SHA256 /a /f "TestCertificate.pfx" /p "testpassword" "RunChartAnalytics.msix"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Package signed successfully!"
    } else {
        Write-Error "Failed to sign package"
    }
} else {
    Write-Error "signtool.exe not found. Please install Windows SDK."
}