# 🚀 Quick Start: Next Phase - Infrastructure Setup

**You are here:** ✅ Application Built → 🎯 Infrastructure Setup → ⏭️ Deployment Automation

---

## 📍 Where You Are

```
✅ Phase 1: Project Setup (GitHub, Application)
✅ Phase 2: Containerization (Docker) 
✅ Phase 3: CI Pipeline (Testing, Linting, Security)
🎯 Phase 4: Infrastructure (Terraform + Azure) ← YOU ARE HERE
⏭️ Phase 5: Configuration (Ansible)
⏭️ Phase 6: CD Pipeline (Automated Deployment)
⏭️ Phase 7: Advanced Security
⏭️ Phase 8: Final Documentation
```

---

## ⚡ Today's Action Plan (3-4 hours)

### Morning Session (2 hours)

**Step 1: Azure Setup (45 min)**
```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Login and setup
az login
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create Service Principal (SAVE THE OUTPUT!)
az ad sp create-for-rbac `
  --name "devops-pipeline-sp" `
  --role="Contributor" `
  --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

**Output to save:**
```json
{
  "appId": "xxx",        ← This is ARM_CLIENT_ID
  "password": "xxx",     ← This is ARM_CLIENT_SECRET
  "tenant": "xxx"        ← This is ARM_TENANT_ID
}
```

**Step 2: Terraform Cloud Setup (30 min)**

1. Go to https://app.terraform.io → Sign up/Login
2. Create Organization: `devops-team-alu` (or your choice)
3. Create Workspace: `devops-pipeline-infrastructure`
4. Select: **CLI-driven workflow**
5. Go to Workspace → Variables → Add these:

| Variable Name | Value | Type | Sensitive |
|---------------|-------|------|-----------|
| ARM_CLIENT_ID | {appId from above} | Environment | No |
| ARM_CLIENT_SECRET | {password from above} | Environment | ✅ Yes |
| ARM_SUBSCRIPTION_ID | {your sub ID} | Environment | No |
| ARM_TENANT_ID | {tenant from above} | Environment | No |

**Step 3: Generate SSH Key (5 min)**
```powershell
# Generate key
ssh-keygen -t rsa -b 4096 -f $HOME/.ssh/devops-pipeline -N '""'

# View public key
Get-Content $HOME\.ssh\devops-pipeline.pub
```

Add to Terraform Cloud:
- Variable name: `ssh_public_key`
- Value: {entire public key content}
- Type: Terraform variable
- Sensitive: ✅ Yes

**Step 4: Get Terraform API Token (5 min)**

1. Terraform Cloud → User Settings → Tokens
2. Create API Token: `github-actions-token`
3. **Copy and save it** - you'll need it for GitHub Secrets

### Afternoon Session (2 hours)

**Step 5: Create Terraform Files (60 min)**

Create these 4 files in `terraform/` directory:

1. **`backend.tf`** - Replace `your-org-name` with your actual org
2. **`main.tf`** - Copy from lab guide Step 21
3. **`variables.tf`** - Copy from lab guide Step 22
4. **`outputs.tf`** - Copy from lab guide Step 22

**Step 6: Deploy Infrastructure (30 min)**

```powershell
cd terraform

# Login to Terraform Cloud
terraform login
# Paste your API token when prompted

# Initialize
terraform init

# Validate
terraform validate

# See what will be created
terraform plan

# Create infrastructure (review plan first!)
terraform apply
# Type 'yes' when prompted

# Save outputs
terraform output -json | Out-File ../terraform-outputs.json

# View VM IP
terraform output vm_public_ip
```

**Step 7: Verify Infrastructure (10 min)**

```powershell
# Test SSH access
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_PUBLIC_IP>

# If successful, you'll be connected to your Azure VM!
# Type 'exit' to disconnect

# Check Azure Portal
# Go to portal.azure.com → Resource Groups
# Find: devopspipeline-dev-rg
# Verify all resources created
```

---

## 🎯 Success Indicators

After today's work, you should have:

- ✅ Azure Service Principal created
- ✅ Terraform Cloud workspace configured
- ✅ SSH key pair generated
- ✅ Terraform files created
- ✅ Infrastructure deployed to Azure:
  - Resource Group
  - Virtual Network
  - VM (Ubuntu 22.04)
  - Container Registry
  - Public IP
  - Network Security Group
- ✅ Can SSH into VM
- ✅ `terraform-outputs.json` file created

---

## 📋 Tomorrow's Preview

**Ansible Configuration Management**

Once infrastructure is running, you'll:
1. Install Ansible locally
2. Create Ansible roles (docker, security, app-deploy)
3. Write playbooks to configure the VM
4. Deploy your application to Azure

**Estimated time:** 2-3 hours

---

## 🆘 Common Issues & Solutions

### Issue: Service Principal Creation Failed
```powershell
# Ensure you have permissions
az role assignment list --assignee $(az account show --query user.name -o tsv)

# Alternative: Use Owner role if Contributor fails
az ad sp create-for-rbac --role="Owner" --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

### Issue: Terraform Apply Fails with "Name Already Exists"
```hcl
# Edit terraform/variables.tf
# Change default project_name to something unique
variable "project_name" {
  default     = "devopspipeline123"  # Add random numbers
}
```

### Issue: Can't SSH to VM
```powershell
# Check NSG rules in Azure Portal
# Verify your public IP is allowed
# Get your public IP:
(Invoke-WebRequest -Uri "https://api.ipify.org").Content

# Try with verbose output:
ssh -v -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>
```

### Issue: Terraform Cloud Connection Failed
```powershell
# Re-login
terraform logout
terraform login

# Or set token manually:
$env:TF_TOKEN_app_terraform_io = "your-token-here"
```

---

## 💰 Cost Tracking

**Expected Azure Costs:**
- VM (Standard_B2s): ~$1/day (~$30/month)
- Container Registry: ~$0.17/day (~$5/month)
- Public IP: ~$0.10/day (~$3/month)

**Total: ~$1.30/day or ~$40/month**

💡 **Remember to destroy resources when done:**
```powershell
terraform destroy  # When project is complete
```

---

## 📸 Documentation Tips

As you work, take screenshots for your demo video:
1. Azure Portal showing resource group
2. Terraform Cloud workspace
3. Terraform apply output
4. Successful SSH connection
5. Azure resources running

---

## 👥 Team Coordination

**Share with your team:**
1. Terraform Cloud organization name
2. Invite team members to Terraform Cloud workspace
3. Share the VM IP address
4. Coordinate who will work on Ansible tomorrow

**GitHub Issues to Create:**
- "Configure Azure Infrastructure with Terraform"
- "Set up Ansible for server configuration"
- "Implement CD pipeline for automated deployment"

---

## 🔗 Quick Links

- [Terraform Cloud](https://app.terraform.io)
- [Azure Portal](https://portal.azure.com)
- [Azure CLI Docs](https://learn.microsoft.com/en-us/cli/azure/)
- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

---

## ✅ Pre-Flight Checklist

Before starting, ensure you have:
- [ ] Active Azure subscription
- [ ] GitHub repository is up-to-date
- [ ] Docker Desktop running (for local testing)
- [ ] ~4 hours available for focused work
- [ ] Credit card (for Azure - even with free credits, card required)
- [ ] Team members informed of your progress

---

**Ready? Let's build some infrastructure! 🏗️**

*Detailed step-by-step instructions in: `CURRENT_STATUS_AND_NEXT_STEPS.md`*
*Full lab guide reference: Original provided guide*
