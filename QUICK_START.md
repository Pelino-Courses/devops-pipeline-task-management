# Quick Start Script - Run This First!

## 🚀 Run These Commands In Order

### Step 1: Fix Azure CLI (30 seconds)
```powershell
# Cancel any stuck commands with Ctrl+C first!

# Add Azure CLI to PATH
$env:Path += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

# Verify it works
az version
```

### Step 2: Login to Azure (2 minutes)
```powershell
# This will open your browser
az login

# List your subscriptions
az account list --output table

# Set the subscription you want to use (replace with YOUR subscription name)
az account set --subscription "YOUR_SUBSCRIPTION_NAME"

# Verify
az account show --output table
```

### Step 3: Create Service Principal (2 minutes)
```powershell
# Get your subscription ID
$SUBSCRIPTION_ID = (az account show --query id -o tsv)

# Create Service Principal
az ad sp create-for-rbac `
  --name "devops-pipeline-sp" `
  --role="Contributor" `
  --scopes="/subscriptions/$SUBSCRIPTION_ID"
```

**🔴 CRITICAL: SAVE THE OUTPUT IMMEDIATELY!**

Copy and paste this output somewhere safe - you'll need it for Terraform Cloud:
- appId → ARM_CLIENT_ID
- password → ARM_CLIENT_SECRET  
- tenant → ARM_TENANT_ID

---

## 🌐 Manual Steps (Web Browser Required)

### Step 4: Terraform Cloud (15 minutes)

1. **Create Account:**
   - Go to: https://app.terraform.io
   - Sign up (use GitHub or email)

2. **Create Organization:**
   - Name it: `devops-team-alu` (remember this!)
   - Or use a different name - just remember it

3. **Create Workspace:**
   - New Workspace → CLI-driven workflow
   - Name: `devops-pipeline-infrastructure`

4. **Add Environment Variables:**
   Go to workspace → Variables → Environment variables
   
   Add these 4:
   - `ARM_CLIENT_ID` = [appId from Step 3]
   - `ARM_CLIENT_SECRET` = [password from Step 3] ⚠️ Mark sensitive!
   - `ARM_TENANT_ID` = [tenant from Step 3]
   - `ARM_SUBSCRIPTION_ID` = [Your subscription ID]

5. **Add Terraform Variable:**
   Go to workspace → Variables → Terraform variables
   
   Get your SSH public key:
   ```powershell
   Get-Content $HOME\.ssh\devops-pipeline.pub
   ```
   
   Add:
   - Key: `ssh_public_key`
   - Value: [paste entire public key]
   - ⚠️ Mark as sensitive

6. **Get API Token:**
   - User Settings → Tokens
   - Create API token: `github-actions`
   - **COPY IT IMMEDIATELY** - save as TF_API_TOKEN

---

## 🔧 Update Files (I did this for you!)

The files `terraform/backend.tf` and `.github/workflows/terraform.yml` need your Terraform Cloud organization name.

**After you create your organization, run:**
```powershell
# Replace YOUR_ORG_NAME with the actual name you chose
$ORG_NAME = "devops-team-alu"  # Or whatever you named it

# Update backend.tf
(Get-Content terraform\backend.tf) -replace 'YOUR-ORG-NAME', $ORG_NAME | Set-Content terraform\backend.tf

# Update terraform.yml
(Get-Content .github\workflows\terraform.yml) -replace 'YOUR-ORG-NAME', $ORG_NAME | Set-Content .github\workflows\terraform.yml
```

---

## 🏗️ Deploy Infrastructure (10 minutes)

```powershell
# Navigate to terraform directory
cd terraform

# Login to Terraform Cloud (paste your API token when prompted)
terraform login

# Initialize
terraform init

# Validate
terraform validate

# See what will be created
terraform plan

# Deploy! (type 'yes' when asked)
terraform apply

# Save outputs for later
terraform output -json | Out-File -FilePath ..\terraform-outputs.json

# Get your VM IP
$VM_IP = terraform output -raw vm_public_ip
Write-Host "Your VM IP is: $VM_IP" -ForegroundColor Green

# Go back to main directory
cd ..
```

---

## 🔑 GitHub Secrets (10 minutes)

After terraform apply succeeds, go to GitHub:
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add these 15 secrets (get values from terraform outputs):

**Run these commands to get the values:**
```powershell
cd terraform

# Get all values
$VM_IP = terraform output -raw vm_public_ip
$ACR_NAME = terraform output -raw acr_name
$ACR_SERVER = terraform output -raw acr_login_server
$ACR_USER = terraform output -raw acr_admin_username
$ACR_PASS = terraform output -raw acr_admin_password

# Display them
Write-Host "VM_PUBLIC_IP = $VM_IP"
Write-Host "ACR_NAME = $ACR_NAME"
Write-Host "ACR_LOGIN_SERVER = $ACR_SERVER"
Write-Host "ACR_USERNAME = $ACR_USER"
Write-Host "ACR_PASSWORD = $ACR_PASS"

# Get SSH private key
Write-Host "`nCopy your SSH private key with:"
Write-Host "Get-Content `$HOME\.ssh\devops-pipeline -Raw | Set-Clipboard"
```

**Add to GitHub Secrets:**
1. TF_API_TOKEN = [from Terraform Cloud step]
2. ARM_CLIENT_ID = [from Service Principal]
3. ARM_CLIENT_SECRET = [from Service Principal]
4. ARM_TENANT_ID = [from Service Principal]
5. ARM_SUBSCRIPTION_ID = [from Step 2]
6. ACR_NAME = [from terraform output]
7. ACR_LOGIN_SERVER = [from terraform output]
8. ACR_USERNAME = [from terraform output]
9. ACR_PASSWORD = [from terraform output]
10. VM_PUBLIC_IP = [from terraform output]
11. SSH_PRIVATE_KEY = [run the Get-Content command above]
12. DB_USER = taskuser
13. DB_PASSWORD = [create a strong password]
14. DB_NAME = taskmanager

---

## 📤 Commit and Push (2 minutes)

```powershell
# From main directory
cd c:\Users\User\OneDrive\Documents\devops-pipeline-task-management

# Stage all changes
git add .

# Commit
git commit -m "feat: complete DevOps pipeline automation

- Add Terraform infrastructure (Azure VM, ACR, networking)
- Add Ansible configuration management (4 roles)
- Add GitHub Actions workflows (Terraform, CD, Security, DAST)
- Add comprehensive documentation
- Configure automated deployment pipeline"

# Push to trigger deployment
git push origin main
```

---

## 🎬 Watch It Deploy! (10-15 minutes)

1. Go to GitHub → Your repo → Actions tab
2. Watch the workflows run:
   - CI Pipeline (runs first)
   - CD Pipeline (deploys your app!)
   - Security scans

When CD Pipeline shows ✅ green, your app is live!

---

## ✅ Test Your Application! (2 minutes)

```powershell
# Get your VM IP (if you forgot)
cd terraform
$VM_IP = terraform output -raw vm_public_ip
cd ..

# Test backend
curl http://${VM_IP}:5000/health

# Open frontend in browser
start http://${VM_IP}:3000
```

**Try creating a task in your app!**

---

## ⏱️ Total Time Estimate

- Azure setup: 5 minutes
- Terraform Cloud: 15 minutes  
- Deploy infrastructure: 10 minutes
- GitHub Secrets: 10 minutes
- Git push: 2 minutes
- **Total: ~45 minutes** (plus 10-15 min for deployment)

---

## 🆘 Need Help?

Check `FINAL_STEPS_CHECKLIST.md` for detailed troubleshooting!

**You've got this! Start with Step 1 and work your way through.** 🚀
