# 🚀 VPS Setup Instructions

Complete step-by-step guide to setup your VPS automatically.

---

## ✅ Confirmed VPS Details:

```
IP Address: 109.199.115.6
Username: aman
SSH Command: ssh aman@109.199.115.6
```

---

## 📋 Quick Setup (Automated)

### Step 1: Copy Setup Script to VPS

**Option A: Download directly on VPS**
```bash
# SSH to VPS
ssh aman@109.199.115.6
# Enter password when prompted

# Download script
wget https://raw.githubusercontent.com/YOUR-USERNAME/cursor-agent-work/main/auto-setup-vps.sh

# Or if wget doesn't work, use curl:
curl -O https://raw.githubusercontent.com/YOUR-USERNAME/cursor-agent-work/main/auto-setup-vps.sh

# Make executable
chmod +x auto-setup-vps.sh

# Run script
bash auto-setup-vps.sh
```

**Option B: Copy manually**
```bash
# On your local machine
scp auto-setup-vps.sh aman@109.199.115.6:~/

# SSH to VPS
ssh aman@109.199.115.6

# Run script
bash auto-setup-vps.sh
```

---

## 🎯 What the Script Does:

The automated script will:

1. ✅ Generate SSH key for GitHub Actions
2. ✅ Install Node.js 20.x
3. ✅ Install PM2 (process manager)
4. ✅ Install Nginx (web server)
5. ✅ Install PostgreSQL (database)
6. ✅ Install Redis (caching)
7. ✅ Install Certbot (SSL certificates)
8. ✅ Configure firewall
9. ✅ Setup directories
10. ✅ Display GitHub Secrets to add

**Time Required:** 10-15 minutes

---

## 🔑 After Script Completes:

The script will display:

### 1. SSH Private Key
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
... (many lines) ...
-----END RSA PRIVATE KEY-----
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**COPY THIS ENTIRE OUTPUT** - You'll need it for GitHub!

### 2. GitHub Secrets Summary
```
Secret 1:
  Name:  VPS_HOST
  Value: 109.199.115.6

Secret 2:
  Name:  VPS_USER
  Value: aman

Secret 3:
  Name:  VPS_SSH_KEY
  Value: (The private key shown above)
```

---

## 🔐 Step 2: Add GitHub Secrets

### Go to GitHub Repository:
1. Navigate to: `https://github.com/YOUR-USERNAME/cursor-agent-work`
2. Click: **Settings** tab
3. Click: **Secrets and variables** → **Actions**
4. Click: **New repository secret**

### Add These 3 Secrets:

**Secret 1:**
```
Name: VPS_HOST
Value: 109.199.115.6
```

**Secret 2:**
```
Name: VPS_USER
Value: aman
```

**Secret 3:**
```
Name: VPS_SSH_KEY
Value: (Paste the entire private key from script output)
```

---

## 📁 Step 3: Clone Repository on VPS

```bash
# Already on VPS from Step 1
cd /var/www

# Clone your repository
git clone https://github.com/YOUR-USERNAME/cursor-agent-work.git

# If private repo, use SSH:
# First add deploy key to GitHub
cat ~/.ssh/id_rsa.pub
# Copy output, add to: GitHub → Settings → Deploy keys

# Then clone
git clone git@github.com:YOUR-USERNAME/cursor-agent-work.git
```

---

## 🚀 Step 4: Initial Tool Deployment (When Tools Are Built)

### Option A: Deploy Single Tool (for testing)

```bash
# Example: Deploy Tool #1
cd /var/www/cursor-agent-work/tool-01-password-generator

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "tool-01" -- start

# Save PM2 config
pm2 save

# Check status
pm2 status

# Test locally
curl http://localhost:3001
```

### Option B: Deploy All Tools (when all are built)

```bash
# Copy ecosystem config
cp /var/www/cursor-agent-work/ecosystem.config.js /var/www/

# Start all tools
pm2 start /var/www/ecosystem.config.js

# Save configuration
pm2 save

# Verify all running
pm2 list
```

---

## 🌐 Step 5: Configure Nginx (After Getting Domain)

### Edit Nginx Configuration:
```bash
# Create new config file
sudo nano /etc/nginx/sites-available/tools
```

### Paste Configuration:
```nginx
# Copy content from nginx-config-template.conf
# Replace 'yourdomain.com' with your actual domain
```

### Enable Site:
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/tools /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 6: Setup SSL Certificates (After DNS Configured)

```bash
# Install certificates for all subdomains
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Verification Checklist

After setup, verify everything:

```bash
# Check Node.js
node --version
# Should show: v20.x.x

# Check PM2
pm2 --version
# Should show PM2 version

# Check Nginx
sudo systemctl status nginx
# Should be: active (running)

# Check PostgreSQL
sudo systemctl status postgresql
# Should be: active (running)

# Check Redis
sudo systemctl status redis-server
# Should be: active (running)

# Check disk space
df -h
# Should have plenty of space

# Check memory
free -h
# Should show 48GB total
```

---

## 🧪 Test GitHub Actions Deployment

### Make a test change:
```bash
# On your local machine
cd cursor-agent-work/tool-01-password-generator

# Make a small change
echo "// Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test: Trigger CI/CD deployment"
git push origin main
```

### Watch Deployment:
1. Go to: `https://github.com/YOUR-USERNAME/cursor-agent-work/actions`
2. See workflow running
3. Click to view logs
4. Wait for completion (2-3 minutes)

### Verify on VPS:
```bash
# On VPS
pm2 logs tool-01 --lines 50

# Should show recent deployment
```

---

## 🐛 Troubleshooting

### Issue: Script fails with "permission denied"
```bash
# Make sure you're not using root user
whoami
# Should show: aman

# If using root, create user:
adduser aman
usermod -aG sudo aman
su - aman
# Then run script again
```

### Issue: Can't connect to VPS
```bash
# Test connection
ping 109.199.115.6

# Try SSH with verbose
ssh -v aman@109.199.115.6
```

### Issue: GitHub Actions failing
```bash
# Check secrets are correct
# Go to: GitHub → Settings → Secrets
# Verify: VPS_HOST, VPS_USER, VPS_SSH_KEY

# Test SSH manually with key
ssh -i ~/.ssh/id_rsa aman@109.199.115.6
```

---

## 📞 Quick Reference

### Important Directories:
```
/var/www/                          - All tools
/var/www/cursor-agent-work/        - Git repository
/var/www/ecosystem.config.js       - PM2 configuration
/etc/nginx/sites-available/tools   - Nginx configuration
/var/log/pm2/                      - PM2 logs
```

### Important Commands:
```bash
# PM2
pm2 list           - List all processes
pm2 logs           - View logs
pm2 restart all    - Restart all
pm2 monit          - Real-time monitoring

# Nginx
sudo nginx -t                    - Test config
sudo systemctl reload nginx      - Reload
sudo systemctl status nginx      - Check status

# System
df -h              - Disk space
free -h            - Memory usage
htop               - Resource monitor
```

---

## 🎉 Success!

Once everything is set up:

1. ✅ VPS configured with all software
2. ✅ SSH key generated and added to GitHub
3. ✅ Repository cloned on VPS
4. ✅ Ready for automated deployments

**Next Step:** Build your first tool and deploy!

---

## 📝 Notes

- Password: `S27*k@44` (for initial SSH login only)
- After SSH key setup, password not needed
- All future deployments via GitHub Actions
- Tools accessible at: `http://109.199.115.6:300X`
- With domain: `https://subdomain.yourdomain.com`

**Ready to deploy!** 🚀

