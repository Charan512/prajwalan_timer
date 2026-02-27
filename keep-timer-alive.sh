#!/bin/bash

# Keep-alive script for Timer Synchronization Backend on Render
# Pings the endpoint every 5 minutes (300 seconds) to prevent cold starts and state resets.

API_URL="https://prajwalan-timer.onrender.com/api/ping"
INTERVAL=300

echo "Starting keep-alive service for Timer Backend: $API_URL"
echo "Ping interval: ${INTERVAL}s"
echo "Press Ctrl+C to stop"
echo "---"

while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    response=$(curl -s -w "\n%{http_code}" "$API_URL")
    http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        echo "[$timestamp] ✓ Timer Server Health check OK (200)"
    else
        echo "[$timestamp] ✗ Timer Server Health check failed (HTTP $http_code)"
    fi
    
    sleep $INTERVAL
done
