# Deployment Guide

## Prerequisites

Before deploying, ensure you have completed:
- ✅ Azure infrastructure provisioned via Terraform
- ✅ Terraform Cloud configured with correct credentials
- ✅ GitHub Secrets configured
- ✅ SSH access to Azure VM verified

## GitHub Secrets Configuration

Navigate to: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

### Azure & Terraform Secrets

| Secret Name | Description | Example Source |
|------------|-------------|----------------|
| `TF_API_TOKEN` | Terraform Cloud API token | Terraform Cloud → User Settings → Tokens |
| `ARM_CLIENT_ID` | Azure Service Principal App ID | From `az ad sp create-for-rbac` output |
| `ARM_CLIENT_SECRET` | Azure Service Principal password | From `az ad sp create-for-rbac` output |
| `ARM_TENANT_ID` | Azure tenant ID | From `az ad sp create-for-rbac` output |
| `ARM_SUBSCRIPTION_ID` | Azure subscription ID | From `az account show` |

### Container Registry Secrets

| Secret Name | Description | Source |
|------------|-------------|--------|
| `ACR_NAME` | Container registry name | `terraform output acr_name` |
| `ACR_LOGIN_SERVER` | ACR login URL | `terraform output acr_login_server` |
| `ACR_USERNAME` | ACR admin username | `terraform output acr_admin_username` |
| `ACR_PASSWORD` | ACR admin password | `terraform output acr_admin_password` |

### VM & Application Secrets

| Secret Name | Description | Source |
|------------|-------------|--------|
| `VM_PUBLIC_IP` | Azure VM public IP | `terraform output vm_public_ip` |
| `SSH_PRIVATE_KEY` | SSH private key for VM | Content of `~/.ssh/devops-pipeline` |
| `DB_USER` | Database username | Choose secure username (e.g., `taskuser`) |
| `DB_PASSWORD` | Database password | Generate secure password |
| `DB_NAME` | Database name | Set to `taskmanager` |

### Quick Setup Script

```powershell
# After terraform apply, run this to get values:
cd terraform

# Get ACR values (note: passwords are sensitive!)
terraform output acr_name
terraform output acr_login_server
terraform output -raw acr_admin_username
terraform output -raw acr_admin_password

# Get VM IP
terraform output -raw vm_public_ip

# Get SSH private key
Get-Content $HOME\.ssh\devops-pipeline | clip  # Copies to clipboard
```

## Deployment Process

### Automatic Deployment (Recommended)

**Trigger:** Push to `main` branch

1. Code merged to `main` branch
2. CI pipeline runs automatically
3. CD pipeline triggers on CI success:
   - Builds Docker images
   - Pushes to ACR
   - Runs Ansible playbook
   - Deploys application
   - Verifies health checks

### Manual Deployment

**Trigger:** Workflow dispatch

```yaml
# Go to: Actions → CD Pipeline → Run workflow
```

## First-Time Deployment

### Step 1: Verify Infrastructure

```powershell
cd terraform
terraform output
```

Expected outputs:
- `vm_public_ip`: Your VM's public IP
- `acr_login_server`: Container registry URL
- `acr_name`: Registry name
- `resource_group_name`: Resource group

### Step 2: Test SSH Access

```powershell
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_PUBLIC_IP>
```

You should be able to connect without errors.

### Step 3: Configure GitHub Secrets

Follow the table above to add all required secrets.

### Step 4: Trigger Initial Deployment

Option A - Push to main:
```bash
git checkout main
git pull origin main
# Make a small change (e.g., update README)
git add .
git commit -m "chore: trigger initial deployment"
git push origin main
```

Option B - Manual trigger:
1. Go to GitHub Actions tab
2. Select "CD Pipeline"
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow"

### Step 5: Monitor Deployment

1. Go to GitHub Actions tab
2. Click on the running workflow
3. Monitor each job:
   - `build-and-push`: Building Docker images
   - `deploy`: Ansible configuration and deployment
   - `post-deployment`: Health checks

### Step 6: Verify Application

Once deployment completes:

```powershell
$VM_IP = "YOUR_VM_IP"

# Test backend health
curl http://${VM_IP}:5000/health

# Test backend API
curl http://${VM_IP}:5000/api/tasks

# Test frontend (open in browser)
start http://${VM_IP}:3000
```

## Deployment Architecture

```
GitHub Push → CI Pipeline (Lint, Test, Security)
              ↓
          CD Pipeline
              ↓
      Build Docker Images
              ↓
      Push to ACR (Azure Container Registry)
              ↓
      Ansible Playbook Execution
              ├─→ Security Role (UFW, Fail2ban)
              ├─→ Docker Role (Install Docker)
              ├─→ Monitoring Role (Node Exporter)
              └─→ App-Deploy Role (Pull images, Deploy)
              ↓
      Health Check Verification
              ↓
      Application Running on Azure VM
```

## Rollback Procedures

### Automatic Rollback

Currently not implemented. See manual rollback.

### Manual Rollback

**Option 1: Redeploy Previous Commit**
```bash
git checkout main
git revert HEAD
git push origin main
# CD pipeline will deploy previous version
```

**Option 2: SSH and Restart**
```powershell
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>

# Check running containers
docker ps

# Restart containers
cd /opt/taskmanager
docker-compose restart

# View logs
docker-compose logs -f
```

**Option 3: Manual Image Rollback**
```powershell
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>

cd /opt/taskmanager

# Edit docker-compose.yml to use specific tag
sudo nano docker-compose.yml
# Change image tags from 'latest' to 'sha-XXXXXXX'

# Restart with specific version
docker-compose up -d

# Verify
docker-compose ps
```

## Troubleshooting

### Deployment Fails at Build Step

**Symptom:** Docker build fails

**Solutions:**
```bash
# Check Dockerfiles locally
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend

# Review GitHub Actions logs for specific errors
```

### Deployment Fails at Push to ACR

**Symptom:** Authentication errors

**Solutions:**
1. Verify ACR secrets in GitHub
2. Check ACR admin access is enabled:
   ```powershell
   az acr update -n <ACR_NAME> --admin-enabled true
   ```
3. Regenerate ACR credentials if needed

### Deployment Fails at Ansible Step

**Symptom:** SSH connection failures

**Solutions:**
1. Verify SSH private key in GitHub Secrets
2. Check VM is running: Azure Portal → VM → Status
3. Verify NSG allows SSH (port 22)
4. Test SSH manually:
   ```powershell
   ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>
   ```

### Health Checks Fail

**Symptom:** Application deployed but health check fails

**Solutions:**
```powershell
# SSH to VM
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>

# Check container status
docker ps -a

# Check logs
cd /opt/taskmanager
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Restart containers
docker-compose restart

# Check database connectivity
docker exec -it taskmanager-database-1 psql -U taskuser -d taskmanager
```

### Application Not Accessible

**Symptom:** Can't access frontend/backend from browser

**Solutions:**
1. Check NSG rules allow ports 3000, 5000
2. Check UFW firewall on VM:
   ```bash
   sudo ufw status
   ```
3. Verify containers are running:
   ```bash
   docker ps
   ```
4. Check if ports are listening:
   ```bash
   sudo netstat -tlnp | grep -E '3000|5000'
   ```

## Monitoring Deployment

### Real-time Logs

```powershell
# SSH to VM
ssh -i $HOME\.ssh\devops-pipeline azureuser@<VM_IP>

# Follow all logs
docker-compose logs -f

# Follow specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### System Status

```bash
# On the VM
system-status.sh      # CPU, memory, disk, containers
check-disk.sh         # Disk space check
docker ps             # Container status
docker stats          # Resource usage
```

### Application Health

```bash
# Backend health endpoint
curl http://localhost:5000/health

# Frontend
curl http://localhost:3000

# Database
docker exec taskmanager-database-1 pg_isready -U taskuser
```

## Performance Optimization

### Current Configuration
- **VM Size:** Standard_B2s (2 vCPU, 4GB RAM)
- **Containers:** No resource limits
- **Database:** Default PostgreSQL configuration

### Optimization Steps

1. **Add Resource Limits** (docker-compose.yml):
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1.0'
             memory: 1G
   ```

2. **Optimize Database**:
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_tasks_status ON tasks(status);
   ```

3. **Enable Nginx Caching** (frontend):
   ```nginx
   location /static/ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## Security Best Practices

### During Deployment

1. **Never commit secrets to Git**
   - Use GitHub Secrets
   - Use .env files (gitignored)
   - Use Terraform variables (sensitive)

2. **Rotate credentials regularly**
   - Service Principal passwords
   - ACR admin passwords
   - Database passwords

3. **Use SSH keys only**
   - No password authentication
   - Protect private keys
   - Use different keys for different environments

### Post-Deployment

1. **Monitor security scans**
   - Review CodeQL findings
   - Check Trivy vulnerability reports
   - Review OWASP ZAP results

2. **Keep systems updated**
   - Automatic security updates enabled (Ubuntu)
   - Rebuild containers regularly
   - Update base images

## Maintenance

### Regular Tasks

**Weekly:**
- Review GitHub Actions logs
- Check security scan results
- Review application logs
- Verify backups

**Monthly:**
- Update dependencies (npm update)
- Rebuild Docker images with latest base images
- Review Azure costs
- Test disaster recovery procedures

### Scaling

**To scale horizontally:**
1. Use Azure VM Scale Sets
2. Add load balancer
3. Move database to Azure Database for PostgreSQL
4. Implement session storage (Redis)

**To scale vertically:**
```powershell
# Stop VM
az vm deallocate --resource-group <RG_NAME> --name <VM_NAME>

# Resize
az vm resize --resource-group <RG_NAME> --name <VM_NAME> --size Standard_B4ms

# Start VM
az vm start --resource-group <RG_NAME> --name <VM_NAME>
```

---

**Need Help?** Contact your DevOps team or refer to:
- [Architecture Documentation](ARCHITECTURE.md)
- [Security Documentation](SECURITY.md)
- [Original Setup Guide](../AZURE_SETUP_GUIDE.md)
