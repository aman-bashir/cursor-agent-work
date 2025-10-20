#!/bin/bash

# Script to stop all running tools

echo "🛑 Stopping all tools..."
echo "======================="

# Function to stop a tool
stop_tool() {
    local tool_name=$1
    local pid_file="logs/${tool_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo "Stopping $tool_name (PID: $pid)..."
            kill "$pid"
            echo "✅ $tool_name stopped"
        else
            echo "⚠️  $tool_name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  No PID file found for $tool_name"
    fi
}

# Stop all tools
stop_tool "tool-01-password-generator"
stop_tool "tool-02-token-counter"
stop_tool "tool-03-json-converter"
stop_tool "tool-04-cron-generator"
stop_tool "tool-05-ai-prompt-library"
stop_tool "tool-06-timezone-scheduler"
stop_tool "tool-07-linkedin-formatter"
stop_tool "tool-08-color-palette"
stop_tool "tool-09-thumbnail-tester"
stop_tool "tool-10-qr-code-analytics"

echo ""
echo "🎉 All tools have been stopped!"
echo "📁 Logs are preserved in the 'logs' directory"
