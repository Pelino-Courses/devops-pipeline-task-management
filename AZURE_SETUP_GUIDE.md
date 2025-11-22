# 🎯 Azure Infrastructure Setup - Next Actions Required

## ✅ Completed So Far

1. **✅ Azure CLI Installation** - Installing (in progress)
2. **✅ SSH Key Pair Generated**
   - Location: `~\.ssh\devops-pipeline` (private key)
   - Location: `~\.ssh\devops-pipeline.pub` (public key)
3. **✅ Terraform Configuration Files Created**
   - `terraform/backend.tf` - Terraform Cloud backend
   - `terraform/variables.tf` - Input variables
   - `terraform/outputs.tf` - Output values  
   - `terraform/main.tf` - Azure resource definitions
   - `terraform/terraform.tfvars.example` - Example values

---

## 🚀 Next Steps - Manual Actions Required

### Step 1: Complete Azure CLI Installation & Login

Once Azure CLI installation finishes, run:

```powershell
# Verify installation
az version

# Login to Azure
az login
# This will open a browser window - sign in with your Azure account

# List your subscriptions
az account list --output table

# Set the subscription you want to use
az account set --subscription "YOUR_SUBSCRIPTION_NAME_OR_ID"

# Verify current subscription
az account show
```

**📋 Save this information:**
- Subscription ID: `____________________`
- Subscription Name: `____________________`

---

### Step 2: Create Azure Service Principal

```powershell
# Create Service Principal (replace YOUR_SUBSCRIPTION_ID)
az ad sp create-for-rbac `
  --name "devops-pipeline-sp" `
  --role="Contributor" `
  --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

**🔴 CRITICAL: Save this output immediately!**

The command will return JSON like this:
```json
{
  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "displayName": "devops-pipeline-sp",
  "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**📋 Record these values:**
- `appId` → Use as **ARM_CLIENT_ID**: `____________________`
- `password` → Use as **ARM_CLIENT_SECRET**: `____________________`
- `tenant` → Use as **ARM_TENANT_ID**: `____________________`
- Subscription ID (from Step 1) → Use as **ARM_SUBSCRIPTION_ID**: `____________________`

---

### Step 3: Set Up Terraform Cloud

**3.1 Create Account & Organization**

1. Go to https://app.terraform.io
2. Sign up or log in
3. Click "Create an organization"
4. Organization name: `devops-team-alu` (or your choice)
5. Click "Create organization"

**3.2 Create Workspace**

1. Click "New workspace"
2. Choose **"CLI-driven workflow"**
3. Workspace name: `devops-pipeline-infrastructure`
4. Click "Create workspace"

**3.3 Configure Environment Variables**

In your workspace, go to **Variables** → **Environment variables** → Add these 4 variables:

| Variable Name | Value | Sensitive |
|---------------|-------|-----------|
| ARM_CLIENT_ID | {appId from Step 2} | ☐ No |
| ARM_CLIENT_SECRET | {password from Step 2} | ☑️ **YES** |
| ARM_TENANT_ID | {tenant from Step 2} | ☐ No |
| ARM_SUBSCRIPTION_ID | {subscription from Step 1} | ☐ No |

**3.4 Configure Terraform Variables**

In the same workspace, **Terraform variables** section:

1. Click "Add variable"
2. Key: `ssh_public_key`
3. Value: Copy your SSH public key:
   ```powershell
   Get-Content $HOME\.ssh\devops-pipeline.pub
   ```
   Paste the entire output (starts with `ssh-rsa`)
4. **Mark as sensitive** ☑️
5. Click "Save"

**3.5 Get API Token**

1. Click your avatar → User Settings
2. Click "Tokens"
3. Click "Create an API token"
4. Description: `github-actions-token`
5. Click "Create API token"
6. **📋 COPY AND SAVE THIS TOKEN** - You won't see it again!
   - Token: `____________________`

---

### Step 4: Update Terraform Backend Configuration

**Edit `terraform/backend.tf`:**

```powershell
code terraform\backend.tf
```

Replace `YOUR-ORG-NAME` with your actual Terraform Cloud organization name (from Step 3.1):

```hcl
cloud {
  organization = "devops-team-alu"  # ← Change this!
  
  workspaces {
    name = "devops-pipeline-infrastructure"
  }
}
```

---

### Step 5: Deploy Infrastructure with Terraform

```powershell
# Navigate to terraform directory
cd terraform

# Login to Terraform Cloud
terraform login
# When prompted, paste your API token from Step 3.5

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Review the infrastructure plan
terraform plan

# Apply the infrastructure (creates Azure resources)
terraform apply
# Type 'yes' when prompted

# Save outputs to file
terraform output -json | Out-File -FilePath ..\terraform-outputs.json

# View the VM public IP
terraform output vm_public_ip
```

**Expected resources to be created:**
- ✅ Resource Group
- ✅ Virtual Network + Subnet
- ✅ Network Security Group (with firewall rules)
- ✅ Public IP Address
- ✅ Network Interface
- ✅ SSH Public Key
- ✅ Ubuntu 22.04 VM
- ✅ Azure Container Registry
- ✅ Role Assignment (VM → ACR)

---

### Step 6: Verify Infrastructure

```powershell
# Get the VM public IP from outputs
$VM_IP = terraform output -raw vm_public_ip

# Test SSH connection
ssh -i $HOME\.ssh\devops-pipeline azureuser@$VM_IP

# If successful, you should be connected to your Azure VM!
# Type 'exit' to disconnect
```

**Verify in Azure Portal:**
1. Go to https://portal.azure.com
2. Navigate to Resource Groups
3. Find: `devopspipeline-dev-rg`
4. Verify all resources are present and running

---

## 📊 Estimated Time

- Azure CLI installation: ~5 minutes
- Azure login & Service Principal: ~10 minutes
- Terraform Cloud setup: ~15 minutes
- Terraform deployment: ~10-15 minutes
- Verification: ~5 minutes

**Total: ~45-50 minutes**

---

## 💰 Cost Information

**Estimated Azure costs:**
- VM (Standard_B2s): ~$1/day (~$30/month)
- Container Registry (Basic): ~$5/month
- Public IP: ~$3/month
- Storage: ~$2/month

**Total: ~$1.30/day or ~$40/month**

💡 **To minimize costs:** Stop the VM when not in use, or destroy everything with `terraform destroy` when done testing.

---

## 🆘 Troubleshooting

### Azure CLI installation takes too long
- Check if antivirus is blocking
- Try running PowerShell as Administrator
- Alternative: Download installer from https://aka.ms/installazurecliwindows

### Service Principal creation fails
```powershell
# Ensure you're logged in
az login

# Check your permissions
az role assignment list --assignee $(az account show --query user.name -o tsv)

# If still failing, try with Owner role
az ad sp create-for-rbac --role="Owner" --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

### Terraform init fails
- Verify organization name is correct in `backend.tf`
- Ensure you've run `terraform login` and provided token
- Check internet connection

### Terraform apply fails with "name already exists"
- Change `project_name` in `variables.tf` to something unique
- Or add random suffix: `devopspipeline123`

### Can't SSH to VM
- Wait 2-3 minutes after VM creation for boot to complete
- Verify NSG rules allow your IP
- Check you're using correct private key: `~\.ssh\devops-pipeline`

---

## ✅ Success Checklist

Before proceeding to Ansible configuration:

- [ ] Azure CLI installed and working (`az version`)
- [ ] Logged into Azure (`az account show`)
- [ ] Service Principal created and credentials saved
- [ ] Terraform Cloud organization created
- [ ] Terraform Cloud workspace created
- [ ] All 4 environment variables added to Terraform workspace
- [ ] SSH public key added as Terraform variable
- [ ] `backend.tf` updated with correct organization name
- [ ] Terraform initialized successfully
- [ ] Infrastructure deployed (`terraform apply` succeeded)
- [ ] Can SSH into Azure VM
- [ ] `terraform-outputs.json` file created
- [ ] All resources visible in Azure Portal

---

## 📍 What's Next?

Once infrastructure is deployed and verified:

**Next Phase: Ansible Configuration Management**
- Install Ansible and required collections
- Create Ansible roles (docker, security, monitoring, app-deploy)
- Write playbooks to configure the server
- Deploy your application to the Azure VM

---

**Need help? Check the detailed guide in `CURRENT_STATUS_AND_NEXT_STEPS.md`**
