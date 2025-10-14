#!/bin/bash

#############################################
# Automated VPS Setup Script
# For: Tool Websites Deployment
# Run this on your VPS as: bash auto-setup-vps.sh
#############################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Automated VPS Setup for Tool Websites       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Generate SSH Key for GitHub Actions
echo -e "${YELLOW}📋 Step 1/8: Setting up SSH Key for GitHub Actions...${NC}"
if [ -f ~/.ssh/id_rsa ]; then
    echo -e "${GREEN}✅ SSH key already exists${NC}"
else
    echo -e "Generating new SSH key..."
    ssh-keygen -t rsa -b 4096 -C "github-actions-deployment" -f ~/.ssh/id_rsa -N ""
    echo -e "${GREEN}✅ SSH key generated${NC}"
fi

# Add to authorized keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys 2>/dev/null || true
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
echo -e "${GREEN}✅ SSH key authorized${NC}"

# Step 2: Update System
echo ""
echo -e "${YELLOW}📋 Step 2/8: Updating system packages...${NC}"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
echo -e "${GREEN}✅ System updated${NC}"

# Step 3: Install Node.js 20.x
echo ""
echo -e "${YELLOW}📋 Step 3/8: Installing Node.js 20.x...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js already installed: $(node --version)${NC}"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"
fi

# Install build tools
sudo apt-get install -y build-essential

# Step 4: Install PM2
echo ""
echo -e "${YELLOW}📋 Step 4/8: Installing PM2 process manager...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 already installed${NC}"
else
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}"
fi

# Step 5: Install Nginx
echo ""
echo -e "${YELLOW}📋 Step 5/8: Installing Nginx web server...${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx already installed${NC}"
else
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed and started${NC}"
fi

# Step 6: Install PostgreSQL
echo ""
echo -e "${YELLOW}📋 Step 6/8: Installing PostgreSQL database...${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL already installed${NC}"
else
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo -e "${GREEN}✅ PostgreSQL installed and started${NC}"
fi

# Step 7: Install Redis
echo ""
echo -e "${YELLOW}📋 Step 7/8: Installing Redis cache...${NC}"
if command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✅ Redis already installed${NC}"
else
    sudo apt-get install -y redis-server
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
    echo -e "${GREEN}✅ Redis installed and started${NC}"
fi

# Step 8: Setup directories
echo ""
echo -e "${YELLOW}📋 Step 8/8: Creating directory structure...${NC}"
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
chmod -R 755 /var/www

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

echo -e "${GREEN}✅ Directory structure created${NC}"

# Configure firewall
echo ""
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
echo -e "${GREEN}✅ Firewall configured${NC}"

# Setup PM2 startup
echo ""
echo -e "${YELLOW}⚙️  Configuring PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp $HOME | grep "sudo" | bash || true
echo -e "${GREEN}✅ PM2 startup configured${NC}"

# Install Certbot for SSL
echo ""
echo -e "${YELLOW}🔒 Installing Certbot for SSL certificates...${NC}"
if command -v certbot &> /dev/null; then
    echo -e "${GREEN}✅ Certbot already installed${NC}"
else
    sudo apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed${NC}"
fi

# Setup PostgreSQL database
echo ""
echo -e "${YELLOW}🗄️  Setting up PostgreSQL database...${NC}"
sudo -u postgres psql -c "CREATE DATABASE toolsdb;" 2>/dev/null || echo "Database might already exist"
sudo -u postgres psql -c "CREATE USER toolsuser WITH ENCRYPTED PASSWORD 'toolspass123';" 2>/dev/null || echo "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE toolsdb TO toolsuser;" 2>/dev/null || true
echo -e "${GREEN}✅ Database configured${NC}"

# Success banner
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ VPS Setup Complete!                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Display summary
echo -e "${BLUE}📊 Installed Software:${NC}"
echo -e "  ✅ Node.js: $(node --version)"
echo -e "  ✅ NPM: $(npm --version)"
echo -e "  ✅ PM2: $(pm2 --version)"
echo -e "  ✅ Nginx: Installed"
echo -e "  ✅ PostgreSQL: Installed"
echo -e "  ✅ Redis: Installed"
echo -e "  ✅ Certbot: Installed"
echo ""

# Display SSH Private Key for GitHub
echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  🔑 IMPORTANT: GitHub Secret Configuration        ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Copy this PRIVATE KEY for GitHub Secret: VPS_SSH_KEY${NC}"
echo -e "${YELLOW}(Copy entire content including BEGIN and END lines)${NC}"
echo ""
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cat ~/.ssh/id_rsa
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Display GitHub Secrets to add
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📝 Add These Secrets to GitHub Repository        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Go to: GitHub Repository → Settings → Secrets → Actions${NC}"
echo ""
echo -e "${YELLOW}Secret 1:${NC}"
echo -e "  Name:  VPS_HOST"
echo -e "  Value: $(curl -s ifconfig.me || hostname -I | awk '{print $1}')"
echo ""
echo -e "${YELLOW}Secret 2:${NC}"
echo -e "  Name:  VPS_USER"
echo -e "  Value: $USER"
echo ""
echo -e "${YELLOW}Secret 3:${NC}"
echo -e "  Name:  VPS_SSH_KEY"
echo -e "  Value: (Copy the private key shown above)"
echo ""
echo -e "${YELLOW}Secret 4 (Optional):${NC}"
echo -e "  Name:  VPS_PORT"
echo -e "  Value: 22"
echo ""

# Next steps
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Next Steps                                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}1.${NC} Copy the private key above and add to GitHub Secrets"
echo -e "${GREEN}2.${NC} Clone your repository to /var/www/"
echo -e "   ${YELLOW}cd /var/www${NC}"
echo -e "   ${YELLOW}git clone https://github.com/YOUR-USERNAME/cursor-agent-work.git${NC}"
echo ""
echo -e "${GREEN}3.${NC} Copy PM2 ecosystem config:"
echo -e "   ${YELLOW}cp /var/www/cursor-agent-work/ecosystem.config.js /var/www/${NC}"
echo ""
echo -e "${GREEN}4.${NC} When tools are built, start them with PM2:"
echo -e "   ${YELLOW}pm2 start /var/www/ecosystem.config.js${NC}"
echo -e "   ${YELLOW}pm2 save${NC}"
echo ""
echo -e "${GREEN}5.${NC} Setup Nginx (after getting domain):"
echo -e "   ${YELLOW}sudo nano /etc/nginx/sites-available/tools${NC}"
echo -e "   ${YELLOW}# Paste config from nginx-config-template.conf${NC}"
echo -e "   ${YELLOW}sudo ln -s /etc/nginx/sites-available/tools /etc/nginx/sites-enabled/${NC}"
echo -e "   ${YELLOW}sudo nginx -t${NC}"
echo -e "   ${YELLOW}sudo systemctl reload nginx${NC}"
echo ""
echo -e "${GREEN}6.${NC} Setup SSL (after domain DNS is configured):"
echo -e "   ${YELLOW}sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com${NC}"
echo ""

# Quick reference commands
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📚 Useful Commands                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${YELLOW}PM2 Commands:${NC}"
echo -e "    pm2 list                 - View all processes"
echo -e "    pm2 logs                 - View all logs"
echo -e "    pm2 restart all          - Restart all processes"
echo -e "    pm2 monit                - Real-time monitoring"
echo ""
echo -e "  ${YELLOW}System Commands:${NC}"
echo -e "    sudo systemctl status nginx    - Check Nginx status"
echo -e "    sudo nginx -t                  - Test Nginx config"
echo -e "    df -h                          - Check disk space"
echo -e "    free -h                        - Check memory"
echo ""

echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${YELLOW}⚠️  Don't forget to copy the private key above to GitHub Secrets!${NC}"
echo ""

