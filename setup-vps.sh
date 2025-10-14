#!/bin/bash

# VPS Initial Setup Script for All 10 Tools
# Run this script ONCE on your VPS to set up everything

set -e  # Exit on error

echo "🚀 Starting VPS Setup for Tool Websites..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo -e "${YELLOW}📦 Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install build tools
sudo apt-get install -y build-essential

# Verify installations
echo -e "${GREEN}✅ Node version: $(node --version)${NC}"
echo -e "${GREEN}✅ NPM version: $(npm --version)${NC}"

# Install PM2 globally
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
sudo apt-get install -y nginx

# Install PostgreSQL
echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
sudo apt-get install -y postgresql postgresql-contrib

# Install Redis
echo -e "${YELLOW}📦 Installing Redis...${NC}"
sudo apt-get install -y redis-server

# Start services
echo -e "${YELLOW}🔄 Starting services...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
sudo mkdir -p /var/www
cd /var/www

# Clone repository (replace with your actual repo URL)
echo -e "${YELLOW}📥 Cloning repository...${NC}"
if [ ! -d "/var/www/cursor-agent-work" ]; then
    sudo git clone https://github.com/YOUR-USERNAME/cursor-agent-work.git
    cd cursor-agent-work
else
    cd cursor-agent-work
    sudo git pull origin main
fi

# Create individual tool directories
echo -e "${YELLOW}📁 Setting up tool directories...${NC}"

tools=(
    "tool-01-password-generator"
    "tool-02-token-counter"
    "tool-03-json-converter"
    "tool-04-cron-generator"
    "tool-05-ai-prompt-library"
    "tool-06-timezone-scheduler"
    "tool-07-linkedin-formatter"
    "tool-08-color-palette"
    "tool-09-thumbnail-tester"
    "tool-10-qr-code-analytics"
)

for tool in "${tools[@]}"; do
    if [ -d "/var/www/$tool" ]; then
        echo "  - $tool already exists, skipping..."
    else
        echo "  - Creating /var/www/$tool"
        sudo mkdir -p "/var/www/$tool"
    fi
done

# Set proper permissions
echo -e "${YELLOW}🔒 Setting permissions...${NC}"
sudo chown -R $USER:$USER /var/www
chmod -R 755 /var/www

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Copy PM2 ecosystem config
if [ -f "/var/www/cursor-agent-work/ecosystem.config.js" ]; then
    cp /var/www/cursor-agent-work/ecosystem.config.js /var/www/
    echo -e "${GREEN}✅ PM2 config copied${NC}"
fi

# Setup PostgreSQL database
echo -e "${YELLOW}🗄️  Setting up PostgreSQL database...${NC}"
sudo -u postgres psql -c "CREATE DATABASE toolsdb;" || echo "Database might already exist"
sudo -u postgres psql -c "CREATE USER toolsuser WITH ENCRYPTED PASSWORD 'changeme';" || echo "User might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE toolsdb TO toolsuser;"

# Install Certbot for SSL
echo -e "${YELLOW}🔒 Installing Certbot for SSL...${NC}"
sudo apt-get install -y certbot python3-certbot-nginx

# Setup firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# PM2 startup script
echo -e "${YELLOW}⚙️  Configuring PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp /home/$USER
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ VPS Setup Complete!              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Update GitHub repo URL in this script"
echo "2. Clone your repository to /var/www/"
echo "3. Build each tool: cd tool-XX && npm install && npm run build"
echo "4. Start PM2: pm2 start /var/www/ecosystem.config.js"
echo "5. Save PM2 config: pm2 save"
echo "6. Setup Nginx: Copy nginx-config-template.conf to /etc/nginx/sites-available/"
echo "7. Setup SSL: sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com"
echo ""
echo -e "${YELLOW}📚 View logs:${NC} pm2 logs"
echo -e "${YELLOW}🔄 Restart all:${NC} pm2 restart all"
echo -e "${YELLOW}📊 Check status:${NC} pm2 status"
echo ""

