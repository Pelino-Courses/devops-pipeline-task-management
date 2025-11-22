# Quick script to add Azure CLI to PATH
# Run this at the start of each PowerShell session if az commands don't work

$env:Path += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

Write-Host "✅ Azure CLI added to PATH" -ForegroundColor Green
Write-Host ""
Write-Host "You can now run Azure CLI commands like:" -ForegroundColor Cyan
Write-Host "  az version" -ForegroundColor Yellow
Write-Host "  az login" -ForegroundColor Yellow
Write-Host "  az account list" -ForegroundColor Yellow
