# Security Documentation

## Overview

This document outlines the comprehensive security practices implemented in the DevOps Task Manager project across all phases of the development lifecycle.

## Security by Design Principles

1. **Defense in Depth:** Multiple layers of security controls
2. **Least Privilege:** Minimal permissions required
3. **Fail Secure:** Systems fail to a secure state
4. **Security as Code:** All security controls version-controlled
5. **Continuous Security:** Automated scanning at every stage

## Security Controls by Layer

### 1. Code Security (SAST)

**Tools:**
- ESLint for code quality and potential vulnerabilities
- GitHub CodeQL for static analysis

**What it catches:**
- Injection vulnerabilities
- Cross-site scripting (XSS)
- Insecure randomness
- Path traversal
- Hardcoded credentials

**Implementation:**
```yaml
# .github/workflows/security.yml
sast-scan:
  - CodeQL Analysis for JavaScript
  - Automated vulnerability detection
  - Security alerts in GitHub Security tab
```

**Remediation:** Fix identified issues before merge to main

### 2. Dependency Security

**Tools:**
- npm audit (Node.js dependencies)
- Trivy (Container image vulnerabilities)

**What it scans:**
- Known CVEs in dependencies
- Vulnerable package versions
- Transitive dependencies
- License compliance

**Workflow:**
```yaml
dependency-scan:
  - npm audit on backend and frontend
  - Severity threshold: moderate and above
  - Automated weekly scans
```

**Remediation:**
- Update vulnerable packages
- Apply security patches
- Use `npm audit fix`
- Document exceptions in security/.trivyignore

### 3. Secret Scanning

**Tools:**
- TruffleHog OSS

**What it detects:**
- API keys
- Passwords
- SSH keys
- Tokens
- Database credentials

**Prevention:**
```bash
# Pre-commit hook (recommended)
trufflehog git file://. --only-verified

# Automated in CI/CD
.github/workflows/security.yml:secret-scan
```

**If secrets are committed:**
1. Immediately rotate the compromised secret
2. Remove from Git history: `git filter-branch`
3. Update all systems using the secret
4. Investigate potential unauthorized access

### 4. Container Security

**Tools:**
- Trivy vulnerability scanner
- Docker best practices

**Image Hardening:**
```dockerfile
# Multi-stage builds
FROM node:18-alpine AS builder
# ... build steps ...

FROM node:18-alpine
# Minimal final image

# Non-root user
RUN adduser -S nodejs -u 1001
USER nodejs

# Health checks
HEALTHCHECK --interval=30s CMD node healthcheck.js
```

**Scanning:**
```yaml
container-scan:
  - Scan for OS vulnerabilities
  - Scan for application dependencies
  - Severity: CRITICAL and HIGH
  - Runs on every build
```

**Best Practices:**
- Use official base images
- Minimize layers
- Don't include unnecessary tools
- Regular image rebuilds
- Scan before deployment

### 5. Infrastructure Security

**Tools:**
- tfsec (Terraform security scanner)
- Checkov (Policy as code)

**Terraform Security:**
```yaml
# .github/workflows/terraform.yml
terraform-security:
  - tfsec scans for common misconfigurations
  - Checkov validates security policies
  - Runs before terraform apply
```

**Security Controls in Infrastructure:**
```hcl
# Network Security Group
resource "azurerm_network_security_group" "main" {
  # Only necessary ports exposed
  # Default deny inbound
  # Explicit allow rules only
}

# SSH Key Authentication
resource "azurerm_linux_virtual_machine" "main" {
  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }
  # No password authentication
}

# Managed Identity
identity {
  type = "SystemAssigned"
}
```

### 6. Network Security

**Azure Network Security Group:**
| Port | Service | Allowed From | Justification |
|------|---------|--------------|---------------|
| 22 | SSH | Any (*) | Management access |
| 80 | HTTP | Any | Public web traffic |
| 443 | HTTPS | Any | Secure web traffic |
| 3000 | Frontend | Any | Application access |
| 5000 | Backend API | Any | API access |

**⚠️ Production Recommendation:** Restrict SSH to specific IPs

**VM Firewall (UFW):**
```yaml
# ansible/roles/security/tasks/main.yml
- Default deny incoming
- Default allow outgoing
- Allow specific ports only
- Enabled and active
```

**Network Segmentation:**
- Database not exposed to public internet
- Communication within Docker network only
- Inter-container communication on bridge network

### 7. Access Control

**Principles:**
- SSH key-based authentication only
- No password authentication
- Service Principal for automation
- Managed Identity for Azure resources

**Azure RBAC:**
```hcl
# VM can pull from ACR
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_virtual_machine.main.identity[0].principal_id
}
```

**GitHub Secrets:**
- All sensitive data in GitHub Secrets
- Never committed to repository
- Access controlled by repository permissions
- Audit log of secret usage

### 8. Application Security

**Backend Security Headers (Helmet.js):**
```javascript
// helmet configuration
- X-DNS-Prefetch-Control
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Strict-Transport-Security
```

**CORS Configuration:**
```javascript
cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
})
```

**Input Validation:**
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries
- Limit request sizes

**Database Security:**
```yaml
environment:
  POSTGRES_PASSWORD: {{ db_password }}  # From secrets
  # No default passwords
  # Credentials via environment variables
```

### 9. Runtime Security

**Intrusion Prevention (Fail2ban):**
```ini
[DEFAULT]
bantime = 3600    # 1 hour ban
findtime = 600    # 10-minute window
maxretry = 5      # Max 5 failed attempts

[sshd]
enabled = true
```

**System Hardening:**
```yaml
# Resource limits
- Max open files: 65536
- Max processes: 4096

# Automatic security updates
APT::Periodic::Update-Package-Lists "1"
APT::Periodic::Unattended-Upgrade "1"

# Docker daemon security
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

### 10. Dynamic Application Security Testing (DAST)

**Tool:** OWASP ZAP

**Testing:**
```yaml
# .github/workflows/dast.yml
- Baseline scan weekly
- Full scan on-demand
- Tests running application
- Identifies runtime vulnerabilities
```

**What it finds:**
- SQL injection
- Cross-site scripting (XSS)
- Insecure cookies
- Missing security headers
- SSL/TLS issues

## Security Incident Response

### Detection
1. **Automated Alerts:**
   - GitHub Security Advisories
   - Dependabot alerts
   - Workflow failures

2. **Manual Monitoring:**
   - Review security scan results weekly
   - Check fail2ban logs
   - Monitor system logs

### Response Procedure

**For Security Vulnerability:**
1. Assess severity (CVSS score)
2. Determine affected systems
3. Apply patches/updates
4. Rebuild and redeploy containers
5. Verify fix with security scans

**For Suspected Breach:**
1. Isolate affected systems
2. Rotate all credentials immediately
3. Review access logs
4. Investigate root cause
5. Implement additional controls

**For Secret Exposure:**
1. Immediately revoke/rotate secret
2. Review Git history
3. Check for unauthorized access
4. Update documentation
5. Improve detection controls

## Compliance & Best Practices

### OWASP Top 10 Mitigation

| Risk | Mitigation |
|------|-----------|
| Injection | Parameterized queries, input validation |
| Broken Authentication | SSH keys, strong passwords, MFA (recommended) |
| Sensitive Data Exposure | HTTPS, encrypted secrets, no hardcoded credentials |
| XML External Entities | Not applicable (no XML processing) |
| Broken Access Control | RBAC, least privilege principle |
| Security Misconfiguration | IaC scanning, automated hardening |
| XSS | Helmet.js, React escaping, CSP headers |
| Insecure Deserialization | Input validation, type checking |
| Using Components with Known Vulnerabilities | Dependency scanning, regular updates |
| Insufficient Logging | Application logs, system logs, audit trails |

### CIS Benchmarks

**Applied Controls:**
- ✅ Disable root login over SSH
- ✅ Use SSH keys instead of passwords
- ✅ Enable firewall (UFW)
- ✅ Keep system updated
- ✅ Minimize installed packages
- ✅ Configure audit logging
- ✅ Set file permissions properly
- ✅ Use AppArmor/SELinux (AppArmor on Ubuntu)

## Security Monitoring

### Continuous Monitoring

**Automated:**
- GitHub Actions security workflows
- Real-time dependency vulnerability alerts
- Container image scanning on every build

**Scheduled:**
- Weekly DAST scans (Sundays 3 AM)
- Weekly security workflow runs (Mondays 2 AM)

**Manual:**
- Monthly security review
- Quarterly penetration testing (recommended)
- Annual security audit (recommended)

### Metrics

**Track:**
- Number of vulnerabilities detected
- Time to remediate critical issues
- Scan coverage (% of code scanned)
- Failed authentication attempts
- Security workflow success rate

### Logging

**What's logged:**
- All SSH access attempts
- Failed authentication (fail2ban)
- Application errors
- Container events
- System resource usage

**Log locations:**
```bash
# Application logs
docker logs <container>

# System logs
/var/log/syslog
/var/log/auth.log

# Fail2ban
/var/log/fail2ban.log

# UFW firewall
/var/log/ufw.log
```

## Security Training & Awareness

### Team Responsibilities

**All Developers:**
- Never commit secrets
- Follow secure coding practices
- Review security scan results
- Report security concerns

**DevOps Engineer:**
- Monitor security pipelines
- Apply security updates
- Manage secrets rotation
- Incident response

**Security Engineer:**
- Configure security tools
- Review security policies
- Conduct security training
- Threat modeling

## Secrets Management

### Current Implementation

**GitHub Secrets:**
- All sensitive configuration
- Encrypted at rest
- Access controlled by repository permissions

**Terraform Cloud:**
- Infrastructure credentials
- Variable marked as sensitive
- Encrypted storage

**Ansible:**
- Vault variables (recommended)
- Environment variables
- No secrets in playbooks

### Production Recommendations

1. **Use Azure Key Vault:**
   ```hcl
   resource "azurerm_key_vault" "main" {
     # Store all secrets in Key Vault
     # Use managed identity for access
   }
   ```

2. **Implement Secrets Rotation:**
   - Service Principal: Every 90 days
   - Database passwords: Every 90 days
   - SSH keys: Annually
   - API tokens: Every 180 days

3. **Use Separate Secrets per Environment:**
   - Development secrets
   - Staging secrets
   - Production secrets
   - Never reuse across environments

## Security Checklist

### Before Deployment

- [ ] All security scans passing
- [ ] No HIGH/CRITICAL vulnerabilities
- [ ] Secrets configured in GitHub
- [ ] SSH keys generated and secured
- [ ] Firewall rules reviewed
- [ ] HTTPS configured (if applicable)
- [ ] Database credentials strong
- [ ] No default passwords

### Post-Deployment

- [ ] DAST scan completed
- [ ] Penetration testing conducted
- [ ] Logs reviewed
- [ ] Monitoring configured
- [ ] Incident response plan documented
- [ ] Team trained on security procedures
- [ ] Backup and recovery tested

### Ongoing

- [ ] Weekly security scan reviews
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Annual penetration testing
- [ ] Immediate response to security alerts
- [ ] Regular credential rotation

## Reporting Security Issues

**If you discover a security vulnerability:**

1. **Do NOT create a public GitHub issue**
2. Contact security team privately
3. Provide:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested remediation

**Response SLA:**
- Acknowledgment: 24 hours
- Initial assessment: 48 hours
- Critical fix: 7 days
- High/Medium fix: 30 days

---

**Security is everyone's responsibility. When in doubt, ask!**

**Last Updated:** November 2025  
**Next Review:** December 2025
