# Create simple PNG files for Microsoft Store
Add-Type -AssemblyName System.Drawing

function Create-ColoredPNG {
    param(
        [int]$Width,
        [int]$Height,
        [string]$OutputPath,
        [System.Drawing.Color]$BackgroundColor = [System.Drawing.Color]::FromArgb(255, 0, 120, 215)  # Microsoft Blue
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with background color
    $brush = New-Object System.Drawing.SolidBrush($BackgroundColor)
    $graphics.FillRectangle($brush, 0, 0, $Width, $Height)
    
    # Add a simple "RC" text for Run Chart
    $font = New-Object System.Drawing.Font("Arial", [math]::Min($Width/4, $Height/4), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $text = "RC"
    $textSize = $graphics.MeasureString($text, $font)
    $x = ($Width - $textSize.Width) / 2
    $y = ($Height - $textSize.Height) / 2
    $graphics.DrawString($text, $font, $textBrush, $x, $y)
    
    # Save as PNG
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $brush.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    $bitmap.Dispose()
}

# Create all required PNG files
$assetsPath = "C:\Users\PatRutledge\runchart-ms\Run_Chart_Store\app\Assets"
if (-not (Test-Path $assetsPath)) {
    New-Item -ItemType Directory -Path $assetsPath -Force
}

Create-ColoredPNG -Width 48 -Height 48 -OutputPath "$assetsPath\StoreLogo.png"
Create-ColoredPNG -Width 44 -Height 44 -OutputPath "$assetsPath\Square44x44Logo.png"
Create-ColoredPNG -Width 150 -Height 150 -OutputPath "$assetsPath\Square150x150Logo.png"
Create-ColoredPNG -Width 71 -Height 71 -OutputPath "$assetsPath\Square71x71Logo.png"
Create-ColoredPNG -Width 310 -Height 310 -OutputPath "$assetsPath\Square310x310Logo.png"
Create-ColoredPNG -Width 310 -Height 150 -OutputPath "$assetsPath\Wide310x150Logo.png"

Write-Host "Created all PNG icon files successfully!"
