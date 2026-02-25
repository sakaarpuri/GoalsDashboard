# TOOLS.md - Local Notes

## Manus AI API

- **API Key**: Stored in `.env.manus`
- **Base URL**: `https://api.manus.ai/v1`
- **Auth Header**: `API_KEY: <your_key>` (not Bearer)
- **Quick Test**: `./manus.sh "your prompt"`

### Common Endpoints
- `POST /v1/tasks` - Create AI task
- `GET /v1/tasks` - List tasks
- `POST /v1/files` - Upload files
- `POST /v1/webhooks` - Register webhooks

### Example Response
```json
{
  "task_id": "XZskNePxobUj2GHmHqve8E",
  "task_title": "Say Hello",
  "task_url": "https://manus.im/app/XZskNePxobUj2GHmHqve8E"
}
```

---

## AgentMail Configuration

**Working Setup (Verified Feb 2024):**
- Inbox: `ea2sakaar@agentmail.to`
- API Key: `AGENTMAIL_API_KEY` env var
- Recipient: `Puri.Sakaar@gmail.com`

**CRITICAL: Correct Endpoint**
```
POST https://api.agentmail.to/v0/inboxes/{inbox_id}/messages/send
```

**NOT** `/messages` (without `/send`) — returns 404.

**Python Pattern:**
```python
import requests
import os
import json

api_key = os.environ.get("AGENTMAIL_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
payload = {
    "to": ["Puri.Sakaar@gmail.com"],
    "subject": "Subject here",
    "text": "Body here"
}
url = "https://api.agentmail.to/v0/inboxes/ea2sakaar@agentmail.to/messages/send"
response = requests.post(url, headers=headers, data=json.dumps(payload))
```

**Troubleshooting:**
- 403 Forbidden: Usually temporary, retry in a few minutes
- 404: Wrong endpoint (missing `/send`)
- Check inbox: `GET /v0/inboxes/ea2sakaar@agentmail.to/messages`

---

## Tavily Search API

**API Key:** `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`

**Python Script:** `tavily_search.py`
```python
import requests

API_KEY = "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"

def search(query, count=5):
    url = "https://api.tavily.com/search"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {
        "query": query,
        "search_depth": "basic",
        "max_results": count
    }
    response = requests.post(url, headers=headers, json=payload)
    return response.json()
```

**Use when:** `web_search` tool unavailable (needs Brave API key)

---

## Whitelabl.in WordPress Access

**Credentials:**
- URL: `https://whitelabl.in/wp-login.php`
- Username: `openclaw`
- Password: `9T3uu6W5rc*wl(ND5sf(jhkQ`
- Role: Editor

**Login via Playwright:**
```python
await page.goto('https://whitelabl.in/wp-login.php')
await page.fill('input[name="log"]', 'openclaw')
await page.fill('input[name="pwd"]', '9T3uu6W5rc*wl(ND5sf(jhkQ')
await page.click('input[id="wp-submit"]')
```

**Product Count:** 20 products (as of Feb 24, 2026)

---

## Browser/Playwright Setup

**Installation:**
```bash
brew install playwright-cli
# Downloads Chromium automatically
```

**Test:**
```bash
playwright-cli open "https://google.com"
```

**Known Issues:**
- Docker containers need manual browser install (no systemd)
- Each `open` command creates new browser context — use single session for logins
- Use Playwright Python library for persistent sessions

---

## Job Search Automation

**Cron Jobs:**

| Job | Schedule | Status |
|-----|----------|--------|
| Daily London Creative Jobs | 2 PM UK time | ✅ Enabled |
| Daily AI Video Jobs | 10 AM ET | ✅ Enabled |

**Email Recipient:** Puri.Sakaar@gmail.com

**Format:** 5 regular roles + 3 surprise travel jobs

**CRITICAL: All job links must be VERIFIED active postings**
- Check posting date is recent (< 7 days ideally)
- Link must go to specific job page, not general careers page
- Verify "Apply" button is present and functional
- Avoid expired listings (check for "Job expired" or "No longer accepting applications")
- If Tavily returns stale results, browse company sites directly for "Latest jobs" or "New openings"

---

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

Add whatever helps you do your job. This is your cheat sheet.
