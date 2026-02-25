# Job Search Automation Project

**Status:** Active  
**Started:** 2026-02-13  
**Goal:** Automate daily job search and email delivery for Sakaar Puri

## Overview
Automated system to find and deliver 5 creative roles + 3 surprise travel jobs daily via email.

## Success Metrics
- Jobs delivered daily at 2 PM UK time
- Email delivery success rate: >95%
- Job freshness: <7 days old
- Link accuracy: Direct to job posting (not careers page)

## Completed ✅

### Setup
- [x] AgentMail configured (ea2sakaar@agentmail.to)
- [x] Tavily API integrated for search
- [x] Cron job created: Daily at 2 PM UK time
- [x] Email template with 5 regular + 3 surprise jobs

### Tools Fixed
- [x] Browser automation (Playwright installed)
- [x] Search capability (Tavily working)
- [x] Email delivery (403 errors resolved)

## Active Jobs

### Daily London Creative Jobs - 2 PM
- **Schedule:** 0 14 * * * (Europe/London)
- **Status:** ✅ Enabled
- **Last run:** 2026-02-24 14:00 GMT
- **Next run:** 2026-02-25 14:00 GMT

### Daily AI Video Jobs - 10 AM
- **Schedule:** 0 10 * * * (America/New_York)
- **Status:** ✅ Enabled
- **Next run:** Daily 10 AM ET

## Requirements for Job Listings

**CRITICAL - Verified from TOOLS.md:**
- Check posting date is recent (< 7 days ideally)
- Link must go to specific job page, not general careers page
- Verify "Apply" button is present and functional
- Avoid expired listings (check for "Job expired" or "No longer accepting applications")
- If Tavily returns stale results, browse company sites directly for "Latest jobs" or "New openings"

## Target Keywords
- Creative roles: film production, development, storytelling, festival programming
- Travel jobs: location shoots, documentary expeditions, travel show production
- AI video: Runway, Pika, Synthesia, HeyGen, AI video editing

## Key Learnings
- Use Tavily (not web_search) - no Brave API needed
- AgentMail endpoint: `/messages/send` (not `/messages`)
- 403 errors are temporary - retry after a few minutes

## Next Actions
1. Monitor tomorrow's 2 PM run for delivery
2. Improve job link verification (browse directly if Tavily stale)
3. Add X/Twitter posting for job leads (when account ready)

---
#project #jobs #automation #active
