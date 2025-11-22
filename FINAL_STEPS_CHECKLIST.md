# Final Steps to Complete DevOps Pipeline

## ⏱️ Estimated Time: 60-90 minutes

---

## Step 1: Azure CLI Setup (5 minutes)

### 1.1 Add Azure CLI to PATH (Current Session)
```powershell
$env:Path += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"
```

### 1.2 Verify Installation
```powershell
az version
```
Expected: Version info displays

### 1.3 Login to Azure
```powershell
az login
```
- Browser will open
- Sign in with your Azure account
- Close browser when done

### 1.4 List Your Subscriptions
```powershell
az account list --output table
```
- Note your subscription name or ID
- This shows all Azure subscriptions you have access to

### 1.5 Set Active Subscription
```powershell
# Replace with your subscription name or ID
az account set --subscription "YOUR_SUBSCRIPTION_NAME_OR_ID"
```

### 1.6 Verify Current Subscription
```powershell
az account show --output table
```
- Copy the subscription ID - you'll need it for the Service Principal

---

## Step 2: Create Azure Service Principal (10 minutes)

### 2.1 Create Service Principal
```powershell
# Replace YOUR_SUBSCRIPTION_ID with actual ID from previous step
az ad sp create-for-rbac `
  --name "devops-pipeline-sp" `
  --role="Contributor" `
  --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
```

### 2.2 CRITICAL: Save the Output
The command will return JSON like this - **COPY AND SAVE IT IMMEDIATELY**:
```json
{
  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "displayName": "devops-pipeline-sp",
  "password": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### 2.3 Record These Values
```
ARM_CLIENT_ID     = [appId from output]
ARM_CLIENT_SECRET = [password from output]  
ARM_TENANT_ID     = [tenant from output]
ARM_SUBSCRIPTION_ID = [subscription ID from step 1.6]
```

⚠️ **You will NOT be able to retrieve the password again!**

---

## Step 3: Terraform Cloud Setup (20 minutes)

### 3.1 Create Account
1. Go to https://app.terraform.io
2. Sign up with GitHub or email
3. Verify your email

### 3.2 Create Organization
1. Click "Create an organization"
2. Organization name: `devops-team-alu` (or your choice)
3. Email: your email
4. Click "Create organization"

### 3.3 Create Workspace
1. Click "New" → "Workspace"
2. Choose workflow: **"CLI-driven workflow"**
3. Workspace name: `devops-pipeline-infrastructure`
4. Click "Create workspace"

### 3.4 Add Environment Variables
In your workspace, go to **Variables** tab → **Environment variables** section

Add these 4 variables:

| Variable Name | Value | Sensitive |
|---------------|-------|-----------|
| `ARM_CLIENT_ID` | [appId from Step 2] | ☐ No |
| `ARM_CLIENT_SECRET` | [password from Step 2] | ☑️ **YES** |
| `ARM_TENANT_ID` | [tenant from Step 2] | ☐ No |
| `ARM_SUBSCRIPTION_ID` | [subscription ID] | ☐ No |

### 3.5 Add Terraform Variable
In the **Terraform variables** section:

1. Click "Add variable"
2. Key: `ssh_public_key`
3. Value: Get it with this command:
   ```powershell
   Get-Content $HOME\.ssh\devops-pipeline.pub
   ```
   Copy the ENTIRE output (starts with `ssh-rsa`)
4. ☑️ Mark as **Sensitive**
5. Click "Save variable"

### 3.6 Get API Token
1. Click your avatar (top right) → **User Settings**
2. Click **Tokens** (left sidebar)
3. Click "Create an API token"
4. Description: `github-actions-token`
5. Click "Create API token"
6. **COPY THE TOKEN IMMEDIATELY** - you won't see it again:
   ```
   TF_API_TOKEN = [copy and save this]
   ```

### 3.7 Note Your Organization Name
```
TF_ORGANIZATION = [your org name, e.g., "devops-team-alu"]
```

---

## Step 4: Update Configuration Files (5 minutes)

### 4.1 Update Terraform Backend
```powershell
# Edit terraform/backend.tf
code terraform\backend.tf
```

Change line 13:
```hcl
organization = "YOUR-ORG-NAME"  # Replace with your actual org name
```
To:
```hcl
organization = "devops-team-alu"  # Or whatever you chose
```

Save the file.

### 4.2 Update Terraform Workflow
```powershell
# Edit .github/workflows/terraform.yml
code .github\workflows\terraform.yml
```

Change line 12:
```yaml
TF_CLOUD_ORGANIZATION: "YOUR-ORG-NAME"
```
To:
```yaml
TF_CLOUD_ORGANIZATION: "devops-team-alu"  # Match your org
```

Save the file.

---

## Step 5: Deploy Infrastructure with Terraform (15 minutes)

### 5.1 Navigate to Terraform Directory
```powershell
cd terraform
```

### 5.2 Login to Terraform Cloud
```powershell
terraform login
```
- When prompted, enter: `yes`
- Paste your API token from Step 3.6
- Press Enter

### 5.3 Initialize Terraform
```powershell
terraform init
```
Expected: "Terraform has been successfully initialized!"

### 5.4 Validate Configuration
```powershell
terraform validate
```
Expected: "Success! The configuration is valid."

### 5.5 Review What Will Be Created
```powershell
terraform plan
```
- Review the output
- Should show ~10 resources to create
- Look for: Resource Group, VM, ACR, VNet, NSG, etc.

### 5.6 Deploy Infrastructure
```powershell
terraform apply
```
- Type: `yes` when prompted
- Wait 5-10 minutes for deployment
- ☕ Good time for a coffee break!

### 5.7 Save Outputs
```powershell
# Save to JSON file
terraform output -json | Out-File -FilePath ..\terraform-outputs.json

# View important outputs
terraform output vm_public_ip
terraform output acr_login_server
terraform output acr_name
```

### 5.8 Record These Values
```
VM_PUBLIC_IP = [IP address from output]
ACR_NAME = [registry name from output]
ACR_LOGIN_SERVER = [login server from output]
ACR_USERNAME = [run: terraform output -raw acr_admin_username]
ACR_PASSWORD = [run: terraform output -raw acr_admin_password]
```

### 5.9 Test SSH Access
```powershell
# From terraform directory
cd ..
ssh -i $HOME\.ssh\devops-pipeline azureuser@[YOUR_VM_PUBLIC_IP]
```
- Should connect successfully
- Type `exit` to disconnect

---

## Step 6: Configure GitHub Secrets (15 minutes)

### 6.1 Navigate to GitHub Secrets
1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 6.2 Add All Required Secrets

Add these 15 secrets one by one:

#### Azure & Terraform Secrets
| Secret Name | Value |
|-------------|-------|
| `TF_API_TOKEN` | [From Step 3.6] |
| `ARM_CLIENT_ID` | [From Step 2.2 - appId] |
| `ARM_CLIENT_SECRET` | [From Step 2.2 - password] |
| `ARM_TENANT_ID` | [From Step 2.2 - tenant] |
| `ARM_SUBSCRIPTION_ID` | [From Step 1.6] |

#### Container Registry Secrets
| Secret Name | Value |
|-------------|-------|
| `ACR_NAME` | [From Step 5.8] |
| `ACR_LOGIN_SERVER` | [From Step 5.8] |
| `ACR_USERNAME` | [From Step 5.8] |
| `ACR_PASSWORD` | [From Step 5.8] |

#### VM & Application Secrets
| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VM_PUBLIC_IP` | [From Step 5.8] | `terraform output -raw vm_public_ip` |
| `SSH_PRIVATE_KEY` | [Entire private key] | `Get-Content $HOME\.ssh\devops-pipeline -Raw` |
| `DB_USER` | taskuser | Choose a username |
| `DB_PASSWORD` | [Generate secure password] | Use a password generator |
| `DB_NAME` | taskmanager | Database name |

For `SSH_PRIVATE_KEY`:
```powershell
# Copy private key (including BEGIN/END lines)
Get-Content $HOME\.ssh\devops-pipeline -Raw | Set-Clipboard
# Then paste into GitHub Secret
```

---

## Step 7: Commit and Push Everything (5 minutes)

### 7.1 Check What Changed
```powershell
git status
```

### 7.2 Stage All Changes
```powershell
git add .
```

### 7.3 Commit
```powershell
git commit -m "feat: complete DevOps pipeline with Terraform, Ansible, and CI/CD workflows

- Add Terraform infrastructure for Azure (VM, ACR, networking)
- Add Ansible roles for Docker, Security, Monitoring, App-Deploy
- Add GitHub Actions workflows for Terraform, CD, Security, DAST
- Add comprehensive documentation (Architecture, Deployment, Security)
- Configure complete automated deployment pipeline"
```

### 7.4 Push to Main
```powershell
git push origin main
```

---

## Step 8: Watch the Magic Happen! (10-15 minutes)

### 8.1 Go to GitHub Actions
1. Go to your repository on GitHub
2. Click **Actions** tab
3. You should see workflows running:
   - CI Pipeline
   - CD Pipeline
   - Security Scanning

### 8.2 Monitor CD Pipeline
1. Click on the "CD Pipeline" workflow
2. Watch the jobs:
   - ✅ build-and-push: Building Docker images
   - ✅ deploy: Ansible deployment
   - ✅ post-deployment: Health checks

### 8.3 Wait for Completion
- This will take 10-15 minutes
- Green checkmarks = success!
- Red X = check the logs

---

## Step 9: Verify Your Application! (5 minutes)

### 9.1 Test Backend Health
```powershell
# Replace with your actual VM IP
curl http://YOUR_VM_PUBLIC_IP:5000/health
```
Expected: `{"status":"healthy"}`

### 9.2 Test Backend API
```powershell
curl http://YOUR_VM_PUBLIC_IP:5000/api/tasks
```
Expected: Empty array `[]` or list of tasks

### 9.3 Open Frontend in Browser
```powershell
start http://YOUR_VM_PUBLIC_IP:3000
```
Expected: Your task manager application loads!

### 9.4 Test Creating a Task
- Click "Add Task" or similar
- Create a test task
- Verify it appears in the list

---

## Step 10: SSH to VM and Verify (Optional - 5 minutes)

### 10.1 Connect to VM
```powershell
ssh -i $HOME\.ssh\devops-pipeline azureuser@YOUR_VM_PUBLIC_IP
```

### 10.2 Check Running Containers
```bash
docker ps
```
Expected: 3 containers (frontend, backend, database)

### 10.3 Check Application Logs
```bash
cd /opt/taskmanager
docker-compose logs -f backend
# Press Ctrl+C to exit
```

### 10.4 Run System Status
```bash
system-status.sh
```
Shows CPU, memory, disk, containers

### 10.5 Exit VM
```bash
exit
```

---

## 🎉 Success Checklist

Verify everything is working:

- [ ] Azure CLI working (`az version`)
- [ ] Logged into Azure (`az account show`)
- [ ] Service Principal created and credentials saved
- [ ] Terraform Cloud organization and workspace created
- [ ] All Terraform Cloud variables configured
- [ ] `terraform/backend.tf` updated with org name
- [ ] Infrastructure deployed successfully (`terraform apply`)
- [ ] Can SSH to Azure VM
- [ ] All 15 GitHub Secrets added
- [ ] Code pushed to GitHub main branch
- [ ] CI pipeline passed (green checkmarks)
- [ ] CD pipeline passed (green checkmarks)
- [ ] Backend health check returns 200
- [ ] Frontend loads in browser
- [ ] Can create/view/edit/delete tasks
- [ ] All containers running on VM

---

## 🚀 Next Steps (For Course Completion)

### 1. Test All Features (30 minutes)
- Create tasks
- Edit tasks
- Delete tasks
- Test all CRUD operations
- Check security scans passed

### 2. Record Demo Video (30-60 minutes)
**Show:**
- Repository structure
- GitHub workflows running
- Azure infrastructure in portal
- Application running live
- Create/edit/delete task demo
- Security scanning results
- Terraform/Ansible code walkthrough

**Suggested structure:**
1. Introduction (2 min)
2. Repository tour (3 min)
3. CI/CD pipeline demo (5 min)
4. Infrastructure overview (3 min)
5. Live application demo (3 min)
6. Security features (2 min)
7. Conclusion (2 min)

**Total: 15-20 minutes**

### 3. Prepare Team Presentation (60 minutes)
**Slides to include:**
- Project overview
- Architecture diagram
- Technology stack
- DevOps practices implemented
- CI/CD pipeline flow
- Security measures
- Challenges and solutions
- Lessons learned
- Live demo

### 4. Write Individual Reflection (60 minutes per person)
**Cover:**
- Your specific contributions
- Technical challenges you overcame
- New skills you developed
- Team collaboration experience
- What you learned about DevOps
- What you would do differently

---

## 🆘 Troubleshooting

### If Terraform Apply Fails
```powershell
# Check error message
# Common fixes:
terraform destroy -auto-approve  # Clean up
terraform apply                    # Try again

# Or check Azure Portal for stuck resources
```

### If CD Pipeline Fails
1. Check GitHub Actions logs for error
2. Verify all secrets are configured correctly
3. Check VM is running in Azure Portal
4. Verify SSH key is correct
5. Check `docs/DEPLOYMENT.md` troubleshooting section

### If Application Not Accessible
```powershell
# SSH to VM and check
ssh -i $HOME\.ssh\devops-pipeline azureuser@YOUR_VM_IP

# Check containers
docker ps -a

# Restart if needed
cd /opt/taskmanager
docker-compose restart

# Check logs
docker-compose logs
```

### If Security Scans Fail
- Check `.github/workflows/security.yml` logs
- Some findings may be false positives
- Update `security/.trivyignore` if needed

---

## 💰 Cost Management

**Daily Cost: ~$1.30**

**To minimize costs:**

### Stop VM When Not In Use
```powershell
# Stop VM (saves compute costs)
az vm deallocate --resource-group devopspipeline-dev-rg --name devopspipeline-dev-vm

# Start VM when needed
az vm start --resource-group devopspipeline-dev-rg --name devopspipeline-dev-vm
```

### Destroy Everything When Done
```powershell
cd terraform
terraform destroy
# Type: yes
```

⚠️ **Only do this after:**
- Demo video recorded
- Screenshots taken
- Assignment submitted

---

## 📚 Reference Documents

- `AZURE_SETUP_GUIDE.md` - Detailed Azure setup (this was helpful during setup)
- `docs/ARCHITECTURE.md` - System architecture and design
- `docs/DEPLOYMENT.md` - Deployment procedures and troubleshooting
- `docs/SECURITY.md` - Security practices and compliance
- `CURRENT_STATUS_AND_NEXT_STEPS.md` - Overall project status

---

## ✅ You're Done When...

1. ✅ Application running on Azure
2. ✅ Can access via `http://VM_IP:3000`
3. ✅ All CRUD operations work
4. ✅ CI/CD pipeline fully automated
5. ✅ Security scans passing
6. ✅ Demo video recorded
7. ✅ Presentation prepared
8. ✅ Individual reflection written
9. ✅ Assignment submitted

---

**You've got this! Follow these steps one by one, and you'll have a fully operational DevOps pipeline! 🚀**

**Estimated total time to complete: 60-90 minutes for infrastructure + 3-4 hours for deliverables**

Good luck! 🎉
