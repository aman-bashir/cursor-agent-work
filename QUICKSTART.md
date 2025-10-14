# 🚀 Quick Start Guide - Deploy Your First Tool

Complete step-by-step checklist to get your first tool live.

---

## ✅ Checklist

### Phase 1: VPS Setup (One-Time - 20 minutes)

- [ ] **1.1** SSH to VPS: `ssh aman@109.199.115.6`
- [ ] **1.2** Run setup script: `bash auto-setup-vps.sh`
- [ ] **1.3** Copy SSH private key displayed at end
- [ ] **1.4** Add 3 GitHub Secrets (VPS_HOST, VPS_USER, VPS_SSH_KEY)
- [ ] **1.5** Verify setup: `pm2 --version`, `nginx -v`, `node --version`

### Phase 2: Clone Repository on VPS (5 minutes)

- [ ] **2.1** On VPS: `cd /var/www`
- [ ] **2.2** Clone repo: `git clone https://github.com/YOUR-USER/cursor-agent-work.git`
- [ ] **2.3** Copy PM2 config: `cp cursor-agent-work/ecosystem.config.js /var/www/`
- [ ] **2.4** Set permissions: `chown -R aman:aman /var/www`

### Phase 3: Build First Tool Locally (3-5 days)

- [ ] **3.1** Open project: `cd cursor-agent-work/tool-01-password-generator`
- [ ] **3.2** Read specs: Open `README.md`
- [ ] **3.3** Use AI Agent: Copy prompt from `AI-AGENT-PROMPTS.md`
- [ ] **3.4** Build tool: Let AI agent create all files
- [ ] **3.5** Install deps: `npm install`
- [ ] **3.6** Test locally: `npm run dev` → Visit `http://localhost:3000`
- [ ] **3.7** Verify all features work

### Phase 4: Deploy to VPS (Automatic - 3 minutes)

- [ ] **4.1** Commit: `git add tool-01-password-generator/`
- [ ] **4.2** Commit: `git commit -m "Add Tool #1: Password Generator"`
- [ ] **4.3** Push: `git push origin main`
- [ ] **4.4** Watch GitHub Actions: Go to Actions tab, see deployment
- [ ] **4.5** Wait for completion (2-3 minutes)

### Phase 5: Verify Deployment (2 minutes)

- [ ] **5.1** SSH to VPS: `ssh aman@109.199.115.6`
- [ ] **5.2** Check PM2: `pm2 list` (should show tool-01 online)
- [ ] **5.3** Check logs: `pm2 logs tool-01`
- [ ] **5.4** Test locally: `curl http://localhost:3001`
- [ ] **5.5** Open browser: `http://109.199.115.6:3001`
- [ ] **5.6** ✅ Tool is live!

### Phase 6: Domain Setup (Optional - When Ready)

- [ ] **6.1** Buy domain: Namecheap/Cloudflare ($12/year)
- [ ] **6.2** Add DNS records: A record → 109.199.115.6, Wildcard A record
- [ ] **6.3** Edit Nginx: `sudo nano /etc/nginx/sites-available/tools`
- [ ] **6.4** Paste config from `nginx-config-template.conf`
- [ ] **6.5** Replace domain: Change `yourdomain.com` to actual domain
- [ ] **6.6** Enable site: `sudo ln -s /etc/nginx/sites-available/tools /etc/nginx/sites-enabled/`
- [ ] **6.7** Test config: `sudo nginx -t`
- [ ] **6.8** Reload Nginx: `sudo systemctl reload nginx`
- [ ] **6.9** Setup SSL: `sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com`
- [ ] **6.10** ✅ Access via domain: `https://passwordgen.yourdomain.com`

---

## 🎯 Current Progress Tracking

**What's Completed:**

✅ Specifications created (10 tools)
✅ CI/CD pipeline configured
✅ Deployment scripts ready
✅ Documentation complete

**What's Next:**

⏳ VPS setup (Step 1)
⏳ GitHub secrets (Step 2)
⏳ Build Tool #1 (Step 3)
⏳ Deploy Tool #1 (Step 4)
⏳ Verify it works (Step 5)

---

## 📞 Quick Commands Reference

### VPS Commands:
```bash
# Check running tools
pm2 list

# View logs
pm2 logs

# Restart tool
pm2 restart tool-01

# Check system
df -h        # Disk space
free -h      # Memory
htop         # CPU usage
```

### Development Commands:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Test production build
npm start
```

### Git Commands:
```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "message"

# Push
git push origin main
```

---

## 🚨 Troubleshooting

### GitHub Actions Failing?
- Check if all 3 secrets are added correctly
- Verify VPS_SSH_KEY has complete key (BEGIN to END)
- Test SSH manually: `ssh -i ~/.ssh/id_rsa aman@109.199.115.6`

### Tool Not Starting?
- Check logs: `pm2 logs tool-01`
- Rebuild: `npm run build`
- Restart: `pm2 restart tool-01`

### Can't Access Tool?
- Check PM2: `pm2 list` (should be "online")
- Check port: `curl http://localhost:3001`
- Check firewall: `sudo ufw status`

---

## 📊 Expected Timeline

| Phase | Time | What You'll Do |
|-------|------|----------------|
| **VPS Setup** | 20 min | Run script, copy key, add secrets |
| **Repository Clone** | 5 min | Clone on VPS, setup folders |
| **Build Tool #1** | 3-5 days | Use AI agent to build, test locally |
| **Deploy** | 3 min | Push to GitHub, auto-deploy |
| **Verify** | 2 min | Check it's live |
| **Domain (Optional)** | 30 min | Buy domain, configure DNS, SSL |

**Total to First Deployment:** ~4-6 days (mostly building the tool)

---

## 🎉 Success Criteria

**You'll know it's working when:**

✅ `pm2 list` shows tool-01 as "online"
✅ `curl http://localhost:3001` returns HTML
✅ Browser at `http://109.199.115.6:3001` shows your tool
✅ GitHub Actions shows green checkmark ✅
✅ You can use the password generator!

---

## 📚 Files to Reference

- **VPS Setup:** `VPS-SETUP-INSTRUCTIONS.md`
- **Deployment:** `DEPLOYMENT-GUIDE.md`
- **CI/CD Info:** `CI-CD-SUMMARY.md`
- **Build Prompts:** `AI-AGENT-PROMPTS.md`
- **Tool Specs:** `tool-01-password-generator/README.md`

---

**Let's build and deploy!** 🚀

