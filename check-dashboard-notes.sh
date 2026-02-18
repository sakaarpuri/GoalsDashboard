#!/bin/bash
# Cron job: Check dashboard notes every 4 hours and notify

NOTES_FILE="/data/.openclaw/workspace/mission-control-notes.json"
LAST_CHECK_FILE="/data/.openclaw/workspace/.last_notes_check"

# Check if notes file exists
if [ ! -f "$NOTES_FILE" ]; then
    echo "No notes yet"
    exit 0
fi

# Get current notes content
CURRENT_NOTES=$(cat "$NOTES_FILE" 2>/dev/null | grep -o '"notes":"[^"]*"' | cut -d'"' -f4 | head -c 500)

# Get last checked content
if [ -f "$LAST_CHECK_FILE" ]; then
    LAST_NOTES=$(cat "$LAST_CHECK_FILE" 2>/dev/null)
else
    LAST_NOTES=""
fi

# If notes changed, create notification
if [ "$CURRENT_NOTES" != "$LAST_NOTES" ] && [ -n "$CURRENT_NOTES" ]; then
    # Save current state
    echo "$CURRENT_NOTES" > "$LAST_CHECK_FILE"
    
    # Create notification
    echo "📝 Dashboard Updated

New notes/tasks from user:
${CURRENT_NOTES}

---
View dashboard: http://localhost:8080" > /data/.openclaw/workspace/notification.txt
    
    echo "Notes changed - notification created"
else
    echo "No changes since last check"
fi
