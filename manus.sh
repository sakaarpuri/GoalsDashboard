#!/bin/bash
# Manus API wrapper script
# Usage: ./manus.sh "your prompt here"

source "$(dirname "$0")/.env.manus" 2>/dev/null || true

if [ -z "$MANUS_API_KEY" ]; then
    echo "Error: MANUS_API_KEY not set"
    exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: ./manus.sh 'your prompt here'"
    exit 1
fi

curl -s -X POST https://api.manus.ai/v1/tasks \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "API_KEY: $MANUS_API_KEY" \
    -d "{
        \"prompt\": \"$1\"
    }" | jq '.' 2>/dev/null || cat
