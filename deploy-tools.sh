#!/bin/bash

#############################################
# Simple Tool Deployment Script
# Run this directly on your VPS console
#############################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Deploying All 10 Tools to VPS                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"

# Function to deploy a single tool
deploy_tool() {
    local tool_name=$1
    local tool_dir=$2
    local port=$3
    
    echo -e "${YELLOW}📦 Deploying $tool_name...${NC}"
    
    cd /var/www/cursor-agent-work/$tool_dir
    
    # Install dependencies
    npm ci --production
    
    # Build the tool
    npm run build
    
    # Start with PM2
    pm2 delete $tool_name 2>/dev/null || true
    pm2 start npm --name "$tool_name" -- start
    pm2 save
    
    echo -e "${GREEN}✅ $tool_name deployed on port $port${NC}"
}

# Update system
echo -e "${YELLOW}🔧 Updating system...${NC}"
sudo apt update -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
fi

# Install Git if not present
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Git...${NC}"
    sudo apt install git -y
fi

# Create directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
sudo mkdir -p /var/www
cd /var/www

# Clone repository if not exists
if [ ! -d "cursor-agent-work" ]; then
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    sudo git clone https://github.com/aman-bashir/cursor-agent-work.git
    sudo chown -R $USER:$USER /var/www/cursor-agent-work
else
    echo -e "${YELLOW}🔄 Updating repository...${NC}"
    cd cursor-agent-work
    git pull origin main
fi

cd /var/www/cursor-agent-work

# Deploy all tools
echo -e "${YELLOW}🚀 Starting deployment of all tools...${NC}"

deploy_tool "tool-01" "tool-01-password-generator" "3001"
deploy_tool "tool-02" "tool-02-token-counter" "3002"
deploy_tool "tool-03" "tool-03-json-converter" "3003"
deploy_tool "tool-04" "tool-04-cron-generator" "3004"
deploy_tool "tool-05" "tool-05-ai-prompt-library" "3005"
deploy_tool "tool-06" "tool-06-timezone-scheduler" "3006"
deploy_tool "tool-07" "tool-07-linkedin-formatter" "3007"
deploy_tool "tool-08" "tool-08-color-palette" "3008"
deploy_tool "tool-09" "tool-09-thumbnail-tester" "3009"
deploy_tool "tool-10" "tool-10-qr-code-analytics" "3010"

# Show status
echo -e "${GREEN}🎉 All tools deployed successfully!${NC}"
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 list

echo -e "${BLUE}🌐 Your tools are now available at:${NC}"
echo -e "Tool 1: http://109.199.115.6:3001"
echo -e "Tool 2: http://109.199.115.6:3002"
echo -e "Tool 3: http://109.199.115.6:3003"
echo -e "Tool 4: http://109.199.115.6:3004"
echo -e "Tool 5: http://109.199.115.6:3005"
echo -e "Tool 6: http://109.199.115.6:3006"
echo -e "Tool 7: http://109.199.115.6:3007"
echo -e "Tool 8: http://109.199.115.6:3008"
echo -e "Tool 9: http://109.199.115.6:3009"
echo -e "Tool 10: http://109.199.115.6:3010"

echo -e "${GREEN}✅ Deployment complete!${NC}"
