#!/bin/bash

# Script to start all tools on different ports
# Each tool runs on its own port: 3001-3010

echo "🚀 Starting all tools on different ports..."
echo "=========================================="

# Function to start a tool in background
start_tool() {
    local tool_name=$1
    local port=$2
    local tool_dir=$3
    
    echo "Starting $tool_name on port $port..."
    cd "$tool_dir"
    npm run dev > "../logs/${tool_name}.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/${tool_name}.pid"
    echo "✅ $tool_name started (PID: $pid) on port $port"
    cd ..
}

# Create logs directory
mkdir -p logs

# Start all tools
start_tool "tool-01-password-generator" "3001" "tool-01-password-generator"
start_tool "tool-02-token-counter" "3002" "tool-02-token-counter"
start_tool "tool-03-json-converter" "3003" "tool-03-json-converter"
start_tool "tool-04-cron-generator" "3004" "tool-04-cron-generator"
start_tool "tool-05-ai-prompt-library" "3005" "tool-05-ai-prompt-library"
start_tool "tool-06-timezone-scheduler" "3006" "tool-06-timezone-scheduler"
start_tool "tool-07-linkedin-formatter" "3007" "tool-07-linkedin-formatter"
start_tool "tool-08-color-palette" "3008" "tool-08-color-palette"
start_tool "tool-09-thumbnail-tester" "3009" "tool-09-thumbnail-tester"
start_tool "tool-10-qr-code-analytics" "3010" "tool-10-qr-code-analytics"

echo ""
echo "🎉 All tools are starting up!"
echo "=========================================="
echo "📱 Tool URLs:"
echo "  🔐 Password Generator:     http://localhost:3001"
echo "  📊 Token Counter:         http://localhost:3002"
echo "  🔄 JSON Converter:        http://localhost:3003"
echo "  ⏰ Cron Generator:        http://localhost:3004"
echo "  🤖 AI Prompt Library:     http://localhost:3005"
echo "  🌍 Timezone Scheduler:    http://localhost:3006"
echo "  💼 LinkedIn Formatter:    http://localhost:3007"
echo "  🎨 Color Palette:         http://localhost:3008"
echo "  🖼️  Thumbnail Tester:      http://localhost:3009"
echo "  📱 QR Code Analytics:     http://localhost:3010"
echo ""
echo "📝 Logs are saved in the 'logs' directory"
echo "🛑 To stop all tools, run: ./stop-all-tools.sh"
echo ""
echo "⏳ Waiting for tools to start up (this may take a moment)..."
sleep 10
echo "✅ Tools should be ready now!"
