# Terraform Deployment Script - v2
# This script uses the correct Terraform installation path

Write-Host "==================================" -ForegroundColor Cyan
Write-Host " Azure Infrastructure Deployment  " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Find Terraform installation
Write-Host "Finding Terraform..." -ForegroundColor Yellow
$terraformExe = Get-ChildItem "$env:USERPROFILE\AppData\Local\Microsoft\WinGet\Packages" -Recurse -Filter "terraform.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($terraformExe) {
    $terraformDir = Split-Path $terraformExe.FullName -Parent
    $env:Path = "$terraformDir;$env:Path"
    Write-Host "Terraform found at: $terraformDir" -ForegroundColor Green
}
else {
    Write-Host "Terraform not found! Please restart PowerShell or reinstall Terraform." -ForegroundColor Red
    exit 1
}

# Verify Terraform works
Write-Host "Verifying Terraform..." -ForegroundColor Yellow
& $terraformExe.FullName version
Write-Host ""

# Navigate to terraform directory
Set-Location terraform

Write-Host "================================" -ForegroundColor Cyan
Write-Host " Step 1: Login to Terraform Cloud" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "When prompted:" -ForegroundColor White
Write-Host "  1. Type: yes" -ForegroundColor White
Write-Host "  2. Paste token: du9pvXV5DrvznA.atlasv1.Yal73i4cb8z5Z659ziAfGGuvF4THJipxlJP7OyzOxeVYfhL4o3B7eTdFay7zeN36qNE" -ForegroundColor Yellow
Write-Host "  3. Press Enter" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter when ready to login"

terraform login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Terraform login failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Step 2: Initialize Terraform" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
terraform init

if ($LASTEXITCODE -ne 0) {
    Write-Host "Terraform init failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Step 3: Validate Configuration" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
terraform validate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Terraform validate failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Step 4: Plan Infrastructure" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Reviewing what will be created..." -ForegroundColor White
Write-Host ""
terraform plan

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Step 5: Deploy Infrastructure" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will create real Azure resources!" -ForegroundColor Red
Write-Host "Estimated cost: ~1.30 USD/day (~40 USD/month)" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type 'yes' to proceed with deployment"

if ($confirm -eq "yes") {
    Write-Host ""
    Write-Host "Deploying infrastructure... This will take 5-10 minutes." -ForegroundColor Yellow
    Write-Host ""
    
    terraform apply -auto-approve
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Deployment Complete!" -ForegroundColor Green
        Write-Host ""
        
        # Save outputs
        terraform output -json | Out-File -FilePath ..\terraform-outputs.json
        
        # Display important values
        Write-Host "================================" -ForegroundColor Cyan
        Write-Host "    IMPORTANT VALUES             " -ForegroundColor Cyan
        Write-Host "================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "VM Public IP:" -ForegroundColor Green
        $vmIp = terraform output -raw vm_public_ip
        Write-Host "  $vmIp" -ForegroundColor White
        Write-Host ""
        Write-Host "ACR Login Server:" -ForegroundColor Green
        $acrServer = terraform output -raw acr_login_server
        Write-Host "  $acrServer" -ForegroundColor White
        Write-Host ""
        Write-Host "ACR Name:" -ForegroundColor Green
        $acrName = terraform output -raw acr_name
        Write-Host "  $acrName" -ForegroundColor White
        Write-Host ""
        Write-Host "Resource Group:" -ForegroundColor Green
        $rgName = terraform output -raw resource_group_name
        Write-Host "  $rgName" -ForegroundColor White
        Write-Host ""
        Write-Host "================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Outputs saved to: terraform-outputs.json" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next Steps:" -ForegroundColor Yellow
        Write-Host "  1. Test SSH access: ssh -i ~/.ssh/devops-pipeline azureuser@$vmIp" -ForegroundColor White
        Write-Host "  2. Add GitHub Secrets" -ForegroundColor White
        Write-Host "  3. Commit and push code to trigger deployment" -ForegroundColor White
    }
    else {
        Write-Host ""
        Write-Host "Deployment failed! Check errors above." -ForegroundColor Red
    }
}
else {
    Write-Host ""
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
