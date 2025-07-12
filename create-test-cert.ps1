# Create test certificate and sign MSIX package for local testing
# This script creates a self-signed certificate that Windows will accept for testing

Write-Host "Creating test certificate for local MSIX installation..."

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script needs to run as Administrator."
    Write-Host "Please run PowerShell as Administrator and try again."
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Create a test certificate
    Write-Host "Creating test certificate..."
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=PatRutledge Test Certificate" -KeyUsage DigitalSignature -FriendlyName "RunChart Test Certificate" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
    
    # Export certificate to file
    $pwd = ConvertTo-SecureString -String "testpassword" -Force -AsPlainText
    Export-PfxCertificate -cert $cert -FilePath "TestCertificate.pfx" -Password $pwd
    
    Write-Host "Certificate created: TestCertificate.pfx"
    
    # Install certificate to Trusted Root (required for MSIX)
    Write-Host "Installing certificate to Trusted Root..."
    Import-PfxCertificate -FilePath "TestCertificate.pfx" -CertStoreLocation "Cert:\LocalMachine\Root" -Password $pwd
    
    # Find signtool.exe
    $signtoolPaths = @(
        "C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe",
        "C:\Program Files (x86)\Windows Kits\10\App Certification Kit\signtool.exe"
    )
    
    $signtool = $null
    foreach ($path in $signtoolPaths) {
        $found = Get-ChildItem $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $signtool = $found.FullName
            break
        }
    }
    
    if (-not $signtool) {
        Write-Error "signtool.exe not found. Please install Windows SDK."
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "Found signtool at: $signtool"
    
    # Sign the MSIX package
    if (Test-Path "RunChartAnalytics.msix") {
        Write-Host "Signing MSIX package..."
        & "$signtool" sign /f "TestCertificate.pfx" /p "testpassword" /fd SHA256 "RunChartAnalytics.msix"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MSIX package signed successfully!"
            Write-Host ""
            Write-Host "Now try installing with:"
            Write-Host "Add-AppxPackage -Path 'RunChartAnalytics.msix'"
        } else {
            Write-Error "Failed to sign MSIX package"
        }
    } else {
        Write-Error "RunChartAnalytics.msix not found. Please run build-store.ps1 first."
    }
    
} catch {
    Write-Error "Error: $($_.Exception.Message)"
}

Read-Host "Press Enter to exit"
