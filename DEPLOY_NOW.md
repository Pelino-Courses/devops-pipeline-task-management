# Quick Deployment Guide

## ✅ All Configuration Complete!

- Terraform Cloud organization: `dianeee`
- Credentials file configured
- Backend configuration updated
- Ready to deploy!

---

## 🚀 Run These Commands

Copy and paste this entire block into PowerShell:

```powershell
# Add Terraform to PATH
$env:Path = "C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\Hashicorp.Terraform_Microsoft.Winget.Source_8wekyb3d8bbwe;$env:Path"

# Navigate to terraform directory
cd c:\Users\User\OneDrive\Documents\devops-pipeline-task-management\terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Preview what will be created
terraform plan
```

---

## ⚡ After Reviewing the Plan

Run this to deploy:

```powershell
terraform apply
```

When prompted "Enter a value:", type: **`yes`**

---

## ⏱️ What to Expect

- **Initialization**: 30 seconds
- **Plan**: 1-2 minutes
- **Deployment**: 5-10 minutes

---

## 🎯 After Deployment

You'll see output like:

```
VM Public IP: X.X.X.X
ACR Login Server: xxxacr.azurecr.io
ACR Name: xxxacr
Resource Group: devopspipeline-dev-rg
```

**Copy that entire output and send it to me!**

---

## 📌 Estimated Monthly Cost

~$40/month (~$1.30/day) for:
- VM (Standard_B2s)
- Azure Container Registry (Basic)
- Networking (VNet, Public IP, NSG)
