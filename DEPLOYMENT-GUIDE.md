# 🚀 Complete Deployment Guide

Step-by-step guide to deploy all 10 tools to your VPS with CI/CD automation.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ VPS server (12 vCPU, 48GB RAM) - You have this!
- ✅ Domain name purchased ($12/year)
- ✅ GitHub repository with all tool specifications
- ✅ SSH access to VPS
- ✅ Basic terminal knowledge

---

## 🎯 Deployment Strategy Overview

```
Local Development
        ↓
   Git Push to Main
        ↓
 GitHub Actions Triggers
        ↓
   Smart Path Detection
        ↓
  Deploy Only Changed Tools
        ↓
    VPS (Nginx + PM2)
        ↓
   Live on Subdomains
```

---

## 📝 Part 1: VPS Initial Setup (One-Time)

### Step 1: SSH into Your VPS

```bash
ssh your-username@your-vps-ip
```

### Step 2: Run Setup Script

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/YOUR-USERNAME/cursor-agent-work/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

**What this does:**
- Installs Node.js 20+
- Installs PM2 (process manager)
- Installs Nginx (web server)
- Installs PostgreSQL (database)
- Installs Redis (caching)
- Creates directory structure
- Configures firewall
- Installs SSL certificate tool

**Time:** 10-15 minutes

---

## 🔐 Part 2: Setup SSH Key for GitHub Actions

### Step 1: Generate SSH Key on VPS

```bash
# On your VPS
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Press Enter 3 times (no passphrase for automation)
```

### Step 2: Add Public Key to Authorized Keys

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Step 3: Copy Private Key

```bash
cat ~/.ssh/id_rsa
```

**Copy the entire output** (including BEGIN and END lines). You'll need this for GitHub Secrets.

### Step 4: Test SSH Key

```bash
# From your local machine
ssh -i ~/.ssh/id_rsa your-username@your-vps-ip

# Should login WITHOUT password
```

---

## 🔑 Part 3: Configure GitHub Secrets

### Step 1: Go to Repository Settings

1. Navigate to: `https://github.com/YOUR-USERNAME/cursor-agent-work`
2. Click: **Settings** tab
3. Click: **Secrets and variables** → **Actions**
4. Click: **New repository secret**

### Step 2: Add Required Secrets

Add these 3 secrets (one by one):

**Secret 1: VPS_HOST**
```
Name: VPS_HOST
Value: 123.45.67.89  (your actual VPS IP)
```

**Secret 2: VPS_USER**
```
Name: VPS_USER
Value: your-username  (e.g., amanbashir601)
```

**Secret 3: VPS_SSH_KEY**
```
Name: VPS_SSH_KEY
Value: (paste entire private key from cat ~/.ssh/id_rsa)
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
... all lines ...
-----END RSA PRIVATE KEY-----
```

**Optional Secret 4: VPS_PORT** (only if not using default port 22)
```
Name: VPS_PORT
Value: 22  (or your custom SSH port)
```

---

## 🌐 Part 4: DNS Configuration

### Step 1: Get Your VPS IP

```bash
curl ifconfig.me
# Output: 123.45.67.89 (example)
```

### Step 2: Add DNS Records

Go to your domain registrar (Namecheap, Cloudflare, GoDaddy) and add:

**For Subdomain Strategy:**
```
Type: A Record
Name: @
Value: YOUR_VPS_IP

Type: A Record
Name: *
Value: YOUR_VPS_IP
```

This creates a wildcard subdomain, allowing:
- passwordgen.yourdomain.com
- tokens.yourdomain.com
- json.yourdomain.com
- etc.

**Wait 5-30 minutes** for DNS propagation.

### Step 3: Verify DNS

```bash
# Test DNS resolution
nslookup passwordgen.yourdomain.com
# Should return your VPS IP
```

---

## 🔧 Part 5: Clone Repository on VPS

### Step 1: Setup Git on VPS

```bash
# On VPS
cd /var/www

# Generate deploy key (if using private repo)
ssh-keygen -t rsa -b 4096 -C "vps-deploy"
cat ~/.ssh/id_rsa.pub
# Add this to GitHub: Settings → Deploy keys

# Or use HTTPS (for public repo)
git clone https://github.com/YOUR-USERNAME/cursor-agent-work.git
```

### Step 2: Create Individual Tool Folders

```bash
# Create symlinks or copy folders
cd /var/www

# Option 1: Symlinks (recommended)
ln -s /var/www/cursor-agent-work/tool-01-password-generator /var/www/tool-01-password-generator
ln -s /var/www/cursor-agent-work/tool-02-token-counter /var/www/tool-02-token-counter
# ... for all 10 tools

# Option 2: Direct folders (simpler)
cp -r /var/www/cursor-agent-work/tool-01-password-generator /var/www/
cp -r /var/www/cursor-agent-work/tool-02-token-counter /var/www/
# ... for all 10 tools
```

---

## 🚀 Part 6: Build & Deploy First Tool (Manual)

Let's deploy Tool #1 manually first to test everything:

### Step 1: Navigate to Tool Folder

```bash
cd /var/www/tool-01-password-generator
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build for Production

```bash
npm run build
```

### Step 4: Start with PM2

```bash
pm2 start npm --name "tool-01" -- start
pm2 save
```

### Step 5: Verify It's Running

```bash
pm2 status
# Should show tool-01 as "online"

# Test locally
curl http://localhost:3001
# Should return HTML
```

---

## 🌐 Part 7: Configure Nginx

### Step 1: Copy Nginx Template

```bash
# On VPS
sudo nano /etc/nginx/sites-available/tools
```

### Step 2: Paste Configuration

Copy content from `nginx-config-template.conf` and **replace** `yourdomain.com` with your actual domain.

### Step 3: Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/tools /etc/nginx/sites-enabled/
```

### Step 4: Test Configuration

```bash
sudo nginx -t
# Should say "syntax is ok" and "test is successful"
```

### Step 5: Reload Nginx

```bash
sudo systemctl reload nginx
```

### Step 6: Test HTTP Access

```bash
curl http://passwordgen.yourdomain.com
# Should return your tool's HTML
```

---

## 🔒 Part 8: Setup SSL Certificates

### Step 1: Install Certbot (if not done)

```bash
sudo apt-get install certbot python3-certbot-nginx
```

### Step 2: Get Wildcard Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose redirect HTTP to HTTPS: Yes

### Step 3: Test SSL

```bash
# Should work with HTTPS now
curl https://passwordgen.yourdomain.com
```

### Step 4: Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Should say "Congratulations, all renewals succeeded"
```

Certbot automatically sets up auto-renewal via cron.

---

## 🤖 Part 9: Test GitHub Actions CI/CD

### Step 1: Make a Test Change

```bash
# On your local machine
cd cursor-agent-work/tool-01-password-generator

# Make a small change to any file
echo "// Test change" >> app/page.tsx

# Commit and push
git add .
git commit -m "Test: Trigger deployment for tool-01"
git push origin main
```

### Step 2: Watch GitHub Actions

1. Go to: `https://github.com/YOUR-USERNAME/cursor-agent-work/actions`
2. You should see workflow running
3. Click on the workflow to see logs

### Step 3: Verify Deployment

```bash
# On VPS, check logs
pm2 logs tool-01 --lines 50

# Tool should have restarted with new changes
```

### Step 4: Test Live Site

Visit `https://passwordgen.yourdomain.com` and verify changes are live.

---

## 📊 Part 10: Deploy All 10 Tools

### Option A: Manual Deployment (Recommended First Time)

```bash
# On VPS
cd /var/www

# For each tool:
cd tool-XX-name
npm install
npm run build
pm2 start npm --name "tool-XX" -- start
cd ..

# After all tools
pm2 save
pm2 list  # Verify all are running
```

### Option B: Use PM2 Ecosystem File

```bash
# Copy ecosystem config
cp /var/www/cursor-agent-work/ecosystem.config.js /var/www/

# Start all tools at once
pm2 start ecosystem.config.js

# Save configuration
pm2 save
```

---

## ✅ Part 11: Verification Checklist

After deployment, verify everything works:

### System Health
```bash
# Check PM2 processes
pm2 status
# All 10 tools should be "online"

# Check Nginx
sudo systemctl status nginx
# Should be "active (running)"

# Check disk space
df -h
# Should have plenty of space

# Check memory
free -h
# Should have 30+ GB available
```

### Tool Access
Test each tool in browser:
- ✅ https://passwordgen.yourdomain.com
- ✅ https://tokens.yourdomain.com
- ✅ https://json.yourdomain.com
- ✅ https://cron.yourdomain.com
- ✅ https://prompts.yourdomain.com
- ✅ https://timezone.yourdomain.com
- ✅ https://linkedin.yourdomain.com
- ✅ https://colors.yourdomain.com
- ✅ https://thumbnail.yourdomain.com
- ✅ https://qr.yourdomain.com

### CI/CD Test
```bash
# Make change to any tool
# Push to GitHub
# Verify GitHub Actions runs
# Verify tool updates on VPS
```

---

## 📝 Part 12: Common PM2 Commands

```bash
# View all processes
pm2 list

# View logs (all tools)
pm2 logs

# View logs (specific tool)
pm2 logs tool-01

# Restart tool
pm2 restart tool-01

# Restart all tools
pm2 restart all

# Stop tool
pm2 stop tool-01

# Delete tool
pm2 delete tool-01

# Monitor resources
pm2 monit

# Save current processes
pm2 save

# Resurrect saved processes (after reboot)
pm2 resurrect
```

---

## 🐛 Troubleshooting

### Issue: Tool not starting

```bash
# Check logs
pm2 logs tool-01 --lines 100

# Common fixes:
cd /var/www/tool-01-password-generator
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart tool-01
```

### Issue: GitHub Actions failing

```bash
# Check GitHub Actions logs in browser
# Common issues:
# - Wrong VPS_HOST (check GitHub secrets)
# - Wrong VPS_SSH_KEY (regenerate and update)
# - Directory doesn't exist on VPS
# - Permission issues
```

### Issue: Domain not resolving

```bash
# Check DNS propagation
nslookup passwordgen.yourdomain.com

# Wait up to 24 hours for DNS
# Check domain registrar DNS settings
```

### Issue: SSL certificate error

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate
sudo certbot certificates
```

---

## 🎯 Success! What's Next?

Once everything is deployed:

1. ✅ **Monitor Performance**
   - pm2 monit (real-time monitoring)
   - Setup uptime monitoring (uptimerobot.com - free)

2. ✅ **Setup Analytics**
   - Add Google Analytics to each tool
   - Track user behavior

3. ✅ **Apply to AdSense**
   - Need 1000+ visitors and original content
   - Usually takes 1-2 weeks approval

4. ✅ **Join Affiliate Programs**
   - Apply to all affiliate programs listed in each tool's README
   - Add affiliate links to tools

5. ✅ **Start Marketing**
   - Launch on Product Hunt
   - Post on Reddit
   - Share on Twitter/LinkedIn

6. ✅ **Build More Tools**
   - Tools 1-4 done? Build 5-10
   - Optimize based on analytics

---

## 📞 Quick Reference

### File Locations on VPS
```
/var/www/tool-XX-name/          # Each tool
/var/www/ecosystem.config.js    # PM2 config
/etc/nginx/sites-available/tools # Nginx config
/var/log/pm2/                   # PM2 logs
```

### Important URLs
```
GitHub Actions: github.com/YOUR-USER/cursor-agent-work/actions
PM2 Docs: pm2.keymetrics.io/docs/usage/quick-start/
Nginx Docs: nginx.org/en/docs/
Certbot: certbot.eff.org/
```

### Costs Summary
```
Domain: $12/year
VPS: Already have
SSL: Free (Let's Encrypt)
Total: $12/year
```

---

## 🎉 Congratulations!

You've successfully set up:
- ✅ Complete CI/CD pipeline
- ✅ Automated deployments
- ✅ SSL certificates
- ✅ All 10 tools running
- ✅ Production-ready infrastructure

**Start building and marketing your tools!** 🚀

---

**Need help?** Check logs, re-read relevant sections, or debug step-by-step.

